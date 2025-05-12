let handler = async (m, ctx, { conn }) => {
	await m.reply(`@${m.sender.split("@")[0]}`, {
		mentions: m.sender
	})
}

handler.command = "tagme";
handler.alias = ["tagsaya"];
handler.category = ["fun"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;