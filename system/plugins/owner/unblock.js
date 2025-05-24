let handler = async (m, ctx, { conn, text }) => {
  if (!text) return m.reply("> Tag atau ketik nomor yang mau di-unblock!");

  let userToUnblock;
  if (m.quoted) {
    userToUnblock = m.quoted.sender;
  } else if (text.includes("@")) {
    userToUnblock = text.replace(/[@ .+-]/g, "") + "@s.whatsapp.net";
  } else if (text.length > 8) {
    userToUnblock = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  } else {
    return m.reply("> Format tidak valid, tag atau ketik nomornya!");
  }

  try {
    await conn.updateBlockStatus(userToUnblock, "unblock");
    m.reply(`> Berhasil membuka blokir @${userToUnblock.split("@")[0]}`);
  } catch (e) {
    console.error(e.message);
    m.reply("> Gagal membuka blokir user!");
  }
};

handler.command = "unblock";
handler.category = ["owner"];
handler.description = "Membuka blokir pengguna.";
handler.settings = { limit: true, owner: true };

module.exports = handler;