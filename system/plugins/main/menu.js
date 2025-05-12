const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  command: "menu",
  alias: ["menu", "help"],
  category: ["main"],
  description: "Menampilkan menu bot",
  loading: true,
  async run(m, ctx, { system, conn, sock, client, plugins, config, Func, text }) {
    let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
    let casePattern = /case\s+"([^"]+)"/g;
    let matches = data.match(casePattern);
    if (!matches) return m.reply("Tidak ada case yang ditemukan.");
    matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));
    let menu = {};
    plugins.forEach((item) => {
      if (item.category && item.command && item.alias) {
        item.category.forEach((cat) => {
          if (!menu[cat]) {
            menu[cat] = { command: [] };
          }
          menu[cat].command.push({
            name: item.command,
            alias: item.alias,
            settings: item.settings,
          });
        });
      }
    });
    let cmd = 0;
    let alias = 0;
    let pp = await system
      .profilePictureUrl(m.sender, "image")
      .catch(() => "https://files.catbox.moe/1463l1.jpg");

    Object.values(menu).forEach((category) => {
      cmd += category.command.length;
      category.command.forEach((command) => {
        alias += command.alias.length;
      });
    });

    let premium = db.list().user[m.sender].premium.status;
    let limit = db.list().user[m.sender].limit;

    const header = `╭───〔 *Suzaku Bot* 〕───╮
│  ✦ Hai, saya Suzaku!
│  ✦ Bot WhatsApp siap membantu.
╰────────────────────╯`;

    const footer = `
╭──〔 *Info Tambahan* 〕
│  ❖ Jika ada masalah, hubungi Developer.
│  ❖ Script: https://github.com/SxyzVerse/SUZAKU
│  ❖ Channel: https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E
╰───────────────╯
> 🥈 = Limit    🥇 = Premium
───────────────────`;

    if (text === "all") {
      let caption = `${header}

╭──〔 *Info Pengguna* 〕
│ ❖ Nama: ${m.pushName}
│ ❖ Tag: @${m.sender.split("@")[0]}
│ ❖ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
│ ❖ Limit: ${m.isOwner ? "Tak Terbatas" : limit}
╰──────────────────╯

╭──〔 *Info Bot* 〕
│ ❖ Nama: ${pkg.name}
│ ❖ Versi: v${pkg.version}
│ ❖ Aktif: ${Func.toDate(process.uptime() * 1000)}
│ ❖ Prefix: [ ${m.prefix} ]
│ ❖ Total Perintah: ${cmd + alias + matches.length}
╰──────────────────╯

╭──〔 *Menu – Other* 〕
${matches.map((a, i) => `│ ❖ (${i + 1}) ${m.prefix + a}`).join("\n")}
╰──────────────────╯`;

      Object.entries(menu).forEach(([tag, commands]) => {
        caption += `

╭──〔 *Menu – ${tag.toUpperCase()}* 〕
${commands.command.map((command, index) => `│ ❖ (${index + 1}) ${m.prefix + command.name} ${command.settings?.premium ? "🥇" : command.settings?.limit ? "🥈" : ""}`).join("\n")}
╰──────────────────╯`;
      });

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: system.parseMention(caption),
          externalAdReply: {
            title: "© Suzaku | Playground",
            body: "Bot WhatsApp - Simple & Powerful",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E",
            thumbnailUrl: "https://files.catbox.moe/1463l1.jpg",
            renderLargerThumbnail: true,
          },
        },
      });
    } else if (Object.keys(menu).includes(text.toLowerCase())) {
      let list = menu[text.toLowerCase()];
      let caption = `${header}

╭──〔 *Info Pengguna* 〕
│ ❖ Nama: ${m.pushName}
│ ❖ Tag: @${m.sender.split("@")[0]}
│ ❖ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
│ ❖ Limit: ${m.isOwner ? "Tak Terbatas" : limit}
╰──────────────────╯

╭──〔 *Info Bot* 〕
│ ❖ Nama: ${pkg.name}
│ ❖ Versi: v${pkg.version}
│ ❖ Aktif: ${Func.toDate(process.uptime() * 1000)}
│ ❖ Prefix: [ ${m.prefix} ]
│ ❖ Total Perintah: ${cmd + alias + matches.length}
╰──────────────────╯

╭──〔 *Menu – ${text.toUpperCase()}* 〕
${list.command.map((a, i) => `│ ❖ (${i + 1}) ${m.prefix + a.name} ${a.settings?.premium ? "🥇" : a.settings?.limit ? "🥈" : ""}`).join("\n")}
╰──────────────────╯`;

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: system.parseMention(caption),
          externalAdReply: {
            title: "© Suzaku | Playground",
            body: "Bot WhatsApp - Simple & Powerful",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E",
            thumbnailUrl: "https://files.catbox.moe/1463l1.jpg",
            renderLargerThumbnail: true,
          },
        },
      });
    } else {
      let list = Object.keys(menu);
      let caption = `${header}

╭──〔 *Info Pengguna* 〕
│ ❖ Nama: ${m.pushName}
│ ❖ Tag: @${m.sender.split("@")[0]}
│ ❖ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
│ ❖ Limit: ${m.isOwner ? "Tak Terbatas" : limit}
╰──────────────────╯

╭──〔 *Info Bot* 〕
│ ❖ Nama: ${pkg.name}
│ ❖ Versi: v${pkg.version}
│ ❖ Aktif: ${Func.toDate(process.uptime() * 1000)}
│ ❖ Prefix: [ ${m.prefix} ]
│ ❖ Total Perintah: ${cmd + alias + matches.length}
╰──────────────────╯

╭──〔 *Daftar Menu* 〕
│ ❖ ( all ) ${m.prefix}menu all
${list.map((a) => `│ ❖ ( ${a} ) ${m.prefix}menu ${a}`).join("\n")}
╰──────────────────╯`;

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: system.parseMention(caption),
          externalAdReply: {
            title: "© Suzaku | Playground",
            body: "Bot WhatsApp - Simple & Powerful",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E",
            thumbnailUrl: "https://files.catbox.moe/1463l1.jpg",
            renderLargerThumbnail: true,
          },
        },
      });
    }
  },
};