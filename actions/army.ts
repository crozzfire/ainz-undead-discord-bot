import { Action } from './action';
import DB from '../db';
import { Skeleton } from '../models/skeleton';
import config from 'config';
import * as _  from 'lodash';
import { Character } from '../models/character';
const Discord = require('discord.js');

export class ArmyAction implements Action {
  private readonly command: string;
  private readonly args : [string];
  private state : any = {};
  private response: any = 'Unsupported sub command';

  public constructor(command, args) {
    this.command = command;
    this.args = args.length ? args : [''];
  }

  calculate() {
    const armyPopulationTypes = config.get('currentArmyContains');
    armyPopulationTypes.forEach((type: string) => {
      const collection = DB.getCollection(type);
      this.state[type] = collection.find();
    });

    const subCommand = this.args[0];
    switch (subCommand) {
      case 'stats':
        return this.generateStats();
    }
  }

  generateStats() {
    const stats = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('💀 Current Stats 💀')
      .setTimestamp();

    for (const categoryKey in this.state) {
      const categoryData = this.state[categoryKey];

      stats.addFields(
        { name: _.upperFirst(categoryKey), value: `Current Count = ${categoryData.length}` },
      );

      categoryData.forEach((char: Character) => {
        stats.addFields(
          { name: `${char.nickname}`, value: `*Current HP* : ${char.currentHP}`, inline: true },
        );
      })
    }

    this.response = stats;
  }

  getResponse() : string {
    this.calculate()
    return this.prettify();
  }

  prettify() : string {
    return this.response;
  }
}