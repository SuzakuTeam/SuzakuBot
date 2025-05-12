const ress = require("axios");
const FormDatas = require("form-data");

let handler = async (m, { system, text }) => {
   if (!text) return m.reply(`> .${m.command} Jokowi`)
   
   try {
     let dat = await igStalk(text)
     if (!dat || !dat["0"]) return m.reply("> Pengguna tidak ditemukan atau terjadi kesalahan.");
     let data = dat["0"];
     let caption = `> Pengguna Berhasil Di Temukan!
> Account Name: ${text}
> Post Count: ${data.posts_count}
> Followers: ${data.followers}
> Account Bisnis: ${data.is_business_account ? 'Yes' : 'Tidak'}
> Verified: ${data.is_verified ? "Yes" : "Tidak"}
> Professional Account: ${data.is_professional_account ? "Yes": "Tidak"}
> Private: ${data.is_private ? "Yes" : "Tidak"}
     `
     await m.reply({
       image: {
         url: data.profile_image_link
       },
       caption: caption
     })
   } catch (e) {
     system.addToLog(e.message, {
        isError: true
       })
   }
}

handler.command = "igstalk";
handler.alias = ["igstlk"];
handler.category = ["stalker"];
handler.description = "";
handler.settings = { limit: true };

module.exports = handler;

const igStalk = async (usn) => {
  try {
    let s = new FormDatas();
    s.append("url", usn);

    let headers = {
      ...s.getHeaders(),
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Origin": "https://bitchipdigital.com",
      "Referer": "https://bitchipdigital.com/",
      "Host": "app.mailcamplly.com",
      "Connection": "keep-alive",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "DNT": "1",
      "Upgrade-Insecure-Requests": "1",
    };

    let { data } = await ress.post("https://app.mailcamplly.com/api/instagram-profile", s, { headers });

    return {
      ...data
    };
  } catch (e) {
    return {
      msg: "Error Terjadi",
      errMessage: e.message
    };
  }
};