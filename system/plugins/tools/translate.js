let handler = async (m, ctx, { system, Scraper, text }) => {
  if (!text) return m.reply("Kirim pesan atau reply teks yang mau diterjemahkan. Contoh:\n.tr Hai Apa Kabar id-rs");

  let teks = "";
  let toLanguage = "";

  if (m.quoted) {
    teks = m.quoted.body || m.quoted.text;
    if (!teks) return m.reply("Teks tidak ditemukan di pesan yang direply.");

    toLanguage = text.trim();
    if (!toLanguage) return m.reply("Tolong kirim kode bahasa tujuan. Contoh: .tr id-rs");
  } else {
    let args = text.trim().split(" ");
    if (args.length < 2) return m.reply("Format salah! Contoh: .tr Hai Apa Kabar id-rs");
    toLanguage = args.pop();
    teks = args.join(" "); 
  }

  let prompt = `Translate Kan Ini: ${teks} Ke Bahasa: ${toLanguage} langsung bahasa tujuan aja, jangan ada text lain!`;
  let response = await Scraper.chatbotai(prompt, "chatgpt4");

  await m.reply(response.chat);
}

handler.command = "translate";
handler.alias = ["tr"];
handler.category = ["tools"];
handler.description = "Menerjemahkan teks ke bahasa lain.";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;