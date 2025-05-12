let handler = async (m, ctx, { conn, text }) => {
	if (!ctx.isGroup) return m.reply("> Hanya Bisa Di Gunakan Di Dalam Group!")
	
	try {
		let groupMetadata = await conn.groupMetadata(m.cht)
		const participants = groupMetadata.participants.map(i => i.id)
		let caption = `👥 Tag All Member! \n📩 Pesan: ${text ? text : "Tidak Ada Pesan"}\n📝 Total Member: ${participants.length}Member: `
		for (let participant of participants) {
			caption += `\n@${participant.split("@")[0]}`
		}
		
		await conn.sendMessage(ctx.cht, {
			  text: caption,
			  mentions: participants
			})
	} catch (e) {
		console.error(e.message)
		return m.reply("> Gagal Melakukan TagAll Menber! Error Telah Di Kirim Ke Owner")
	}
}

handler.command = "tagall";
handler.alias = ["tagmemberall"];
handler.category = ["group"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;