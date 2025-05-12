let handler = async (m, ctx, { client }) => {
	let textTruth = await getTextTrutb()
	return m.reply(textTruth)
}

handler.command = "truth";
handler.alias = ["jawabbenar"];
handler.category = ["fun"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true;

module.exports = handler;

async function getTextTrutb() {
 const truthList = [
  "Apa ketakutan terbesar kamu?",
  "Siapa orang yang paling sering ada di pikiranmu belakangan ini?",
  "Kalau kamu bisa ubah satu hal dari hidupmu, apa itu?",
  "Pernah bohong ke sahabatmu? Tentang apa?",
  "Siapa orang yang pernah bikin kamu sakit hati banget?",
  "Kalau disuruh jujur, kamu lagi suka siapa sekarang?",
  "Pernah menangis diam-diam gara-gara seseorang? Siapa?",
  "Kalau bisa balikan sama mantan, kamu mau?",
  "Hal paling bodoh yang pernah kamu lakukan apa?",
  "Kalau semua orang tahu rahasiamu, apa yang kamu paling takut ketahuan?",
  "Siapa orang yang kamu rindukan sekarang?",
  "Kamu pernah pura-pura bahagia? Ceritain kenapa.",
  "Hal paling konyol yang pernah kamu lakukan demi cinta apa?",
  "Kalau disuruh milih, cinta atau sahabat?",
  "Kamu pernah suka sama teman sendiri? Siapa?",
  "Kalau bisa menghilangkan satu kenangan, kenangan apa?",
  "Pernah ghosting orang? Ceritain alasannya.",
  "Kamu lebih pilih diselingkuhi atau diputusin tiba-tiba?",
  "Apa rahasia terbesar yang belum pernah kamu ceritakan ke siapa pun?",
  "Kalau bisa kirim pesan ke mantan, kamu mau bilang apa?",
  "Apa hal yang menurutmu paling memalukan yang pernah kamu lakukan?",
  "Kamu lebih pilih patah hati sekali atau disakitin berkali-kali?",
  "Siapa orang yang paling kamu percaya saat ini?",
  "Apa yang sering kamu pikirin pas lagi sendirian?",
  "Kalau dikasih kesempatan ulang hidup dari awal, kamu mau?"
];
 const randomTruth = truthList[Math.floor(Math.random() * truthList.length)];
 return randomTruth
}