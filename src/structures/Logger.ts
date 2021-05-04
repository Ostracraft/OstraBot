import settings from '../config/settings';

function info(message: string): void {
    console.log(`[${settings.bot.name}] ${message}`);
}

function warn(message: string): void {
    console.warn(`[${settings.bot.name}] ${message}`);
}

function error(message: string): void {
    console.error(`[${settings.bot.name}] ${message}`);
}

export default {
    info,
    warn,
    error,
};
