import fs from 'fs';

let handler = async (m, ctx, { conn }) => {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

  let info = `
Informasi Bot Suzaku

Dibuat oleh:
- Sxyz
- Deku ( *Dxyz* )
- Reja
- Denis ( *CukiDigital* )
- ErerexIDChx ( *VelynRestAPIs* )

Tentang:
Suzaku adalah bot WhatsApp multifungsi yang dirancang untuk berbagai kebutuhan pengguna, mulai dari tools, downloader, grup, hingga fitur-fitur fun. Dibangun dengan konsep modular dan performa yang optimal.

Versi Saat Ini:
v${pkg.version}
`.trim();

  m.reply(info);
};

handler.command = "infobot";
handler.category = ["info"];
handler.description = "Menampilkan informasi tentang bot.";
handler.settings = {};
handler.loading = true;

export default handler;