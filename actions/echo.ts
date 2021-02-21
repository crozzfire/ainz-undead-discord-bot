import { Action } from './action';

export class EchoAction implements Action {
  private readonly command: string;
  private readonly args : [string]  = ['Nothing to echo :/'];
  private response : string;

  public constructor(command, args) {
    this.command = command;
    this.args = args.length ? args : ['Nothing to echo :/'];
  }

  calculate() {
    this.response = this.args.join(' ');
  }

  getResponse() : string {
    this.calculate()
    return this.prettify();
  }

  prettify() : string {
    return this.response;
  }
}