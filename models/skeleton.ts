import config from "config";
import { Character } from "./character";

export class Skeleton extends Character {
  public type : string = 'Skeleton';
  public sequence : number = 1;
  public nickname : string = `${this.type} #${this.sequence} `;
  public maxHP : number;
  public currentHP : number;
  public lastReset : Date;
  public actions : any;

  public constructor(sequence: number) {
    super();
    this.sequence = sequence;
    this.nickname = `${this.type} #${this.sequence}`;
    this.actions = config.get('skeletons.actions');
    this.maxHP = config.get('skeletons.maxHP');
    this.currentHP = this.maxHP;
    this.lastReset = new Date();
  }
}