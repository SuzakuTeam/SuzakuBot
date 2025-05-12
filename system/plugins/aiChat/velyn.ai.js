const axios = require("axios");

let handler = async (m, { system, text }) => {
  if (!text) return m.reply(`> Silahkan Masukkan Pertanyaan Anda!\n> .${m.command} Hai Siapa Nama Mu`)
  
  try {
    let linkApi = `https://velyn.biz.id/api/ai/aicustom?prompt=${text}`
    let data = await axios.get(linkApi)
    return m.reply(data.data.data)
  } catch (e) {
    console.error(e.message)
    return m.reply("> Gagal Mengambil Response Error Telah Terkirim Ke Owner.")
  }
}

handler.command = "velynai";
handler.alias = ["velny"];
handler.category = ["ai"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;