import { Action } from './action';

export class SkeletonAction implements Action {
  private readonly command: string;
  private readonly args : [string];
  private state;

  public constructor(command, args) {
    this.command = command;
    this.args = args.length ? args : [];
  }

  calculate() {
    this.state = {
      content: this.args.join(' ')
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