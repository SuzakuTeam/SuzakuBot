let handler = async (m, { system }) => {
  try {
    await system.sendMessageWithThumb(m.cht, "Sayonaraa... Jumpa Lain Kali")
    await system.groupLeave(m.cht)
  } catch (e) {
    console.error(e.message)
    return m.reply("Gagal Mengeluarkan Diri Sendiri Dari Group.")
  }
}

handler.command = "leavegc";
handler.alias = ["lvgc"];
handler.category = ["group"];
handler.description = "";
handler.settings = { limit: true, owner: true };
handler.loading = true;

module.exports = handler;