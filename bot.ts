import { EchoAction } from './actions/echo';

export class BotHandler {
  private client;
  private readonly PREFIX = '!ainz';

  public constructor(client) {
    this.client = client;
  }

  public handleMessages() : void {
    this.client.on('message', message => {
      this.handleMessage(message);
    });
  }

  private handleMessage(message) {
    const data = this.getCommandData(message);

    switch (data.command?.toLowerCase()) {
      case 'echo' :
        const action = new EchoAction(data.command, data.args);
        const response = action.getResponse();
        return message.channel.send(response);

      default:
        message.channel.send('Unsupported command ¯\_(ツ)_/¯');
    }
  }

  private getCommandData(message) {
    if (message.content.startsWith(this.PREFIX)) {
      const args = message.content.slice(this.PREFIX.length).trim().split(/ +/);
	    const command = args.shift().toLowerCase();

      return { args, command };
    }

    return null;
  }
}