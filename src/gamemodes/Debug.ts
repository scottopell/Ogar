import FFA from './FFA';
import * as Packet from '../packet/index';

export default class Debug extends FFA{

  constructor(){
    super();

    this.ID = 21;
    this.name = "Debug Mode";
    this.specByLeaderboard = false;
  }


  // Gamemode Specific Functions

  testPath(gameServer,player) {
    var cell = player.cells[0];
    var check = gameServer.nodesVirus[0];

    var v1 = Math.atan2(cell.position.x - player.mouse.x,cell.position.y - player.mouse.y);

    // Get angle of vector (cell -> virus)
    var v2 = this.getAngle(cell,check);
    var dist = this.getDist(cell,check);
    console.log(v1);
    console.log(v2);

    var inRange = Math.atan((2 * cell.getSize())/dist); // Opposite/adjacent
    console.log(inRange);
    if ((v1 <= (v2 + inRange)) && (v1 >= (v2 - inRange))) {
      console.log("Collided!");
    } 
  }

  getAngle(c1,c2) {
    var deltaY = c1.position.y - c2.position.y;
    var deltaX = c1.position.x - c2.position.x;
    return Math.atan2(deltaX,deltaY);
  }

  getDist(cell,check) {
    // Fastest distance - I have a crappy computer to test with :(
    var xd = (check.position.x - cell.position.x);
    xd = xd < 0 ? xd * -1 : xd; // Math.abs is slow

    var yd = (check.position.y - cell.position.y);
    yd = yd < 0 ? yd * -1 : yd; // Math.abs is slow

    return (xd + yd);
  }

  // Override

  pressW(gameServer,player) {
    // Called when the Q key is pressed
    console.log("Test:");
    this.testPath(gameServer,player);
    player.socket.sendPacket(new Packet.DrawLine(player.mouse.x,player.mouse.y));
  }

}
