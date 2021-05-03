import { AkairoClient, CommandHandler } from "discord-akairo";
import Logger from "@app/structures/Logger";
import settings from "@app/config/settings";
import * as path from 'path';
import { ListenerHandler } from "discord-akairo";
import OstraCacheManager from "./types/OstraCacheManager";
import { default as Sanction } from "./models/sanction";
import { nullop } from "./utils";
import * as resolvers from '@app/resolvers';
import TaskHandler from "./structures/TaskHandler";

class OstraClient extends AkairoClient {
    constructor() {
        super({
            ownerID: process.env.OWNER_ID,
        }, {
            disableMentions: 'everyone',
        });
        
        Logger.info('Starting the bot...');
        this.cache = new OstraCacheManager();
        
        Logger.info('Creating Command handler');
        this.commandHandler = new CommandHandler(this, {
            prefix: settings.bot.prefix,
            allowMention: false,
            commandUtil: true, // a voir
            fetchMembers: true,
            directory: path.join(__dirname, 'commands/'),
            automateCategories: true,
        });

        Logger.info('Creating Listener handler');
        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, 'listeners/'),
            automateCategories: true,
        });

        Logger.info('Creating Task handler');
        this.taskHandler = new TaskHandler(this, {
            directory: path.join(__dirname, 'tasks/'),
            automateCategories: true,
        });

        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
        })
        this.listenerHandler.loadAll();
        this.taskHandler.loadAll();

        for (const [name, resolver] of Object.entries(resolvers)) {
            this.commandHandler.resolver.addType(name, resolver);
        }

        Logger.info('Caching database');
        this._loadSanctions();

        this.on('ready', () => {
            this.guild = this.guilds.resolve(settings.bot.guild);
            Logger.info('Bot is ready !');  
            this.loaded = true;
        });
    }

    private async _loadSanctions(): Promise<void> {
        const sanctions = await Sanction.find().catch(nullop);
        if(sanctions)
            this.cache.sanctions.push(...sanctions);
    }
}

export default OstraClient;