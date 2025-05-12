const axios = require("axios");
const fs = require("fs").promises;

async function getToken(url) {
    try {
        const response = await axios.get(url);
        const cookies = response.headers["set-cookie"];
        const joinedCookies = cookies ? cookies.join("; ") : null;

        const csrfTokenMatch = response.data.match(
            /<meta name="csrf-token" content="(.*?)">/
        );
        const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;

        if (!csrfToken || !joinedCookies) {
            throw new Error("Gagal mendapatkan CSRF token atau cookie.");
        }

        return {
            csrfToken,
            joinedCookies
        };
    } catch (error) {
        console.error("❌ Error fetching cookies or CSRF token:", error.message);
        throw error;
    }
}

async function mlStalk(userId, zoneId) {
    try {
        const { csrfToken, joinedCookies } = await getToken("https://www.gempaytopup.com");

        const payload = {
            uid: userId,
            zone: zoneId,
        };

        const { data } = await axios.post(
            "https://www.gempaytopup.com/stalk-ml",
            payload, {
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "Content-Type": "application/json",
                    Cookie: joinedCookies,
                },
            }
        );

        return data;
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Response:", error.response?.data || "No response data");
    }
}

module.exports = mlStalk;