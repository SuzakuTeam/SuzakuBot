let handler = async (m, ctx, { conn }) => {
  let mentioned = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  let percent = Math.floor(Math.random() * 101);
  m.reply(`Gay Persen untuk @${mentioned.split("@")[0]}: ${percent}%`, {
    mentions: [mentioned]
  });
};

handler.command = "cekgay";
handler.category = ["fun"];
handler.description = "Random gay meter.";
handler.loading = true;
export default handler;