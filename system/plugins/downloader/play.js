const axios = require('axios');
const yts = require('yt-search');

let handler = async (m, { system, text, Scraper, Uploader, Func }) => {
  if (!text) throw '> Masukkan nama lagu yang ingin dicari!\n> Contoh: .play Surat Cinta Untuk Starla';

  const { all } = await yts({
    search: text,
    hl: 'id',
    gl: 'ID'
  });

  if (!all || all.length === 0) throw '➤ Maaf, lagu tidak ditemukan.';

  const result = all[0];

  let caption = `「 *SUZAKU MUSIC* 」
> *Judul:* ${result.title}
> *Durasi:* ${result.timestamp}
> *Upload:* ${result.ago}
> *Channel:* ${result.author.name}
> *Link:* ${result.url}
`.trim();

  await system.sendMessage(m.cht, {
    image: { url: result.thumbnail },
    caption,
    contextInfo: {
      externalAdReply: {
        title: "Suzaku Music",
        body: `${result.timestamp} • ${result.author.name}`,
        thumbnailUrl: result.thumbnail,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: result.url,
        showAdAttribution: true
      }
    }
  }, { quoted: m });

  const { result: savetube } = await Scraper.savetube.download(result.url, "mp3");
  const downloadLink = savetube.download;
  const buff = await axios.get(downloadLink, { responseType: 'arraybuffer' });
  const arrayBuffer = Buffer.from(buff.data);

  const url = await Uploader.tmpfiles(arrayBuffer);
  const size = await Func.getSize(url);

  await system.sendMessage(m.cht, {
    audio: arrayBuffer,
    mimetype: 'audio/mpeg',
    contextInfo: {
      externalAdReply: {
        title: result.title,
        body: `${result.timestamp} • ${size} • mp3`,
        thumbnailUrl: result.thumbnail,
        mediaType: 1,
        renderLargerThumbnail: false,
        sourceUrl: result.url,
        showAdAttribution: true
      }
    }
  }, { quoted: m });
};

handler.command = "play";
handler.alias = ["musik"];
handler.category = ["downloader"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;