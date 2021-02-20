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
      .setTitle('Commands supported currently')
      .setDescription('List of commands currently supported')
      .addFields(
        { name: 'Get skeletons current stats', value: '`!ainz skeletons stats`' },
        { name: 'Set skeletons count', value: '`!ainz skeletons set count <count>`' }
      )
      .setImage(`${config.get('BASE_URL')}/assets/images/skeleton.jpeg`)
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