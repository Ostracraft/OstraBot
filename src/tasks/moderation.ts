import messages from "@app/config/messages";
import Sanction from "@app/models/sanction";
import SanctionsManager from "@app/moderation/SanctionsManager";
import Task from "@app/structures/Task";
import { SanctionDocument, SanctionTypes } from "@app/types";
import { TextChannel } from "discord.js";
import pupa = require('pupa');

class ModerationTask extends Task {
    constructor() {
        super('moderation', {
            interval: 10000, // 10 seconds
        });
    }

    public async exec(): Promise<void> {
        if(this.client.loaded)
            await this._checkForUnbans();
    }

    private async _checkForUnbans(): Promise<void> {
        const sanctions: SanctionDocument[] = await Sanction.find({
            revoked: false,
            type: SanctionTypes.TEMPBAN,
        });
        for (const sanction of sanctions) {
            const revokeTime: number = sanction.start + sanction.duration;
            const remaining: number = revokeTime - Date.now();
            if (remaining < 0) {
                // Update database
                const doc = await Sanction.findOneAndUpdate(
                    { _id: sanction.id },
                    { $set: { revoked: true, } }
                );
                // Unban user
                const unban = await SanctionsManager.unban(this.client, doc);
                if (!unban) {
                    const banChannel = this.client.guild.channels.cache.get(doc.channel);
                    console.log(banChannel);
                    // if(!banChannel || !banChannel.isText())
                    //     return;
                    (banChannel as TextChannel).send(pupa(messages.unbanError, { victim: doc.memberId }));
                }
            }
        }
    }

}
export default ModerationTask;