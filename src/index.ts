require('dotenv').config();
require('module-alias/register')

import mongoose = require('mongoose');
import settings from "@app/config/settings";
import OstraClient from "@app/OstraClient";

void mongoose.connect(settings.database.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const client = new OstraClient();
client.login(process.env.TOKEN);
export default {
    client,
}