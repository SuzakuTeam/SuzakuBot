let handler = async (m, ctx, { system, text, config }) => {
  if (!text) return m.reply(`> Masukkan Feature Yang Ingin Anda Request!\n> *${m.command} TiktokDl*`)
  
  try {
    let caption = `*[ SYSTEM REQUEST ]*
> *Sender: ${m.sender.replace("@s.whatsapp.net", "")}*
> *Pushname: ${m.pushName}*
> *Pesan: ${text}*
`
    system.sendMessage(config.reportNumber + "@s.whatsapp.net", {
      text: caption
      })
    m.reply(`> *Berhasil Mengirim Request!*\n*Terimkasih Telah Berkontribusi*`)
  } catch (e) {
    console.error(e.message)
    return m.reply("Gagal Mengirim Report!")
  }
}

handler.command = "request";
handler.alias = ["req"];
handler.category = ["tools"];
handler.description = "";
handler.settings = {};

module.exports = handler;