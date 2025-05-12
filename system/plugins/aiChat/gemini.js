const { GoogleGenerativeAI } = require("@google/genai")
import fs from 'fs'
let genAI = new GoogleGenerativeAI({ apikey: "AIzaSyBL8zt0eSiidVE_C5o3SgyOW3drFgg9gwg" });

let handler = async (ctx, { conn, text }) => {
	if (!text) return ctx.reply(`> Masukkan Pertanyaan Anda Kepada Gemini!\n> .${m.command} Apa Itu Flu?`)
	
	try {
		let ress = await genAI.models.generateContent({
			model: "gemini-2.0-flash-001",
		  contents: text
		})
		await m.reply(ress.text)
	} catch (_) {
		console.error(_.message)
		return m.reply("Gagal Mengambil Response dari Gemini")
	}
}

handler.command = "gemini";
handler.alias = ["genai"];
handler.category = ["ai"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;