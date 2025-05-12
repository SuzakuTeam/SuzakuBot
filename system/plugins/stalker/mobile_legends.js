let handler = async (m, { system, text, Scraper }) => {
  let [userId, zoneId] = text.split("|");
  if (!userId && !zoneId) return m.reply(`>Pastikan Mengirim User Id Dan Zone Id Anda Dengan Benar!\n> .${m.command} 133289294|8337`)
  
  try {
    let dataStalk = await Scraper.mlstalk(userId, zoneId)
    let { username, region } = dataStalk
    let caption = `─────〔 ML STALKER 〕─────
Username : ${username}
Region  : ${region}
─────〔 Powered by Suzaku 〕─────`    
     await m.reply(caption)
  } catch (e) {
    system.addToLog(e.message, {
        isError: true
      })
    return m.reply("> Gagal Mendapatkan Data Account Anda!")
  }
}

handler.command = "mlstalk";
handler.alias = ["mlstalker"];
handler.category = ["stalker"];
handler.description = "Menerjemahkan teks ke bahasa lain.";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;