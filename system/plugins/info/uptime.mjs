let handler = async (m, ctx, { conn }) => {
  let uptime = process.uptime() * 1000;
  let hours = Math.floor(uptime / 3600000);
  let minutes = Math.floor((uptime % 3600000) / 60000);
  let seconds = Math.floor((uptime % 60000) / 1000);

  m.reply(`Bot telah online selama:\n${hours} jam ${minutes} menit ${seconds} detik`);
};

handler.command = "uptime";
handler.category = ["info"];
handler.description = "Menampilkan berapa lama bot sudah online.";
handler.loading = true;
export default handler;