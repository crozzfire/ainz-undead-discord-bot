import { Action } from './action';
import DB from '../db';
import { Skeleton } from '../models/skeleton';
import config from 'config';
import * as _  from 'lodash';
import { DiceRoll } from 'rpg-dice-roller';

const Discord = require('discord.js');

export class SkeletonAction implements Action {
  private readonly command: string;
  private readonly args : string[];
  private state : Skeleton[];
  private response: any = 'Unsupported sub command';
  private static readonly collectionName = 'skeletons';

  public constructor(command, args) {
    this.command = command;
    this.args = args.length ? args : [''];
    this.state = DB.getCollection(SkeletonAction.collectionName);

    if (!this.state) {
      this.initSkeletonCollection();
    }
  }

  initSkeletonCollection(numSkeletons?: number) {
    if (!numSkeletons) {
      numSkeletons = config.get('skeletons.defaultActiveCount')
    }

    let sequence = 1;
    const skeletons = DB.addCollection(SkeletonAction.collectionName);

    while (numSkeletons) {
      const skeleton = new Skeleton(sequence);
      skeletons.insert(skeleton);

      numSkeletons--;
      sequence++;
    }
  }

  calculate() {
    const skeletonsCollection = DB.getCollection(SkeletonAction.collectionName);
    this.state = skeletonsCollection.find();
    const subCommand = this.args[0];

    switch(subCommand) {
      case 'reset-all':
        return this.handleResetAll();

      case 'roll-attack':
        const actionAttack = this.args.length > 1 ? this.args[1] : '';
        const dc = this.args.length > 2 ? +this.args[2] : -1;
        let numSkeletonsAttack = this.args.length > 3 ? +this.args[3] : this.state.length;
        return this.handleRollAttack(actionAttack, dc, numSkeletonsAttack);

      case 'roll-damage':
        const action = this.args[1];
        let numSkeletonsDamage = this.args.length > 2 ? +this.args[2] : this.state.length;
        return this.handleRollDamage(action, numSkeletonsDamage);

      case 'set-damage-taken':
        return this.handleSetDamageTaken();
      }
    }

  handleRollAttack(action: string, dc: number, numSkeletons: number) {
    if (dc < 0 || _.isNaN(dc)) {
      return this.response = 'DC param is required and cannot be < 0';
    }

    if (!config.has(`skeletons.actions.${action}`)) {
      return this.response = "Invalid action :/";
    }

    const dice = config.get(`skeletons.actions.${action}.attack`);
    let totalHits = 0;
    let result = `Rolling Attack ${dice} for ${numSkeletons} skeletons...  \n`;

    for (let i = 0; i < numSkeletons; i++) {
      const roll = new DiceRoll(dice);
      let hasHit: boolean = (roll.total >= dc);
      result += `*${this.state[i].nickname}* rolled ${roll.output} ${hasHit ? '[Hits]' : ['Misses']}  \n`;

      if (hasHit) totalHits++;
    }

    result += `*Total hits* = *${totalHits}*  \n`;
    const nextRoll = totalHits > 0 ? `!ainz skeletons roll-damage ${action} ${totalHits}` : false;
    result += nextRoll ? '*Roll for damage:* `' + nextRoll + '`' : 'Every skeleton missed :(';

    return this.response = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('💀 Skeletons rolling for Attack 💀')
      .addFields(
        { name: "Result", value: result }
      )
      .setTimestamp();
  }

  handleRollDamage(action: string, numSkeletons: number) {
    if (!config.has(`skeletons.actions.${action}`)) {
      return this.response = "Invalid action :/";
    }

    const dice = config.get(`skeletons.actions.${action}.damage`);
    let total = 0;
    let result = `Rolling Damage ${dice} for ${numSkeletons} skeletons...  \n`;

    for (let i = 0; i < numSkeletons; i++) {
      const roll = new DiceRoll(dice);
      result += `*${this.state[i].nickname}* rolled ${roll.output}  \n`;
      total += +roll.total;
    }

    result += `*Total* = *${total}*`;

    return this.response = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('💀 Skeletons rolling for Damage 💀')
      .addFields(
        { name: "Result", value: result }
      )
      .setTimestamp();
  }


  handleSetDamageTaken() {

  }

  handleResetAll() {
    const oldCount = this.state.length;
    const hasNewCount = this.args.length && _.isNumber(+this.args[0]) ? true : false;

    DB.removeCollection(SkeletonAction.collectionName);

    if (hasNewCount) {
      this.initSkeletonCollection(+this.args[0]);
    } else {
      this.initSkeletonCollection();
    }

    this.response = "Successfully reset the skeleton army. Type `!ainz army stats` to see current stats";
  }

  getResponse() : string {
    this.calculate()
    return this.prettify();
  }

  prettify() : string {
    return this.response;
  }
}