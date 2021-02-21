import { EchoAction } from './actions/echo';
import { HelpAction } from './actions/help';
import { SkeletonAction } from './actions/skeleton';
import { ArmyAction } from './actions/army';

export class BotHandler {
  private client;
  private readonly PREFIX = '!ainz';

  public constructor(client) {
    this.client = client;
  }

  public handleMessages() : void {
    this.client.on('message', message => {
      try {
        !message.author.bot && this.handleMessage(message);
      } catch (err) {
        console.log("Error: ", err);
        message.channel.send = "That command killed the bot! Ask Ainz sama to help resurrect!"
      }
    });
  }

  private handleMessage(message) {
    const data = this.getCommandData(message);
    let response = '¯\_(ツ)_/¯';

    switch (data?.command?.toLowerCase()) {
      case 'echo' :
        response = new EchoAction(data.command, data.args).getResponse();
        break;

      case 'help' :
        response = new HelpAction(data.command, data.args).getResponse();
        break;

      case 'skeletons' :
        response = new SkeletonAction(data.command, data.args).getResponse();
        break;

      case 'army' :
        response = new ArmyAction(data.command, data.args).getResponse();
        break;

      default:
        console.log(`Unsupported command ${message.content}`);
    }

    message.channel.send(response);
  }

  private getCommandData(message) {
    if (message.content.startsWith(this.PREFIX)) {
      const args = message.content.slice(this.PREFIX.length).trim().split(/ +/).map(arg => arg.toLowerCase());
	    const command = args.shift();

      return { args, command };
    }

    return null;
  }
}