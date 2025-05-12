const RES = require("axios");

const models = {
  chatgpt4: "https://chatbot.nazirganz.space/api/chatgpt4o-api?prompt=",
  deepseek: "https://chatbot.nazirganz.space/api/deepseek-api?prompt=",
  metaai: "https://chatbot.nazirganz.space/api/metaai-api?prompt="
}

async function chatBotAi(p, m) {
  if (!Object.keys(models).includes(m)) {
    return `Model Yang Tersedia: ${Object.keys(model).join(", ")}`
  }
  let mdl = models[m]
  try {
    let { data } = await RES.get(mdl + encodeURIComponent(p))
    return {
      chat: data.result
    }
  } catch (e) {
    return `Error Dan Ini String Nya: ${e.message.toString()}`
  }
}

module.exports = chatBotAi;