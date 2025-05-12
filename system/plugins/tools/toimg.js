let handler = async (m, ctx, { conn }) => {
	if (!m.quoted) return m.reply("> Reply Sticker Nya!")
	try {
		let bufferImage = await ctx.quoted.download()
		await conn.sendMessage(m.cht, {
			  image: bufferImage,
			  caption: "Berhasil!"
			})
	} catch (e) {
		console.error(e.message)
		return m.reply("Gagal Mendownload Sticker!")
	}
}

handler.command = "toimg";
handler.alias = ["toimage"];
handler.category = ["tools"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;