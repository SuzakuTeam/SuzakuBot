module.exports = {
    command: "tolakmenfess",
    alias: [],
    category: ["menfess"],
    settings: {},
    description: "Menolak Pesan Menfess",
    async run(m, ctx, {
        system,
        text
    }) {
        switch (m.command) {
            case "tolakmenfess": {
                system.menfes = system.menfes ?? {};
                const roof = Object.values(system.menfes).find(menpes => [menpes.a, menpes.b].includes(m.sender));
                if (!roof) return m.reply("Belum ada sesi menfess");

                const other = [roof.a, roof.b].find(user => user !== m.sender);
                await system.sendMessage(other, {
                    text: `_Maaf, @${m.sender.split("@")[0]} menolak menfess kamu._`,
                    mentions: [m.sender],
                });
                m.reply("Menfess berhasil ditolak.");
                delete system.menfes[roof.id];
            }
            break;
        }
    }
}
