import type { TextChannel } from 'discord.js';
import messages from '@app/config/messages';
import Sanction from '@app/models/sanction';
import SanctionsManager from '@app/moderation/SanctionsManager';
import Task from '@app/structures/Task';
import type { SanctionDocument } from '@app/types';
import { SanctionTypes } from '@app/types';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');

class ModerationTask extends Task {
    constructor() {
        super('moderation', {
            interval: 10_000, // 10 seconds
        });
    }

    public async exec(): Promise<void> {
        if (this.client.loaded)
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
                const unban = await SanctionsManager.unban(this.client, sanction);
                if (!unban) {
                    const banChannel = this.client.guild.channels.cache.get(sanction.channel);
                    // If(!banChannel || !banChannel.isText())
                    //     return;
                    (banChannel as TextChannel).send(pupa(messages.unbanError, { victim: sanction.memberId }))
                        .catch(noop);
                }
            }
        }
    }
}

export default ModerationTask;
