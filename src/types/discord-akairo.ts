import { GuildMessage } from ".";
import OstraCacheManager from "./OstraCacheManager";
import TaskHandler from '@app/structures/TaskHandler';
import { Guild } from "discord.js";

declare module 'discord-akairo' {

    interface AkairoClient {
        loaded: boolean;
        guild: Guild;
        cache: OstraCacheManager;
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        taskHandler: TaskHandler;
    }

    interface CommandDetails {
        name: string;
        content: string;
        usage: string;
        examples: string[];
        permissions?: string;
    }

    interface Command {
        rules?: number[];
        details: CommandDetails;

        exec(message: GuildMessage, args: unknown): unknown;
    }

}