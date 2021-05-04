/* eslint-disable import/first */
/* eslint-disable import/order */
// eslint-disable-next-line import/no-commonjs
require('module-alias/register');

import OstraClient from '@app/OstraClient';
import settings from '@app/config/settings';
import { noop } from './utils';
import dotenv = require('dotenv');
import mongoose = require('mongoose');

dotenv.config();

void mongoose.connect(settings.database.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const client = new OstraClient();
client.login(process.env.TOKEN).catch(noop);

export default {
    client,
};
