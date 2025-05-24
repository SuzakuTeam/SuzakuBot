const axios = require("axios");
const FormData = require("form-data");

const vheer = {
	upload: async (prompt) => {
		let d = new FormData();
		d.append("prompt", prompt);
		d.append("type", 1);
		d.append("width", 1024);
		d.append("height", 1024);
		d.append("flux_model", 1);

		let headers = {
			headers: {
				...d.getHeaders(),
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
				"Accept": "application/json, text/plain, */*",
				"Accept-Language": "en-US,en;q=0.9",
				"Origin": "https://vheer.com",
				"Referer": "https://vheer.com/",
				"Connection": "keep-alive"
			}
		};

		let { data } = await axios.post("https://access.vheer.com/api/Vheer/UploadByFile", d, headers);
		return {
			code: data.data.code
		};
	},

	getImage: async (imgCode) => {
		let payload = [{
			type: 1,
			code: imgCode
		}];

		let headers = {
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
				"Accept": "application/json, text/plain, */*",
				"Accept-Language": "en-US,en;q=0.9",
				"Origin": "https://vheer.com",
				"Referer": "https://vheer.com/app/text-to-image",
				"Connection": "keep-alive"
			}
		};

		let { data } = await axios.post(`https://vheer.com/app/text-to-image`, payload, headers);
		return data;
	},

	generate: async (prompt) => {
		let prompts = Buffer.from(prompt).toString('base64');
		let uploads = await vheer.upload(prompts);
		let datas = await vheer.getImage(uploads.code);
		console.log(prompts);
		console.log(uploads);
		return datas;
	}
};

module.exports = vheer;