import express from 'express';
import { BotHandler } from './bot';
const Discord = require('discord.js');
const app = express();
app.use(express.static('assets'))

const port = process.env.PORT || 3000;

const client = new Discord.Client();
client.once('ready', () => {
  console.log('Discord client is ready to serve Ainz Sama!');
});

client.login(process.env.BOT_TOKEN);

const handler = new BotHandler(client);
handler.handleMessages();

app.get('/', (req, res) => {
  res.send('UI coming soon!');
});

app.listen(port, () => console.log(`Ainz Undead bot listening on port ${port}!`))