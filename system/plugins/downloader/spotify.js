const axios = require("axios");

let handler = async (m, ctx, { system, Scraper, text }) => {
  if (!text) {
    return m.reply(`> Masukkan nama lagu yang ingin kamu dengar!\n> .${m.command} *Surat Cinta Untuk Starla*`);
  }

  try {
    let { data: search } = await axios.get(`https://velyn.biz.id/api/search/spotify?query=${encodeURIComponent(text)}`);
    let b = search.data[0];
    let { name, link, image, artists, popularity } = b;
    let { file_url } = await Scraper.spotifydl.dl(link);

    let caption = `─── ❖ ── ✦ ── ❖ ───
✦  *SUZAKU MUSIC PLAYER*  
─── ❖ ── ✦ ── ❖ ───
🎵 *Judul* : ${name}
🎤 *Artis* : ${artists}
📈 *Popularitas* : ${popularity}%
🔗 *Link* : ${link}
─── ❖ ── ✦ ── ❖ ───
`;

    await m.reply({
      image: {
        url: image
      },
      caption: caption
    });
    await system.sendMessage(m.cht, {
      audio: { url: file_url },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });
    
  } catch (e) {
    console.error(e);
    m.reply(`✖️ Gagal mengambil lagu, coba lagi nanti.`);
  }
};

handler.command = "spotify";
handler.alias = ["spoti"];
handler.category = ["downloader"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;