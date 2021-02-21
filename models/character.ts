export abstract class Character {
  public type : string;
  public sequence : number;
  public nickname : string;
  public maxHP : number;
  public currentHP : number;
  public lastReset : Date;
  public actions : any;

  public constructor(sequence: number = 1) {
    this.sequence = sequence;
    this.nickname = `${this.type} #${this.sequence} `;
    this.lastReset = new Date();
  }
}