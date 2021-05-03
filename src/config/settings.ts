const settings = {
    bot: {
        name: 'OstraBot',
        prefix: '!',
        guild: process.env.GUILD_ID,
    },
    roles: {
        everyone: process.env.EVERYONE_ROLE,
        staff: process.env.STAFF_ROLE,
        banned: process.env.BANNED_ROLE,
    },
    categories: {
        banned: process.env.BANNED_CATEGORY,
    },
    colors: {
        default: '#20b848',
    },
    embed: {
        footer: 'Exécuté par {executor}'
    },
    moderation: {
        purgeLimit: 50
    },
    database: {
        mongoUri: process.env.MONGO_URI ?? "",
    },
    emojis: {
        discord: process.env.EMOJI_DISCORD ?? "",
        info: process.env.EMOJI_INFO ?? "",
        oui: process.env.EMOJI_OUI ?? "",
        non: process.env.EMOJI_NON ?? "",
    }
}

export default settings;