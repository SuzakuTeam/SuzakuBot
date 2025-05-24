let handler = async (m, ctx, { system, text, config }) => {
  if (!text) return m.reply(`> Masukkan Feature Yang Error!\n*.${m.command} Error Tiktok Downloader Bang*`)
  
  try {
    let caption = `*[ SYSTEM REPORT ]*
> *Sender: ${m.sender}*
> *Pushname: ${m.pushName}*
> *Pesan: ${text}*
`
    system.sendMessage(config.reportNumber + "@s.whatsapp.net", {
      text: caption
      })
    m.reply(`*Berhasil Mengirim Report!*\n*Terima Kasih Telah Berkontribusi Untuk Bot Ini!*`)
  } catch (e) {
    console.error(e.message)
    return m.reply("Gagal Mengirim Report!")
  }
}

handler.command = "report";
handler.alias = ["rprt"];
handler.category = ["tools"];
handler.description = "";
handler.settings = {};

module.exports = handler;