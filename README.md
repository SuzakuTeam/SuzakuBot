# SuzakuBot

<div align="center">
  <img src="https://files.catbox.moe/1463l1.jpg" alt="SuzakuBot Logo" width="200px" height="200px"/>
  <p>WhatsApp Bot dengan performa tinggi dan antarmuka bersih</p>
</div>

## Tentang SuzakuBot

SuzakuBot adalah bot WhatsApp modern yang dirancang untuk memberikan pengalaman pengguna yang efisien dan intuitif. Dengan fokus pada kecepatan eksekusi dan tampilan yang bersih, SuzakuBot dapat membantu mengotomatisasi berbagai tugas dalam grup dan percakapan pribadi WhatsApp.

## Tentang Versi Terbaru
**Tentang Versi 1.0.1:**
> Pada Versi Ini Suzaku Sudah Berkembang Menjadi Lebih Baik. Dengan Beberapa Feature Yang Sudah Di Tambahkan Dan Fixxed Beberapa Feature.

**Apa Saja Yang Baru??:**
> Kami Menambahkan Beberapa Object Yang Mungkin Berguna Untuk Pengoptimalan Feature. Seperti `system.sendMessageWithThumb` Yang Mengirim Thumbnail Langsung Dengan Pesan.

**Adakah Properti Baru Di Handler?:**
> Ya, Ada Beberapa Yang Baru Termasuk Penambahan Socket Baru! Bukan Hanya **system** Tapi Ada Banyak. Seperti `conn` `client` `sock` Anda Bebas Memilih Salah Satu Nya! **Bagaimana Menggunakan Nya??**: Cara Penggunaan Sudah Tertera Di Bagian Bawah!

**Apa Fungsi Baru Yaitu Ctx??:** 
> Fungsi Tersebut Sama Seperti Object `M` Tapi Karena Salah Satu Developer Kami Memakai Ctx Jadi Saya Menambahkan Properti Itu Agar Dia Merasa Nyaman.

**Btw:**
> Ctx Itu Wajib Di Ikutkan Dengan Properti `m` Jika Tidak Maka Akan Ada Missing Beberapa Object Yang Sangat Menggangu.

## Versi Saat Ini
> **VERSI:** Versi Saat Ini Adalah 1.0.1

## Fitur

- **Antarmuka Minimalis** - Desain visual bersih yang memudahkan penggunaan
- **Respons Cepat** - Waktu eksekusi perintah yang optimal
- **Sistem Multi-kategori** - Perintah yang diorganisir berdasarkan fungsi
- **Fitur Premium** - Kemampuan tambahan untuk pengguna premium
- **Skalabilitas** - Mudah dikembangkan dengan fitur baru

## Instalasi

```
# Instalasi akan ditambahkan nanti
```

## Penggunaan

SuzakuBot menggunakan sistem prefix untuk menjalankan perintah. Berikut cara penggunaan dasar:

```
.menu               # Menampilkan menu utama
.menu [kategori]    # Menampilkan menu kategori tertentu
.menu all           # Menampilkan semua perintah
```

## Struktur Menu

SuzakuBot memiliki berbagai kategori perintah yang diatur untuk kemudahan penggunaan:

- **Main** - Perintah-perintah dasar dan informasi bot
- **Admin** - Perintah untuk manajemen grup
- **Group** - Utilitas dan interaksi dalam grup
- **Tools** - Alat bantu dan konversi
- **Media** - Pencarian dan manipulasi media
- **Owner** - Perintah khusus untuk pemilik bot

## Fitur Premium

Akses premium menawarkan beberapa keuntungan:

- Tidak ada batasan limit harian
- Akses ke fitur khusus premium
- Prioritas dalam antrian eksekusi perintah

## Pengembangan

SuzakuBot dibuat dengan Node.js dan menggunakan beberapa library utama:

```javascript
const dependencies = {
  "moment-timezone": "^0.5.x",
  "axios": "^1.x.x",
  "baileys": "^6.x.x",
  // dan lainnya
};
```

Untuk menambahkan perintah baru, buat file di direktori `plugins/` dengan format:

```javascript
module.exports = {
  command: "nama_perintah",
  alias: ["alias1", "alias2"],
  category: ["kategori"],
  description: "Deskripsi perintah",
  async run(m, ctx, { system, plugins, config, Func, text }) {
    // Kode perintah
  }
};
```
```javascript
let handler = async (m, ctx, { system, config, Scraper, text, Func }) => {
  //Kode Perintah
}

handler.command = "namaCommand";
handler.alias = ["singkatan"];
handler.category = ["category"];
handler.description = "";
handler.settings = { limit: true, owner: true };
handler.loading = true

module.exports = handler;
```
```javascript
let handler = async (m, ctx, { system, config, Scraper, text, Func }) => {
  //Kode Perintah
}

handler.commandRegex = /^(namaCommand)$/i;
handler.alias = ["singkatan"];
handler.category = ["category"];
handler.description = "";
handler.settings = { limit: true, owner: true };
handler.loading = true

module.exports = handler;
```

## Dukungan & Laporan Bug

Jika mengalami masalah atau memiliki pertanyaan:
- Kunjungi [Channel WhatsApp SuzakuBot](https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P)
- Buat laporan error atau permintaan fitur di: [https://github.com/SxyzVerse/SUZAKU/issues](https://github.com/SxyzVerse/SUZAKU/issues)

Tim Suzaku akan menanggapi setiap laporan dan permintaan secepat mungkin untuk meningkatkan kualitas bot.

## Lisensi

SuzakuBot dilisensikan di bawah [MIT License](LICENSE).

<div align="center">
  <p>Dikembangkan oleh Tim SuzakuBot</p>
</div>