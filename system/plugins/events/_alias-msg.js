const {
    generateWAMessage,
    areJidsSameUser,
    proto
} = require("baileys");

async function events(m, {
    system
}) {
    system.sendAliasMessage = async (jid, mess = {}, alias = {}, quoted = null) => {
        function check(arr) {
            if (!Array.isArray(arr)) {
                return false;
            }
            if (!arr.length) {
                return false;
            }
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (typeof item !== "object" || item === null) {
                    return false;
                }
                if (!Object.prototype.hasOwnProperty.call(item, "alias")) {
                    return false;
                }
                if (!Array.isArray(item.alias) && typeof item.alias !== "string") {
                    return false;
                }
                if (
                    Object.prototype.hasOwnProperty.call(item, "response") &&
                    typeof item.response !== "string"
                ) {
                    return false;
                }
                if (
                    Object.prototype.hasOwnProperty.call(item, "eval") &&
                    typeof item.eval !== "string"
                ) {
                    return false;
                }
            }
            return true;
        }
        if (!check(alias)) return "Alias format is not valid!";
        let message = await system.sendMessage(jid, mess, {
            quoted: quoted
        });
        if (typeof system.alias[jid] === "undefined")
            system.alias[jid] = {};
        system.alias[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            alias,
        };
        return message;
    };
    system.sendInputMessage = async (
        jid,
        mess = {},
        target = "all",
        timeout = 60000,
        quoted = null,
    ) => {
        let time = Date.now();
        let message = await system.sendMessage(jid, mess, {
            quoted: quoted
        });
        if (typeof system.input[jid] === "undefined")
            system.input[jid] = {};
        system.input[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            target,
        };

        while (
            Date.now() - time < timeout &&
            !system.input[jid][message.key.id].hasOwnProperty("input")
        )
            await system.delay(500);

        return system.input[jid][message.key.id].input;
    };

    if (typeof system.alias === "undefined")
        system.alias = {};
    if (typeof system.input === "undefined")
        system.input = {};

    if (m.quoted) {
        const quotedId = m.quoted.id;
        if (
            system.input[m.cht]?.[quotedId]?.target === "all" ||
            system.input[m.cht]?.[quotedId]?.target === m.sender
        ) {
            system.input[m.cht][quotedId].input = m.body;
        }
        if (system.alias.hasOwnProperty(m.cht)) {
            if (system.alias[m.cht].hasOwnProperty(quotedId)) {
                for (const aliasObj of system.alias[m.cht][quotedId].alias) {
                    if (
                        Array.isArray(aliasObj.alias) &&
                        !aliasObj.alias
                        .map((v) => v.toLowerCase())
                        .includes(m.body.toLowerCase())
                    )
                        continue;
                    else if (aliasObj.alias.toLowerCase() !== m.body.toLowerCase())
                        continue;
                    else {
                        if (aliasObj.response)
                            await m.emit(aliasObj.response);
                        if (aliasObj.eval) await eval(aliasObj.eval);
                    }
                }
            }
        }
    }
};

module.exports = {
    events
};