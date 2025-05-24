const config = require("baileys");
const fs = require("node:fs");
const axios = require("axios");
const mime = require("mime-types");
const Jimp = require("jimp");
const path = require("path");
const FileType = require("file-type");
const { parsePhoneNumber } = require('libphonenumber-js');

function PhoneNumber(number) {
  const phoneNumber = parsePhoneNumber(number);
  return {
    getNumber: (format = 'international') => {
      switch (format) {
        case 'international':
          return phoneNumber.formatInternational();
        case 'national':
          return phoneNumber.formatNational();
        case 'E.164':
          return phoneNumber.format('E.164');
        default:
          throw new Error('Format tidak dikenali');
      }
    }
  };
}
module.exports = (connection, store) => {
  global.ephemeral = {
    ephemeralExpiration: config.WA_DEFAULT_EPHEMERAL,
  };
  let system = config.makeWASocket(connection);
  system.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = config.jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };
 system.sendButton = async (
    jid,
    array,
    quoted,
    json = {},
  ) => {
    const result = [];

    for (const data of array) {
      if (data.type === "reply") {
        for (const pair of data.value) {
          result.push({
          	buttonId: pair[1],
		  	buttonText: {
				displayText: pair[0]
			},
			nativeFlowInfo: {
				name: "quick_reply",
                paramsJson: JSON.stringify({
                  display_text: pair[0],
                  id: pair[1],
               }),
			},
			type: 2 
		 });
        }
      } else if (data.type === "bubble") {
        for (const pair of data.value) {
          result.push({
			buttonId: pair[1],
		  	buttonText: {
				displayText: pair[0]
			},
	  		type: 1
		 });
        }
      } else if (data.type === "url") {
        for (const pair of data.value) {
          result.push({
          	buttonId: pair[1],
		  	buttonText: {
				displayText: pair[0]
			},
			nativeFlowInfo: {
				name: "cta_url",
				paramsJson: JSON.stringify({
			   	  display_text: pair[0],
                  url: pair[1],
                  merchant_url: pair[1]
               }),
			},
			type: 2
	     });
		}
      } else if (data.type === "copy") {
        for (const pair of data.value) {
          result.push({
          	buttonId: pair[1],
		  	buttonText: {
				displayText: pair[0]
			},
			nativeFlowInfo: {
				name: "cta_copy",
                paramsJson: JSON.stringify({
                  display_text: pair[0],
                  copy_code: pair[1],
                 }),
			},
			type: 2
		 });
        }
      } else if (data.type === "list") {
        let transformedData = data.value.map((item) => ({
          ...(item.headers
            ? {
                title: item.headers,
              }
            : {}),
          rows: item.rows.map((row) => ({
            header: row.headers,
            title: row.title,
            description: row.body,
            id: row.command,
          })),
        }));

        let sections = transformedData;
        const listMessage = {
          title: data.title,
          sections,
        };
        result.push({
        	buttonId: pair[1],
		  	buttonText: {
				displayText: pair[0]
			},
			nativeFlowInfo: {
				name: "single_select",
                paramsJson: JSON.stringify(listMessage),
			},
			type: 2
		});
      }
    }  
    return system.sendMessage(jid, {
    ...json,
	buttons: result,
    headerType: 1,
	viewOnce: true
    }, { quoted: quoted, ...global.ephemeral });
  };
    system.sendButtonMessage = async (
    jid,
    array,
    quoted,
    json = {},
    options = {},
  ) => {
    const result = [];

    for (const data of array) {
      if (data.type === "reply") {
        for (const pair of data.value) {
          result.push({
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: pair[0],
              id: pair[1],
            }),
          });
        }
      } else if (data.type === "bubble") {
        for (const pair of data.value) {
          result.push({
			buttonId: pair[1],
		  	buttonText: {
				displayText: pair[0]
			},
	  		type: 1
		 });
        }
      } else if (data.type === "url") {
        for (const pair of data.value) {
          result.push({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: pair[0],
              url: pair[1],
              merBott_url: pair[1],
            }),
          });
        }
      } else if (data.type === "copy") {
        for (const pair of data.value) {
          result.push({
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: pair[0],
              copy_code: pair[1],
            }),
          });
        }
      } else if (data.type === "list") {
        let transformedData = data.value.map((item) => ({
          ...(item.headers
            ? {
                title: item.headers,
              }
            : {}),
          rows: item.rows.map((row) => ({
            header: row.headers,
            title: row.title,
            description: row.body,
            id: row.command,
          })),
        }));

        let sections = transformedData;
        const listMessage = {
          title: data.title,
          sections,
        };
        result.push({
          name: "single_select",
          buttonParamsJson: JSON.stringify(listMessage),
        });
      }
    }

    let msg;
    if (json.url) {
      let file = await system.getFile(json.url);
      let mime = file.mime.split("/")[0];
      let mediaMessage = await config.prepareWAMessageMedia(
        {
          ...(mime === "image"
            ? {
                image: file.data,
              }
            : mime === "video"
              ? {
                  video: file.data,
                }
              : {
                  document: file.data,
                  mimetype: file.mime,
                  fileName:
                    json.filename || "NekoBot." + extension(file.mime),
                }),
        },
        {
          upload: system.waUploadToServer,
        },
      );

      msg = config.generateWAMessageFromContent(
        jid,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage:
                config.proto.Message.InteractiveMessage.create({
                  body: config.proto.Message.InteractiveMessage.Body.create({
                    text: json.body,
                  }),
                  footer: config.proto.Message.InteractiveMessage.Footer.create(
                    {
                      text: json.footer,
                    },
                  ),
                  header: config.proto.Message.InteractiveMessage.Header.create(
                    {
                      hasMediaAttachment: true,
                      ...mediaMessage,
                    },
                  ),
                  nativeFlowMessage:
                    config.proto.Message.InteractiveMessage.NativeFlowMessage.create(
                      {
                        buttons: result,
                      },
                    ),
                  ...options,
                }),
            },
          },
        },
        {
          userJid: system.user.jid,
          quoted,
          upload: system.waUploadToServer,
          ...ephemeral,
        },
      );
    } else {
      msg = config.generateWAMessageFromContent(
        jid,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage:
                config.proto.Message.InteractiveMessage.create({
                  body: config.proto.Message.InteractiveMessage.Body.create({
                    text: json.body,
                  }),
                  footer: config.proto.Message.InteractiveMessage.Footer.create(
                    {
                      text: json.footer,
                    },
                  ),
                  header: config.proto.Message.InteractiveMessage.Header.create(
                    {
                      hasMediaAttachment: false,
                    },
                  ),
                  nativeFlowMessage:
                    config.proto.Message.InteractiveMessage.NativeFlowMessage.create(
                      {
                        buttons:
                          result.length > 0
                            ? result
                            : [
                                {
                                  text: "",
                                },
                              ],
                      },
                    ),
                  ...options,
                }),
            },
          },
        },
        {
          userJid: system.user.jid,
          quoted,
          upload: system.waUploadToServer,
          ...ephemeral,
        },
      );
    }

    await system.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
    });
    return msg;
  };
  system.appendTextMessage = async (m, text, chatUpdate) => {
    let messages = await config.generateWAMessage(
      m.cht,
      {
        text: text,
        mentions: m.mentions,
      },
      {
        userJid: system.user.id,
        quoted: m.quoted,
        ...ephemeral,
      },
    );
    messages.key.fromMe = config.areJidsSameUser(m.sender, system.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [config.proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    system.ev.emit("messages.upsert", msg);
    return m;
  };

  system.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  system.getFile = async (PATH) => {
    let res, filename;
    const data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? (res = await axios.get(PATH, {
              responseType: "arraybuffer",
            }))
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    if (!Buffer.isBuffer(data.data || data))
      throw new TypeError("Result is not a buffer");
    const type = res
      ? {
          mime: res.headers["content-type"],
          ext: mime.extension(res.headers["content-type"]),
        }
      : (await FileType.fromBuffer(data)) || {
          mime: "application/bin",
          ext: ".bin",
        };

    return {
      filename,
      ...type,
      data: data.data ? data.data : data,
      deleteFile() {
        return filename && fs.promises.unlink(filename);
      },
    };
  };

  system.sendContact = async (jid, data, quoted, options) => {
    if (!Array.isArray(data[0]) && typeof data[0] === "string") data = [data];
    let contacts = [];
    for (let [number, name] of data) {
      number = number.replace(/[^0-9]/g, "");
      let njid = number + "@s.whatsapp.net";
      let biz = (await system.getBusinessProfile(njid).catch((_) => null)) || {};
      let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, "\\n")}
ORG:
item1.TEL;waid=${number}:${PhoneNumber("+" + number).getNumber("international")}
item1.X-ABLabel:Ponsel${
        biz.description
          ? `
item2.EMAIL;type=INTERNET:${(biz.email || "").replace(/\n/g, "\\n")}
item2.X-ABLabel:Email
PHOTO;BASE64:${((await system.getFile(await system.profilePictureUrl(njid)).catch((_) => ({}))) || {}).number?.toString("base64")}
X-WA-BIZ-DESCRIPTION:${(biz.description || "").replace(/\n/g, "\\n")}
X-WA-BIZ-NAME:${name.replace(/\n/g, "\\n")}
`
          : ""
      }
END:VCARD
`.trim();
      contacts.push({
        vcard,
        displayName: name,
      });
    }
    return system.sendMessage(
      jid,
      {
        ...options,
        contacts: {
          ...options,
          displayName:
            (contacts.length >= 2
              ? `${contacts.length} kontak`
              : contacts[0].displayName) || null,
          contacts,
        },
      },
      {
        quoted: quoted,
        ...options,
        ...ephemeral,
      },
    );
    enumerable: true;
  };
  const fetchParticipants = async (...jids) => {
  let results = [];
  for (const jid of jids) {
    let { participants } = await system.groupMetadata(jid);
    participants = participants.map(({ id }) => id);
    results = results.concat(participants);
  }
  return results;
};

system.sendStatus = async(content, jids) => {
  const msg = await config.generateWAMessage(config.STORIES_JID, content, {
    upload: system.waUploadToServer
  });

  let statusJidList = [];
  for(const _jid of jids) {
    if(_jid.endsWith("@g.us")) {
      for(const jid of await fetchParticipants(_jid)) {
        statusJidList.push(jid);
      }
    } else {
      statusJidList.push(_jid);
    }
  }
  statusJidList = [
    ...new Set(
      statusJidList
    )
  ];

  await system.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
    statusJidList,
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: jids.map((jid) => ({
              tag: "to",
              attrs: {
                jid
              },
              content: undefined
            }))
          }
        ]
      }
    ]
  });

  for(const jid of jids) {
    let type = (
      jid.endsWith("@g.us") ? "groupStatusMentionMessage" :
      "statusMentionMessage"
    );
    await system.relayMessage(jid, {
      [type]: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {
      additionalNodes: [
        {
          tag: "meta",
          attrs: {
            is_status_mention: "true"
          },
          content: undefined
        }
      ]
    });
  }
  return msg;
}
/*  system.getName = async (jid = "", withoutContact = false) => {
    jid = system.decodeJid(jid);
    withoutContact = system.withoutContact || withoutContact;
    let v;
    if (jid.endsWith("@g.us")) {
      v = system.chats[jid] || {};
      if (!(v.name || v.subject)) {
        return system
          .groupMetadata(jid)
          .then(
            (metadata) =>
              metadata || store?.fetchGroupMetadata(jid, system.groupMetadata),
          )
          .then((metadata) => metadata || {})
          .then(
            (metadata) =>
              metadata.name ||
              metadata.subject ||
              PhoneNumber("+" + Number(parseInt(jid))).getNumber(
                "international",
              ),
          );
      }
      return (
        v.name ||
        v.subject ||
        PhoneNumber("+" + Number(parseInt(jid))).getNumber("international")
      );
    }
    if (jid.endsWith("@newsletter")) {
      v = system.chats[jid] || {};
      if (!(v.name || v.subject)) {
        return system
          .newsletterMetadata("jid", jid)
          .then((metadata) => metadata || {})
          .then(
            (metadata) =>
              metadata.name ||
              metadata.subject ||
              PhoneNumber("+" + Number(parseInt(jid))).getNumber(
                "international",
              ),
          );
      }
      return (
        v.name ||
        v.subject ||
        PhoneNumber("+" + Number(parseInt(jid))).getNumber("international")
      );
    }
    v =
      jid === "0@s.whatsapp.net"
        ? {
            jid: jid,
            vname: "WhatsApp",
          }
        : config.areJidsSameUser(jid, system.user.id)
          ? system.user
          : {};
    return withoutContact
      ? ""
      : v.name
        ? v.name
        : v.subject
          ? v.subject
          : v.vname
            ? v.vname
            : v.notify
              ? v.notify
              : v.verifiedName
                ? v.verifiedName
                : PhoneNumber("+" + Number(parseInt(jid))).getNumber(
                    "international",
                  );
  };*/
  system.sendFile = async (
    jid,
    media,
    filename = null,
    caption = null,
    quoted = null,
    options = {},
  ) => {
    let buffer;
    let mimeType;
    let ext;
    let data = await system.getFile(media);
    buffer = data.data;
    mimeType = data.mime || "application/octet-stream";
    ext = data.ext || ".tmp";
    let isSticker = false;
    if (data.ext === "webp") return (isSticker = true);
    if (options && options.useDocument) {
      return system.sendMessage(
        jid,
        {
          document: buffer,
          fileName: filename || "file." + ext,
          caption: caption,
          mimetype: mimeType,
          ...options,
        },
        {
          quoted: quoted,
          ...global.ephemeral,
        },
      );
    } else if (/image/.test(mimeType) && !isSticker) {
      return system.sendMessage(
        jid,
        {
          image: buffer,
          mimetype: mimeType,
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...global.ephemeral,
        },
      );
    } else if (/video/.test(mimeType)) {
      return system.sendMessage(
        jid,
        {
          video: buffer,
          mimetype: mimeType,
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...global.ephemeral,
        },
      );
    } else if (/audio/.test(mimeType)) {
      return system.sendMessage(
        jid,
        {
          audio: buffer,
          ...options,
        },
        {
          quoted: quoted,
          ...global.ephemeral,
        },
      );
    } else {
      return system.sendMessage(
        jid,
        {
          document: buffer,
          fileName: filename || "file." + ext,
          mimetype: mimeType,
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...global.ephemeral,
        },
      );
    }
  };
  system.addToLog = async (pesan, opt) => {
    if (opt.isError) {
      console.error(pesan)
    } else {
      console.log(pesan)
    }
  };
  system.sendMessageWithThumb = async (jid, pesan, opt) => {
    await system.sendMessage(
        jid,
        {
          text: pesan,
          contextInfo: {
             mentionedJid: [...system.parseMention(pesan)],
             externalAdReply: {
                 title: "Suzaku || New Bot",
                 body: "SuzakuTeam",
                 mediaType: 1,
                 thumbnailUrl: "https://files.catbox.moe/1463l1.jpg",
                 sourceUrl: "https://suzaku.gov/",
                 renderLargerThumbnail: true
             }
         },
          ...opt,
        },
        {
          quoted: m,
          ephemeralExpiration: m.expiration,
          ...opt,
        },
      );
  }
  system.resize = async (image, width, height) => {
    let oyy = await Jimp.read(image);
    let kiyomasa = await oyy
      .resize(width, height)
      .getBufferAsync(Jimp.MIME_JPEG);
    return kiyomasa;
  };
  system.cMod = (
    jid,
    message,
    text = "",
    sender = system.user.jid,
    options = {},
  ) => {
    let copy = message;
    delete copy.message.messageContextInfo;
    delete copy.message.senderKeyDistributionMessage;
    let mtype = Object.keys(copy.message)?.[0];
    let isEphemeral = false;
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral
      ? copy.message.ephemeralMessage.message
      : copy.message;
    let content = msg[mtype];
    if (typeof content === "string") msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== "string")
      msg[mtype] = {
        ...content,
        ...options,
      };
    if (copy.participant)
      sender = copy.participant = sender || copy.participant;
    else if (copy.key.participant)
      sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes("@s.whatsapp.net"))
      sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes("@broadcast"))
      sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = config.areJidsSameUser(sender, system.user.id) || false;
    return config.proto.WebMessageInfo.fromObject(copy);
  };
  system.copyNForward = async (
    jid,
    message,
    forwardingScore = true,
    quoted,
    options = {},
  ) => {
    let m = config.generateForwardMessageContent(message, !!forwardingScore);
    let mtype = Object.keys(m)[0];
    if (
      forwardingScore &&
      typeof forwardingScore == "number" &&
      forwardingScore > 1
    )
      m[mtype].contextInfo.forwardingScore += forwardingScore;
    m = config.generateWAMessageFromContent(jid, m, {
      ...options,
      userJid: system.user.id,
      quoted,
    });
    await system.relayMessage(jid, m.message, {
      messageId: m.key.id,
      additionalAttributes: {
        ...options,
      },
    });
    return m;
  };

  system.downloadM = async (m, type, saveToFile) => {
    if (!m || !(m.url || m.directPath)) return Buffer.alloc(0);
    const stream = await config.downloadContentFromMessage(m, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    if (saveToFile) var { filename } = await system.getFile(buffer, true);
    return saveToFile && fs.existsSync(filename) ? filename : buffer;
  };

  system.parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net",
    );
  };

  system.setBio = async (status) => {
    return await system.query({
      tag: "iq",
      attrs: {
        to: "s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    // <iq to="s.whatsapp.net" type="set" xmlns="status" id="21168.6213-69"><status>"Hai, saya menggunakan WhatsApp"</status></iq>
  };

  system.serializeM = (m) => {
    return require("./serialize")(m, system, store);
  };

  Object.defineProperty(system, "name", {
    value: "WAsystemet",
    configurable: true,
  });
  

  return system;
};
