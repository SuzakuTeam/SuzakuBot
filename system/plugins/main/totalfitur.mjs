import fs from 'fs';
import path from 'path';

let handler = async (m, ctx) => {
  try {
    const pluginFolder = path.join(process.cwd(), 'system', 'plugins');

    const files = fs.readdirSync(pluginFolder)
      .filter(file => file.endsWith('.js'));

    const total = files.length;

    m.reply(`Total fitur yang tersedia: *${total}*`);
  } catch (e) {
    console.error(e);
    m.reply('Gagal menghitung total fitur.');
  }
};

handler.command = "totalfitur";
handler.category = ["info"];
handler.description = "Menampilkan total file fitur yang tersedia.";
handler.loading = true;
export default handler;