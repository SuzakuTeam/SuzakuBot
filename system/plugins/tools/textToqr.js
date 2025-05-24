//Pake Api Dulu Ygy, Nanti Kalau Ketemu Web Nya Kita Scrape, Btw Ini Juga Requestan Ya!

let handler = async (m, ctx, { system, text }) => {
  if (!text) return m.reply("> Masukkan Text Yang Mau Di Ubah Ke QrCode!\n.text2qr Hai")
  
  try {
    await system.sendMessage(m.cht, {
       image: {
         url: `https://api.ferdev.my.id/tools/text2qr?text=${text}`
       },
       caption: `Berhasil Generate Dengan Pesan: *${text}*`
      })
  } catch (e) {
    console.error(e.message)
    return m.reply("Gagal Mengubah Text Ke Qr")
  }
}

handler.command = "text2qr";
handler.alias = ["txt2qr"];
handler.category = ["tools"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;