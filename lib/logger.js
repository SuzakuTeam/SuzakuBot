const color = require("chalk");

module.exports = (m) => {
    const divider = color.gray("────────────────────────────────────────────────");

    let info = "";
    let chatType = m.isGroup
  ? "Group Chat"
  : m.cht.endsWith("@newsletter")
    ? "Channel Chat"
    : "Private Chat";
    info += `\n${divider}\n`;
    info += color.hex("#FF5F1F").bold("🔥 Suzaku Bot | Detailed Chat Information") + "\n";
    info += `${divider}\n`;

    info += color.white("🗨️ Dari         : ") + color.greenBright(chatType) + "\n";
    info += color.white("🙋 Nama         : ") + color.magentaBright(m.pushName || "Anonim") + "\n";
    info += color.white("📂 Tipe Pesan   : ") + color.cyanBright(m.type) + "\n";
    info += color.white("🆔 ID Pesan     : ") + color.yellowBright(m.id) + "\n";
    info += color.white("⏳ Timestamp    : ") + color.blueBright(new Date(m.timestamps).toLocaleString()) + "\n";

    if (m.isGroup) {
        info += color.white("👥 Subject      : ") + color.yellowBright(m.metadata?.subject || "Unknown Group") + "\n";
        info += color.white("👤 Participant  : ") + color.cyanBright(m.participant || "Unknown") + "\n";
    } else {
        info += color.white("👤 Pengirim     : ") + color.cyanBright(m.sender) + "\n";
    }

    info += color.white("🤖 Dari Bot     : ") + color.greenBright(m.isBot ? "Yes" : "No") + "\n";
    info += color.white("⭐ Owner Mode   : ") + color.redBright(m.isOwner ? "Yes" : "No") + "\n";
    info += `${divider}\n`;

    const body = m.body.startsWith(m.prefix)
        ? color.yellowBright(`✏️ Pesan        : ${m.body}`)
        : color.white(`✏️ Pesan        : ${m.body}`);
    info += `${body}\n`;

    if (m.command) {
        info += color.white("🛠️ Command      : ") + color.greenBright(m.command) + "\n";
    }

    if (m.args && m.args.length > 0) {
        info += color.white("📝 Args         : ") + color.cyanBright(m.args.join(", ")) + "\n";
    }

    info += color.white("🖼️ Ada Media    : ") + color.magentaBright(m.isMedia ? "Yes" : "No") + "\n";
    info += color.white("📌 Is Quoted    : ") + color.magentaBright(m.isQuoted ? "Yes" : "No") + "\n";

    info += `${divider}\n`;
    info += color.gray("🌐 Channel      : ") + color.cyanBright("https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E") + "\n";
    info += color.gray("💻 GitHub       : ") + color.cyanBright("https://github.com/SxyzVerse") + "\n";
    info += `${divider}\n`;

    console.log(info);
};