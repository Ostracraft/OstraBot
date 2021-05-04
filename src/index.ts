/* eslint-disable import/first */
/* eslint-disable import/order */
/* eslint-disable import/no-commonjs */
require('module-alias/register');
require('dotenv').config();

import OstraClient from '@app/OstraClient';
import settings from '@app/config/settings';
import { noop } from './utils';
import mongoose = require('mongoose');
import Logger from './structures/Logger';

mongoose.connect(settings.database.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).catch(() => {
    Logger.error('Failed to connect to MongoDB !');
    Logger.error('Shutting down the bot in 2 seconds');
    // eslint-disable-next-line node/no-process-exit
    setTimeout(() => process.exit(0), 2000);
});


const client = new OstraClient();
client.login(process.env.TOKEN).catch(noop);

export default {
    client,
};
