let handler = async (m, ctx, { conn }) => {
  if (!m.args[0]) return m.reply("> Masukkan link atau kode undangan channel.\nContoh: .channelinfo https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E");

  let input = m.args[0];
  let code = input.match(/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/)?.[1] || input;

  try {
    const meta = await conn.newsletterMetadata("invite", code);

    let caption = `── 「 CHANNEL INFO 」 ──
• Nama: ${meta.name}
• ID: ${meta.id}
• Deskripsi:\n${meta.description || "-"}
• Dibuat: ${new Date(meta.creation_time * 1000).toLocaleString()}
• Jumlah Subscriber: ${meta.subscribers}
• Verifikasi: ${meta.verification}
• Link Undangan: https://whatsapp.com/channel/${meta.invite}`;

    if (meta.preview) {
      await conn.sendMessage(m.cht, {
        image: { url: "https://pps.whatsapp.net" + meta.preview },
        caption
      }, { quoted: m });
    } else {
      m.reply(caption);
    }
  } catch (e) {
    console.error(e);
    m.reply("> Gagal mengambil info channel. Pastikan kode undangan valid.");
  }
};

handler.command = "channelinfo";
handler.alias = ["cinfo"];
handler.category = ["info"];
handler.description = "Menampilkan info channel WhatsApp (termasuk foto profil jika ada).";
handler.settings = {};

module.exports = handler;