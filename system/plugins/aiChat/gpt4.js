const axios = require("axios") 

let handler = async (ctx, { conn, text }) => {
  if (!text) return ctx.reply(`> Masukkan Pertanyaan Anda Kepada GPT!\n> .${m.command} Hai GPT`) 
  
  try {
    const { data } = await axios.get(`https://velyn.biz.id/api/ai/gpt4o?prompt=${text}`) 
    let ress = data.data.data
    ress = ress.replace(/\*\*/g, "*")
    return m.reply(ress) 
  } catch (e) {
    console.error(e.message) 
    return m.reply("Gagal Mengambil Response Ai?") 
  }
}


handler.command = "gpt4";
handler.alias = ["gpt"];
handler.category = ["ai"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;