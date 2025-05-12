const axios = require("axios")
const qs = require("qs")

const searchVideo = async (url) => {
let { data } = await axios.post("https://ssvid.net/api/ajax/search", qs.stringify({ query: url, vt: "home" }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}

const ymp3 = async (url) => {
let res = await searchVideo(url)
let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp3.mp3128.k }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}

const ytmp4 = async (url) => {
let res = await searchVideo(url)
let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp4.auto.k }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}
