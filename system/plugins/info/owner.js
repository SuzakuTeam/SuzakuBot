let handler = async (m, ctx, { conn, config }) => {
    let contacts = config.owner.map(number => [number, config.ownerName])
    await conn.sendContact(m.cht, contacts)
    return m.reply("> Itu Owner Ku Ya Kak " + m.pushName + " Jangan Di Spam☹️")
}

handler.command = "owner";
handler.alias = ["own"];
handler.category = ["info"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;