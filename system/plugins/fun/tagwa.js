let handler = async (m, { system }) => {
  let text = `@${"0"}`
  await m.reply(text, {
    mentions: ["0@s.whatsapp.net"]
  })
}

handler.command = "tagwa";
handler.alias = ["tagwhatsapp"];
handler.category = ["fun"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;