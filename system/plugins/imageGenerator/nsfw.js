const REQUEST = require("axios");

let handler = async (m, { system, text }) => {
  if (!text) return m.reply(`> Masukkan Prompt Nya Ppk\n> .${m.command} Sexy Girl`)
  
  try {
    let url = await nsfwGenerator.generate({ negativePrompt: "", prompt: text })
    await m.reply({
      image: { url },
      caption: "*Done Kink Jangan Crot Ya*"
    })
  } catch (e) {
    system.addToLog(e.message, {
      isError: true
      })
  }
}

handler.command = "nsfw";
handler.alias = ["nsfwimage"];
handler.category = ["ai"];
handler.description = "";
handler.settings = { limit: true };
handler.loading = true

module.exports = handler;

const nsfwGenerator = {
  create: async (opt) => {
    const { negativePrompt, prompt } = opt;
    const payload = {
      clip_skip: 2,
      guidance: 7,
      height: 768,
      lora_ids: "",
      lora_weight: "0.7",
      model_id: "dreamshaper_8",
      negative_prompt: negativePrompt,
      prompt: prompt,
      sampler: "Euler a",
      samples: 1,
      seed: 0,
      steps: 25,
      width: 512
    };
    const { data } = await REQUEST.post("https://api.arting.ai/api/cg/text-to-image/create", payload);
    return data.data.request_id;
  },

  process: async (requestId) => {
    const payload = { request_id: requestId };
    while (true) {
      const { data } = await REQUEST.post("https://api.arting.ai/api/cg/text-to-image/get", payload);
      if (data?.data?.output?.length > 0) {
        return data;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  },

  generate: async (opt) => {
    const requestId = await nsfwGenerator.create({
      negativePrompt: opt.negativePrompt,
      prompt: opt.prompt
    });
    const result = await nsfwGenerator.process(requestId);
    return result.data.output[0];
  }
};