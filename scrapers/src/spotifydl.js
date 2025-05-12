const axios = require("axios");

const spot = {
  dl: async (u) => {
    let pyld = {
      url: u
    }
    let { data } = await axios.post("https://spotydown.com/api/download-track", pyld)
    return data
  }
}

module.exports = spot;