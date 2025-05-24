let handler = async (m, ctx, { conn, text }) => {
  if (!text) return m.reply("> Tag atau ketik nomor yang mau diblok!");

  let userToBlock;
  if (m.quoted) {
    userToBlock = m.quoted.sender;
  } else if (text.includes("@")) {
    userToBlock = text.replace(/[@ .+-]/g, "") + "@s.whatsapp.net";
  } else if (text.length > 8) {
    userToBlock = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  } else {
    return m.reply("> Format tidak valid, tag atau ketik nomornya!");
  }

  try {
    await conn.updateBlockStatus(userToBlock, "block");
    m.reply(`> Berhasil memblokir @${userToBlock.split("@")[0]}`);
  } catch (e) {
    console.error(e.message);
    m.reply("> Gagal memblokir user!");
  }
};

handler.command = "block";
handler.category = ["owner"];
handler.description = "Memblokir pengguna tertentu.";
handler.settings = { limit: true, owner: true };

module.exports = handler;