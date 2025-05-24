let handler = async (m, ctx, { conn, text }) => {
  if (!text) return m.reply("> Pertanyaan tidak boleh kosong!");

  const jawaban = [
    "Ya",
    "Tidak",
    "Mungkin",
    "Bisa jadi",
    "Tidak mungkin",
    "Pasti",
    "Sepertinya iya",
    "Sepertinya tidak",
    "Coba tanya lagi nanti",
    "Aku tidak tahu"
  ];

  const hasil = jawaban[Math.floor(Math.random() * jawaban.length)];
  m.reply(`> Pertanyaan: ${text}\n> Jawaban: ${hasil}`);
};

handler.command = "apakah";
handler.category = ["fun"];
handler.description = "Menjawab pertanyaan dengan acak.";
handler.settings = { limit: true };

module.exports = handler;