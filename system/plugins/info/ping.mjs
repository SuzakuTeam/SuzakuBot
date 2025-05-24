let handler = async (m, ctx) => {
  let start = Date.now();
  await m.reply("Testing Ping...");
  let end = Date.now();
  m.reply(`Ping: ${end - start}ms`);
};

handler.command = "ping";
handler.category = ["info"];
handler.description = "Cek kecepatan respons bot.";
handler.loading = true;
export default handler;