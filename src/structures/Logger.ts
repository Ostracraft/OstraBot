import settings from "../config/settings";

function info(message: string) {
    console.log(`[${settings.bot.name}] ${message}`);
}

function warn(message: string) {
    console.warn(`[${settings.bot.name}] ${message}`);
}

function error(message: string) {
    console.error(`[${settings.bot.name}] ${message}`);
}

export default {
    info,
    warn,
    error,
}