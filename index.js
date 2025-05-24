(async () => {
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    Browsers,
    proto,
    makeInMemoryStore,
    DisconnectReason,
    delay,
    generateWAMessage,
    getAggregateVotesInPollMessage,
    areJidsSameUser,
  } = require("baileys");
  const pino = require("pino");
  const { Boom } = require("@hapi/boom");
  const chalk = require("chalk");
  const readline = require("node:readline");
  const simple = require("./lib/simple.js");
  const fs = require("node:fs");
  const pkg = require("./package.json");
  const NodeCache = require("node-cache");
  const moment = require("moment-timezone");
  const Queque = require("./lib/queque.js");
  const messageQueue = new Queque();
  const Database = require("./lib/database.js");
  const append = require("./lib/append");
  const serialize = require("./lib/serialize.js");
  const config = require("./settings.js");

  const appenTextMessage = async (m, system, text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.key.remoteJid,
      {
        text: text,
      },
      {
        quoted: m.quoted,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, system.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    return system.ev.emit("messages.upsert", msg);
  };

  const question = (text) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(text, resolve);
    });
  };
  global.db = new Database(config.database + ".json");
  await db.init();

  global.pg = new (await require(process.cwd() + "/lib/plugins"))(
    process.cwd() + "/system/plugins",
  );
  await pg.watch();

  global.scraper = new (await require(process.cwd() + "/scrapers"))(
    process.cwd() + "/scrapers/src",
  );
  await scraper.watch();

  setInterval(async () => {
    await db.save();
    await pg.load();
    await scraper.load();
  }, 2000);

  const store = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store",
    }),
  });
  
  async function systems() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessions);
    const groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false});
      
    const system = simple(
      {
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
        version: [2, 3000, 1019441105],
        isAutoReconnect: true, 
        browser: Browsers.ubuntu("Edge"),
      },
      store,    
    );
    store.bind(system.ev);
    if (!system.authState.creds.registered) {
      console.log(
        chalk.white.bold(
          "- Silakan masukkan nomor WhatsApp Anda, misalnya +628xxxx",
        ),
      );
      const phoneNumber = await question(chalk.green.bold(`– Nomor Anda: `));
      const code = await system.requestPairingCode(phoneNumber, {
        isRandomPairing: true, 
        customKey: ""
      });
      setTimeout(() => {
        console.log(chalk.white.bold("- Kode Pairing Anda: " + code));
      }, 5000);
    }

    //=====[ Pembaruan Koneksi ]======
    system.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
          
        } else if (reason === DisconnectReason.badSession) {
          console.log(
            chalk.red.bold("File sesi buruk, Harap hapus sesi dan scan ulang"),
          );
          
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log(
            chalk.yellow.bold("Koneksi ditutup, sedang mencoba untuk terhubung kembali..."),
          );

        } else if (reason === DisconnectReason.connectionLost) {
          console.log(
            chalk.yellow.bold("Koneksi hilang, mencoba untuk terhubung kembali..."),
          );
          
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log(
            chalk.green.bold("Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan."),
          );
          system.logout();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(
            chalk.green.bold("Perangkat logout, harap scan ulang."),
          );
          system.logout();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log(chalk.green.bold("Restart diperlukan, sedang memulai ulang..."));
          system();
        } else if (reason === DisconnectReason.timedOut) {
          console.log(
            chalk.green.bold("Koneksi waktu habis, sedang mencoba untuk terhubung kembali..."),
          );
          system();
        }
      } else if (connection === "connecting") {
        console.log(chalk.blue.bold("Menghubungkan ke WhatsApp..."));
      } else if (connection === "open") {
        console.log(chalk.green.bold("Bot berhasil terhubung."));
      }
    });

    //=====[ Setelah Pembaruan Koneksi ]========//
    system.ev.on("creds.update", saveCreds);

    system.ev.on("contacts.update", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = {
            ...(store.contacts?.[id] || {}),
            ...(contact || {}),
          };
      }
    });

    system.ev.on("contacts.upsert", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = { ...(contact || {}), isContact: true };
      }
    });

    system.ev.on("groups.update", async(updates) => {
      for (const update of updates) {
        const id = update.id;
        const metadata = await system.groupMetadata(id);
        groupCache.set(id, metadata)
        if (store.groupMetadata[id]) {
          store.groupMetadata[id] = {
            ...(store.groupMetadata[id] || {}),
            ...(update || {}),
          };
        }
      }
    });

    system.ev.on("group-participants.update", ({ id, participants, action }) => {
      const metadata = store.groupMetadata[id];
      groupCache.set(id, metadata)
      if (metadata) {
        switch (action) {
          case "add":
          case "revoked_membership_requests":
            metadata.participants.push(
              ...participants.map((id) => ({
                id: jidNormalizedUser(id),
                admin: null,
              })),
            );
            break;
          case "demote":
          case "promote":
            for (const participant of metadata.participants) {
              let id = jidNormalizedUser(participant.id);
              if (participants.includes(id)) {
                participant.admin = action === "promote" ? "admin" : null;
              }
            }
            break;
          case "remove":
            metadata.participants = metadata.participants.filter(
              (p) => !participants.includes(jidNormalizedUser(p.id)),
            );
            break;
        }
      }
    });

    async function getMessage(key) {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg;
      }
      return {
        conversation: "NekoBot",
      };
    }

    system.ev.on("messages.upsert", async (cht) => {
      if (cht.messages.length === 0) return;
      const chatUpdate = cht.messages[0];
      if (!chatUpdate.message) return;
      const userId = chatUpdate.key.id;
      global.m = await serialize(chatUpdate, system, store);     
      if (m.isBot) return;
      require("./lib/logger.js")(m);      
      if (!m.isOwner && db.list().settings.self) return;
      await require("./system/handler.js")(m, system, store);
    });

    system.ev.on("messages.update", async (chatUpdate) => {
      for (const { key, update } of chatUpdate) {
        if (update.pollUpdates && key.fromMe) {
          const pollCreation = await getMessage(key);
          if (pollCreation) {
            let pollUpdate = await getAggregateVotesInPollMessage({
              message: pollCreation?.message,
              pollUpdates: update.pollUpdates,
            });
            let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
              ?.name;
            console.log(toCmd);
            await appenTextMessage(m, system, toCmd, pollCreation);
            await system.sendMessage(m.cht, { delete: key });
          } else return false;
          return;
        }
      }
    });

    return system;
  }
  systems();
})();
