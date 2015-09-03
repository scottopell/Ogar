import * as Packet from './packet/index';
import GameServer from './GameServer';
import PlayerTracker from './PlayerTracker';

function stobuf(buf) {
  var length = buf.length;
  var arrayBuf = new ArrayBuffer(length);
  var view = new Uint8Array(arrayBuf);

  for (var i = 0; i < length; i++) {
    view[i] = buf[i];
  }

  return view.buffer;
}

export default class PacketHandler{
  gameServer: GameServer;
  socket: any;
  protocol: number;

  pressQ: boolean;
  pressW: boolean;
  pressSpace: boolean;

  constructor(gameServer: GameServer, socket) {
    this.gameServer = gameServer;
    this.socket = socket;
    // Detect protocol version - we can do something about it later
    this.protocol = 0;

    this.pressQ = false;
    this.pressW = false;
    this.pressSpace = false;
  }

  handleMessage(message) {

    // Discard empty messages
    if (message.length == 0) {
      return;
    }

    var buffer = stobuf(message);
    var view = new DataView(buffer);
    var packetId = view.getUint8(0);

    switch (packetId) {
      case 0:
        // Check for invalid packets
        if ((view.byteLength + 1) % 2 == 1) {
          break;
        }

        // Set Nickname
        var nick = "";
        // 2 bytes per char
        var maxLen = this.gameServer.config.playerMaxNickLength * 2;
        for (var i = 1; i < view.byteLength && i <= maxLen; i += 2) {
          var charCode = view.getUint16(i, true);
          if (charCode == 0) {
            break;
          }

          nick += String.fromCharCode(charCode);
        }
        this.setNickname(nick);
        break;
      case 1:
        // Spectate mode
        if (this.socket.playerTracker.cells.length <= 0) {
          // Make sure client has no cells
          this.gameServer.switchSpectator(this.socket.playerTracker);
          this.socket.playerTracker.spectate = true;
        }
        break;
      case 16:
        // Set Target
        if (view.byteLength == 13) {
          var client = this.socket.playerTracker;
          client.mouse.x = view.getInt32(1, true);
          client.mouse.y = view.getInt32(5, true);
        }
        break;
      case 17:
        // Space Press - Split cell
        this.pressSpace = true;
        break;
      case 18:
        // Q Key Pressed
        this.pressQ = true;
        break;
      case 19:
        // Q Key Released
        break;
      case 21:
        // W Press - Eject mass
        this.pressW = true;
        break;
      case 255:
        // Connection Start 
        if (view.byteLength == 5) {
          this.protocol = view.getUint32(1, true);
          // Send SetBorder packet first
          var c = this.gameServer.config;
          this.socket.sendPacket(new Packet.SetBorder(c.borderLeft, c.borderRight, c.borderTop, c.borderBottom));
        }
        break;
      default:
        break;
    }
  };

  setNickname(newNick) {
    var client: PlayerTracker = this.socket.playerTracker;
    if (client.cells.length < 1) {
      // Set name first
      client.setName(newNick); 

      // If client has no cells... then spawn a player
      this.gameServer.gameMode.onPlayerSpawn(this.gameServer, client);

      // Turn off spectate mode
      client.spectate = false;
    }
  };
}
