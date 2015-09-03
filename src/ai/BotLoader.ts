// Project imports
import BotPlayer from './BotPlayer';
import FakeSocket from './FakeSocket';
import PacketHandler from '../PacketHandler';
import GameServer from '../GameServer';

export default class BotLoader {
  gameServer: GameServer;
  randomNames: string[];
  nameIndex: number;

  constructor(gameServer: GameServer){
    this.gameServer = gameServer;
    this.loadNames();
  }


  getName() {
    var name = "";

    // Picks a random name for the bot
    if (this.randomNames.length > 0) {
      var index = Math.floor(Math.random() * this.randomNames.length);
      name = this.randomNames[index];
      this.randomNames.splice(index,1);
    } else {
      name = "bot" + ++this.nameIndex;
    }

    return name;
  };

  loadNames() {
    this.randomNames = [];

    // Load names
    try {
      var fs = require("fs"); // Import the util library

      // Read and parse the names - filter out whitespace-only names
      this.randomNames = fs.readFileSync("./botnames.txt", "utf8").split(/[\r\n]+/).filter(function(x) {
        return x != ''; // filter empty names
      });
    } catch (e) {
      // Nothing, use the default names
    }

    this.nameIndex = 0;
  };

  addBot() {
    var s = new FakeSocket(this.gameServer);
    s.playerTracker = new BotPlayer(this.gameServer, s);
    s.packetHandler = new PacketHandler(this.gameServer, s);

    // Add to client list
    this.gameServer.clients.push(s);

    // Add to world
    s.packetHandler.setNickname(this.getName());
  };


}
