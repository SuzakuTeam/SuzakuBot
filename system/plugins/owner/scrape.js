const fs = require("node:fs");

module.exports = {
  command: "scrape",
  alias: ["skrep", "scraper"],
  category: ["owner"],
  settings: {
    owner: true,
  },
  description: "Untuk Pengelolaan Scraper bot",
  async run(m, { sock, Func, text, config }) {
    let src = await scraper.list();
    
    if (!text) {
      throw `────────────
SUZAKU - SCRAPER
────────────
Panduan Penggunaan:
• --get : Mengambil data Scrape
• --add : Menyimpan data Scrape
• --delete : Menghapus data Scrape

Daftar Scraper Tersedia:
${Object.keys(src).map((a, i) => `• ${i + 1}. ${a}`).join("\n")}
────────────`;
    }

    if (text.includes("--get")) {
      let input = text.replace("--get", "").trim();
      let list = Object.keys(src);

      if (!isNaN(input)) {
        try {
          let file = `${scraper.dir}/${list[parseInt(input) - 1]}.js`;
          m.reply(fs.readFileSync(file.trim()).toString());
        } catch (e) {
          m.reply(`Scraper '${list[parseInt(input) - 1]}' tidak ditemukan.`);
        }
      } else {
        try {
          let file = `${scraper.dir}/${input}.js`;
          m.reply(fs.readFileSync(file.trim()).toString());
        } catch (e) {
          m.reply(`Scraper '${input}' tidak ditemukan.`);
        }
      }

    } else if (text.includes("--add")) {
      if (!m.quoted) throw "Balas pesan scrape yang ingin disimpan.";

      let input = text.replace("--add", "").trim();
      try {
        let file = `${scraper.dir}/${input}.js`;
        fs.writeFileSync(file.trim(), m.quoted.body);
        m.reply(`Scraper '${input}' berhasil disimpan.`);
      } catch (e) {
        m.reply(`Gagal menyimpan scraper '${input}'. Silakan coba lagi.`);
      }

    } else if (text.includes("--delete")) {
      let input = text.replace("--delete", "").trim();
      let list = Object.keys(src);

      if (!isNaN(input)) {
        try {
          let file = `${scraper.dir}/${list[parseInt(input) - 1]}.js`;
          fs.unlinkSync(file.trim());
          m.reply(`Scraper '${list[parseInt(input) - 1]}' berhasil dihapus.`);
        } catch (e) {
          m.reply(`Scraper '${list[parseInt(input) - 1]}' tidak ditemukan.`);
        }
      } else {
        try {
          let file = `${scraper.dir}/${input}.js`;
          fs.unlinkSync(file.trim());
          m.reply(`Scraper '${input}' berhasil dihapus.`);
        } catch (e) {
          m.reply(`Scraper '${input}' tidak ditemukan.`);
        }
      }
    }
  },
};