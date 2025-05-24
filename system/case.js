const util = require("util");
const {
    exec
} = require("child_process");
const fs = require("node:fs");
const axios = require("axios");
const Func = require("../lib/function");
const {
    writeExif
} = require("../lib/sticker");
const pkg = require("../lib/case");
const Case = new pkg("./system/case.js");

module.exports = async (m,
    system,
    config,
    text,
    Func,
    Scraper,
    Uploader,
    store,
    isAdmin,
    botAdmin,
    isPrems,
    isBanned,
) => {
    const quoted = m.isQuoted ? m.quoted : m;
    switch (m.command) {
                case "rvo":
        case "readviewonce": {
            if (!m.quoted) return m.reply("📝 Balas media dengan satu kali lihat");
            let messages = m.quoted
            if (!messages.msg.viewOnce) return m.reply("❌ Itu bukan pesan sekali liat !");
            delete messages.msg.viewOnce
            system.copyNForward(m.cht, messages);
        }
        break
        case "brat": {
            const {
                execSync
            } = require("child_process");
            const fs = require("fs");
            const path = require("path");

            let input = m.isQuoted ? m.quoted.body : text;
            if (!input) return m.reply("> Reply/Masukan pesan");
            m.react("✋")

            if (m.text.includes("--animated")) {
                let txt = input.replace("--animated", "").trim().split(" ");
                let array = [];
                let tmpDirBase = path.resolve(`./tmp/brat_${Date.now()}`);

                fs.mkdirSync(tmpDirBase, {
                    recursive: true
                })
                for (let i = 0; i < txt.length; i++) {
                    let word = txt.slice(0, i + 1).join(" ");
                    let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(word)}`, {
                        responseType: 'arraybuffer'
                    })).data;
                    let tmpDir = path.resolve(`${tmpDirBase}/brat_${i}.mp4`);
                    fs.writeFileSync(tmpDir, media);
                    array.push(tmpDir);
                }

                let fileTxt = path.resolve(`${tmpDirBase}/cmd.txt`);
                let content = "";
                for (let i = 0; i < array.length; i++) {
                    content += `file '${array[i]}'\n`;
                    content += `duration 0.5\n`;
                }
                content += `file '${array[array.length - 1]}'\n`;
                content += `duration 3\n`;
                fs.writeFileSync(fileTxt, content);

                let output = path.resolve(`${tmpDirBase}/output.mp4`);
                execSync(`ffmpeg -y -f concat -safe 0 -i ${fileTxt} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${output}`);
                let sticker = await writeExif({
                    mimetype: "video",
                    data: fs.readFileSync(output)
                }, {
                    packName: config.sticker.packname,
                    packPublish: m.pushName
                });
                fs.rmSync(tmpDirBase, {
                    recursive: true,
                    force: true
                });
                await m.reply({
                    sticker
                });
            } else {
                let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(input)}`, {
                    responseType: 'arraybuffer'
                })).data;
                let sticker = await writeExif({
                    mimetype: "image",
                    data: media
                }, {
                    packName: config.sticker.packname,
                    packPublish: config.sticker.author
                });
                await m.reply({
                    sticker
                });
            }
        }
        break;
        case "daftar": {
            let user = db.list().user[m.sender];
            if (user.register) return m.reply("> 🎉 Kamu sudah terdaftar!");
            if (!text) return m.reply("> 📢 Masukkan nama kamu untuk pendaftaran!");

            let list = Object.values(db.list().user).find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (list) return m.reply("> ❗ Nama tersebut sudah digunakan!");

            let bonus = 1000;
            user.register = true;
            user.name = text;
            user.rpg.money += bonus;
            user.rpg.exp += bonus;

            let cap = `*– 乂 Pendaftaran Berhasil!*\n`;
            cap += `> 🎉 Selamat ${user.name}, kamu berhasil mendaftar dan mendapatkan bonus tambahan!\n\n`;

            cap += `*– 乂 Hadiah Pendaftaran*\n`;
            cap += `> 💰 *Money:* 1.000\n`;
            cap += `> 📊 *Exp:* 1.000\n`;

            m.reply(cap);
        }
        break;

        case "jadwalsholat": {
            const axios = require('axios');
            const cheerio = require('cheerio');
            if (!text) return m.reply("> 📍 Masukkan nama kota yang kamu tuju!");
            const kota = text?.toLowerCase() || 'jakarta';

            try {
                const {
                    data
                } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
                const $ = cheerio.load(data);

                const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

                if (jadwal.length === 7) {
                    const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

                    const zan = `
╭──[ *📅 Jadwal Sholat* ]──✧
᎒⊸ *🌆 Kota*: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
᎒⊸ *📅 Tanggal*: ${tanggal}

╭──[ *🕰️ Waktu Sholat* ]──✧
᎒⊸ *Subuh:* ${subuh}
᎒⊸ *Duha:* ${duha}
᎒⊸ *Dzuhur:* ${dzuhur}
᎒⊸ *Ashar:* ${ashar}
᎒⊸ *Maghrib:* ${maghrib}
᎒⊸ *Isya:* ${isya}
╰────────────•`;

                    await m.reply(zan);
                } else {
                    await m.reply('❌ Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.');
                }
            } catch (error) {
                await m.reply('❌ Terjadi kesalahan saat mengambil data!');
            }
        }
        break;

        case "cases": {
            if (!m.isOwner) return m.reply(config.messages.owner);

            let cap = "*– 乂 *Fitur Case* –*\n";
            cap += "> 📝 *`--add`* : Menambahkan fitur case baru\n";
            cap += "> 🔄 *`--get`* : Mengambil fitur case\n";
            cap += "> ❌ *`--delete`* : Menghapus fitur case\n";
            cap += "\n*– 乂 *List Case yang Tersedia* –*\n";
            cap += Case.list().map((a, i) => `> ${i + 1}. *${a}*`).join("\n");

            if (!text) return m.reply(cap);

            if (text.includes("--add")) {
                if (!m.quoted) return m.reply("> ⚠️ Reply fitur case yang ingin disimpan!");
                let status = Case.add(m.quoted.body);
                m.reply(status ? "> ✅ Berhasil menambahkan case baru!" : "> ❌ Gagal menambahkan case baru.");
            } else if (text.includes("--delete")) {
                let input = text.replace("--delete", "").trim();
                if (!input) return m.reply("> ⚠️ Masukkan nama case yang ingin dihapus!");
                let status = Case.delete(input);
                m.reply(status ? `> ✅ Berhasil menghapus case *${input}*!` : `> ❌ Case *${input}* tidak ditemukan!`);
            } else if (text.includes("--get")) {
                let input = text.replace("--get", "").trim();
                if (!input) return m.reply("> ⚠️ Masukkan nama case yang ingin diambil!");
                if (!Case.list().includes(input)) return m.reply("> ❌ Case tidak ditemukan!");
                let status = Case.get(input);
                m.reply(status ? status : `> ❌ Case *${input}* tidak ditemukan!`);
            }
        }
        break;
        case "zzz": {
            let list = await Scraper.zzz.list();
            if (!text) return m.reply("> *🔍 Masukkan nama karakter dari game ZZZ*");

            let chara = list.find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (!chara) return m.reply(`> *😞 Karakter tidak ditemukan!*

*– 乂 Berikut ${list.length} karakter dari game ZZZ:*

${list.map((a) => Object.entries(a).map(([a, b]) => `> *🔸 ${a.capitalize()}* : ${b}`).join('\n')).join("\n\n")}`);

            let data = await Scraper.zzz.chara(text);
            let cap = "*– 乂 **Zenless Zone Zero - Detail Karakter***\n"
            cap += Object.entries(data.info).map(([a, b]) => `> *🔹 ${a.capitalize()}* : ${b}`).join("\n");
            cap += "\n\n*– **Statistik Karakter** :*\n"
            cap += data.stats.map((a) => `> *🔸 ${a.name.capitalize()}* : ${a.value}`).join("\n");
            cap += "\n\n*– **Info Tim Karakter** :*\n"
            cap += data.team.map((a) => `> *🔹 Nama*: ${a.name}\n> *🔸 Peran*: ${a.role}`).join("\n\n");

            cap += "\n\n*– **Kemampuan Karakter** :*\n"
            cap += data.skills.map((a) => `> *🔸 Nama Kemampuan*: ${a.name}\n> ${a.description}`).join("\n\n");

            m.reply({
                text: cap,
                contextInfo: {
                    externalAdReply: {
                        title: `– **Zenless Zone Zero Wiki**: ${data.info.name}`,
                        body: `- **Elemen**: ${data.info.element}`,
                        mediaType: 1,
                        thumbnailUrl: data.info.image
                    }
                }
            });
        }
        break;

        case "sticker":
        case "s": {
            if (/image|video|webp/.test(quoted.msg.mimetype)) {
                let media = await quoted.download();
                if (quoted.msg?.seconds > 10)
                    throw "> *⚠️ Video lebih dari 10 detik tidak dapat dijadikan sticker*.";

                let exif;
                if (text) {
                    let [packname, author] = text.split(/[,|\-+&]/);
                    exif = {
                        packName: packname ? packname : "",
                        packPublish: author ? author : "",
                    };
                } else {
                    exif = {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    };
                }

                let sticker = await writeExif({
                    mimetype: quoted.msg.mimetype,
                    data: media
                }, exif);

                await m.reply({
                    sticker
                });
            } else if (m.mentions.length !== 0) {
                for (let id of m.mentions) {
                    await delay(1500);
                    let url = await system.profilePictureUrl(id, "image");
                    let media = await axios
                        .get(url, {
                            responseType: "arraybuffer",
                        })
                        .then((a) => a.data);
                    let sticker = await writeExif(media, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    });
                    await m.reply({
                        sticker
                    });
                }
            } else if (
                /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(
                    text,
                )
            ) {
                for (let url of Func.isUrl(text)) {
                    await delay(1500);
                }
            } else {
                m.reply("> *📸 Balas dengan foto atau video untuk dijadikan sticker*.");
            }
        }
        break;

        case "cases": {
            if (!m.isOwner) return m.reply(config.messages.owner);

            let cap = "*– 乂 **Cara Penggunaan Fitur Case***\n";
            cap += "> *➕ `--add`* untuk menambah fitur case baru\n";
            cap += "> *🔄 `--get`* untuk mengambil fitur case yang ada\n";
            cap += "> *❌ `--delete`* untuk menghapus fitur case\n";
            cap += "\n*– 乂 **Daftar Case yang Tersedia** :*\n";
            cap += Case.list().map((a, i) => `> *${i + 1}.* ${a}`).join("\n");

            if (!text) return m.reply(cap);

            if (text.includes("--add")) {
                if (!m.quoted) return m.reply("> *⚠️ Balas dengan fitur case yang ingin disimpan*.");
                let status = Case.add(m.quoted.body);
                m.reply(status ? "> *✅ Berhasil menambahkan case baru!*" : "> *❌ Gagal menambahkan case baru*.");
            } else if (text.includes("--delete")) {
                let input = text.replace("--delete", "").trim();
                if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin dihapus*!");
                let status = Case.delete(input);
                m.reply(status ? `> *✅ Berhasil menghapus case: ${input}!*` : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
            } else if (text.includes("--get")) {
                let input = text.replace("--get", "").trim();
                if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin diambil*!");
                if (!Case.list().includes(input)) return m.reply("> *❌ Case tidak ditemukan!*");
                let status = Case.get(input);
                m.reply(status ? status : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
            }
        }
        break;
    default:
      if (db.list().settings.gconly) {
      	if (!m.isGroup) {
      		await m.reply("> Saat Ini Status Bot Group Only! Hanya Bisa Di Akses Ketika Di Group")
      		return 
      	}
      }
   }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("- Terjadi perubahan pada files case.js");
    delete require.cache[file];
});