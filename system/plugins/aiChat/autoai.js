let handler = async (m, ctx, { client, text }) => {
	if (!text) return m.reply(`> Masukkan Perintah Yang Valid!\n> .${m.command} ON/OFF`)
	
	try {
		if (text.includes("on")) {
			db.list().settings.autoai = true
			return m.reply("Berhasil Mengaktifkan Auto AI!")
		} else if (text.includes("off")) {
			db.list().settings.autoai = false
			return await m.reply("Berhasil Mematikan Auto AI!")
		} else {
			return await m.reply("> Pilihan Tidak Valid! Hanya Tersedia *on/off*")
		}
	} catch (e) {
		console.error(e)
		return m.reply("> Gagal Menjalankan Perintah!")
	}
}

handler.command = "autoai";
handler.alias = ["autoeyay"];
handler.category = ["ai"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;