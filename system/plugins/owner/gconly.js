let handler = async (m, ctx, { conn }) => {
	if (!text) return m.reply("> Masukkan [on/off] Contoh: \n> .gconly on Untuk Mengaktifkan\n> .gconly off Untuk Mematikan.")
	
	try {
		let dbGcOnly = db.list().settings.gconly
		if (text.includes("on")) {
			dbGcOnly = true
			return m.reply("> Sukses Menghidupkan Group Only! Sekarang *Bot Hanya Bisa Di Pakai Di Group*")
		} else if (text.includes("off")) {
			dbGcOnly = false
			return m.reply("> Sukses Mematikan Group Only! Sekarang Bot Bisa Di Akses Di Mana Pun!")
		} else {
			return m.reply("> Pilihan Tidak Valid! Hanya Ada [on/off]")
		}
	} catch (e) {
		return m.reply("Gagal Total!")
	}
}

handler.command = "gconly";
handler.alias = ["gconlyy"];
handler.category = ["owner"];
handler.description = "";
handler.settings = { limit: true, owner: true };
handler.loading = true;

module.exports = handler;