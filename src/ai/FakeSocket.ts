import GameServer from '../GameServer';
import PlayerTracker from '../PlayerTracker';
import PacketHandler from '../PacketHandler';

// A fake socket for bot players
export default class FakeSocket {
  server: GameServer;
  playerTracker: PlayerTracker;
  packetHandler: PacketHandler;

  constructor(gameServer){
    this.server = gameServer;
  }

  // Override
  sendPacket(packet) {
    // Fakes sending a packet
    return;
  }

  close(error) {
    // Removes the bot
    var len = this.playerTracker.cells.length;
    for (var i = 0; i < len; i++) {
      var cell = this.playerTracker.cells[0];

      if (!cell) {
        continue;
      }

      this.server.removeNode(cell);
    }

    var index = this.server.clients.indexOf(this);
    if (index != -1) {
      this.server.clients.splice(index, 1);
    }
  }
}
