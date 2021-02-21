import { Action } from './action';
import DB from '../db';
import { Skeleton } from '../models/skeleton';
import config from 'config';
import * as _  from 'lodash';
const Discord = require('discord.js');

export class SkeletonAction implements Action {
  private readonly command: string;
  private readonly args : [string];
  private state : any;
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
    this.state = DB.getCollection(SkeletonAction.collectionName);
    const subCommand = this.args[0];

    switch(subCommand) {
      case 'reset-all':
        return this.handleResetAll();
    }
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