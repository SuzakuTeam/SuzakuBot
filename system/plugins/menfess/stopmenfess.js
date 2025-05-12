module.exports = {
    command: "stopmenfess",
    alias: [],
    category: ["menfess"],
    settings: {},
    description: "Menolak Pesan Menfess",
    async run(m, ctx, {
        system,
        text
    }) {
        switch (m.command) {
            case "stopmenfess": {
                system.menfes = system.menfes ?? {};
                const find = Object.values(system.menfes).find(menpes => [menpes.a, menpes.b].includes(m.sender));
                if (!find) return m.reply("Belum ada sesi menfess");

                const to = find.a === m.sender ? find.b : find.a;
                await system.sendMessage(to, {
                    text: "_Sesi menfess ini telah dihentikan._",
                    mentions: [m.sender],
                });
                m.reply("Sesi menfess dihentikan.");
                delete system.menfes[find.id];
            }
            break;
        }
    }
}
