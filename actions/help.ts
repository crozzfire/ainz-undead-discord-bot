import { Action } from './action';
import config from 'config';

const Discord = require('discord.js');

export class HelpAction implements Action {
  private readonly command: string;
  private readonly args : [string];
  private state;

  public constructor(command, args) {
    this.command = command;
    this.args = args;
  }

  calculate() {
    this.state = {
      content: new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('💀 Commands 💀')
      .setDescription('List of commands currently supported')
      .addFields(
        { name: 'Get current army stats', value: '`!ainz army stats`' },
        { name: 'Skeletons roll for attack', value: '`!ainz skeletons roll-attack <action> <DC> <optional: num_skeletons>`' },
        { name: 'Skeletons roll for damage', value: '`!ainz skeletons roll-damage <action> <optional: num_skeletons>`' },
        { name: 'Set skeletons damage taken (Reduces HP)', value: '`!ainz skeletons set-damage-taken <damage> <optional: skeleton#> `' },
        { name: 'Reset all skeletons', value: '`!ainz skeletons reset-all <optional: num_skeletons>`' }
      )
      .setImage(`${config.get('BASE_URL')}/images/skeleton.png`)
      .setTimestamp()
    }
  }

  getResponse() : string {
    this.calculate()
    return this.prettify();
  }

  prettify() : string {
    return this.state.content;
  }
}