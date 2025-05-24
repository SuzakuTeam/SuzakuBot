let handler = async (m, ctx, { client, text }) => {
	if (!text) return m.reply("> Masukkan Pesan Anda!")
	
	try {
		let groupMetadata = await client.groupMetadata(ctx.cht)
		let participant = groupMetadata.participants.map(i => i.id);
		await client.sendMessage(m.cht, {
			 text,
			 mentions: participant
			})
	} catch (e) {
		console.error(e.message)
		return m.reply("> Terjadi Kesalahan")
	}
}

handler.command = "hidetag";
handler.alias = ["ht", "h"];
handler.category = ["group"];
handler.description = "";
handler.settings = { limit: true, group: true };
handler.loading = true;

module.exports = handler;