const axios = require("axios");

async function events(m, ctx, { system, text }) {
 if (db.list().settings.autoai) {
	if (!m.quoted) return;
	if (m.fromMe) return;
	if (!m.quoted.fromMe) return;
	
	try {
		let { data } = await axios.get(`https://velyn.biz.id/api/ai/llama-3.1-8b?prompt=${m.text}`)
		let response = data.data.response
		console.log(data)
		response = response.replace(/\*\*/g, "*")
		return m.reply(response)
	} catch (e) {
		console.error(e)
		return m.reply("Yahhh Server Error ☹️")
	}
 } 
}

module.exports = {
	events,
}