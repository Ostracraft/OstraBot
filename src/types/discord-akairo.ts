/* eslint-disable no-undef */
import type { Guild } from 'discord.js';
import type TaskHandler from '@app/structures/TaskHandler';
import type { GuildMessage } from '@app/types';
import type OstraCacheManager from '@app/types/OstraCacheManager';

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
