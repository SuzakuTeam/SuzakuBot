const fs = require("node:fs");

const config = {
  owner: ["6285270058464"],
  ownerName: "Sxyz",
  systemName: "SuzakuBot",
  reportNumber: ["62895342022385"], // Jangan Ubah Agar Setiap Error Masuk Ke Nomor ini, Kalau Mau Fix Sendiri Ubah aja.
  sessions: "sesi",
  msg: {
  	botAdmin: "> Bot Harus Menjadi Admin Untuk Menggunakan Feature Ini!",
  	owner: "> Feature Ini Hanya Bisa Di Akses Oleh *Owner*",
  	admin: "> Command Ini Hanya Bisa Di Akses Oleh Admin Group. Segera Hubungi Admin Group Ini.",
  	group: "> Command Ini Di Batasi Agar Hanya Di Group Bisa Di Pakai Agar Tidak Terjadi Sesuatu Yang Buruk.",
  	ownerAndAdmin: "> Hanya Owner Dan Admin Group Yang Dapat Menggunakan Ini!"
  },
  sticker: {
    packname: "Di Buat Oleg",
    author: ""
  },
  prefix: [".", "?", "!"], 
  database: "dataUser", 
  tz: "Asia/Jakarta",
};

module.exports = config;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  delete require.cache[file];
});
