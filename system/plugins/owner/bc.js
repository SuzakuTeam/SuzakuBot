const { delay } = require("baileys");
const DELAY = 10000;

module.exports = {
    command: "broadcast",
    alias: ["bc"],
    settings: {
        owner: true
    },
    description: "Mengirim pesan ke semua kontak atau grup",
    async run(m, { sock, store, text }) {
        if (!text) {
            throw `
┌──「 SUZAKU BROADCAST USAGE 」───⭓
│ > Masukkan pesan yang ingin dikirim.
│ > Balas media jika ingin mengirim pesan dengan media.
│ > Gunakan \`--group\` untuk mengirim ke semua grup.
└───────⭓
`.trim();
        }

        const MSG = Object.keys(store.messages);
        const groupChats = MSG.filter((id) => id.endsWith("@g.us"));
        const privateChats = MSG.filter((id) => id.endsWith("@s.whatsapp.net"));

        if (text.includes("--group")) {
            let input = text.replace("--group", "").trim();
            if (!groupChats.length) {
                throw "✖️ Tidak ada grup yang ditemukan untuk broadcast.";
            }

            let q = m.quoted || m;
            let Msg = sock.cMod(m.cht, q, input);

            let successCount = 0;
            for (let groupId of groupChats) {
                try {
                    await sock.copyNForward(groupId, Msg, true);
                    successCount++;
                } catch (error) {
                    console.error(`Gagal kirim ke grup ${groupId}:`, error.message);
                }
            }

            m.reply(`
┌──「 SUZAKU BROADCAST - GROUP 」───⭓
│ > Total Grup: ${groupChats.length}
│ > Berhasil Dikirim: ${successCount}
└───────⭓
`.trim());
        } else {
            if (!privateChats.length) {
                throw "✖️ Tidak ada kontak yang ditemukan untuk broadcast.";
            }

            let q = m.quoted || m;
            let Msg = sock.cMod(m.cht, q, text);

            let successCount = 0;
            for (let contactId of privateChats) {
                try {
                    await sock.copyNForward(contactId, Msg, true);
                    successCount++;
                } catch (error) {
                    console.error(`Gagal kirim ke kontak ${contactId}:`, error.message);
                }
            }

            m.reply(`
┌──「 SUZAKU BROADCAST - USER 」───⭓
│ > Total Kontak: ${privateChats.length}
│ > Berhasil Dikirim: ${successCount}
└───────⭓
`.trim());
        }
    },
};