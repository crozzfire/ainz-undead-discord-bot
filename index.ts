import express from 'express';
import { BotHandler } from './bot';
import config from 'config';
const Discord = require('discord.js');
const app = express();
const port = process.env.PORT || 3000;

const client = new Discord.Client();
client.once('ready', () => {
  console.log('Discord client is ready to serve Ainz Sama!');
});

client.login(config.get('BOT_TOKEN'));

app.get('/', (req, res) => {
  const handler = new BotHandler(client);
  handler.handleMessages();
});

app.listen(port, () => console.log(`Ainz Undead bot listening on port ${port}!`))