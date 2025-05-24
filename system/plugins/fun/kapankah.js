let handler = async (m, ctx, { conn, text }) => {
  if (!text) return m.reply("> Pertanyaan tidak boleh kosong!");

  const jawaban = [
    "Besok",
    "Hari ini",
    "Minggu depan",
    "Bulan depan",
    "Tahun depan",
    "Sebentar lagi",
    "Dalam waktu dekat",
    "Setelah kau berusaha",
    "Aku tidak tahu kapan",
    "Mungkin tidak akan terjadi"
  ];

  const hasil = jawaban[Math.floor(Math.random() * jawaban.length)];
  m.reply(`> Pertanyaan: ${text}\n> Waktu: ${hasil}`);
};

handler.command = "kapankah";
handler.category = ["fun"];
handler.description = "Memberikan estimasi waktu secara acak.";
handler.settings = { limit: true };

module.exports = handler;