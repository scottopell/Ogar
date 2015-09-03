import Cell from './Cell';

export default class EjectedMass extends Cell {
  size: number;
  squareSize: number;

  constructor(nodeId, owner, position, mass, gameServer){
    super(nodeId, owner, position, mass, gameServer);

    this.cellType = 3;
    this.size = Math.ceil(Math.sqrt(100 * this.mass));
    // not being decayed -> calculate one time
    this.squareSize = (100 * this.mass) >> 0;
  }

  getSize() {
    return this.size;
  }

  getSquareSize () {
    return this.squareSize;
  }

  calcMove = function(){
    //no-op
  }


  // Main Functions

  sendUpdate() {
    // Whether or not to include this cell in the update packet
    if (this.moveEngineTicks == 0) {
      return false;
    }
    return true;
  }

  onRemove(gameServer) {
    // Remove from list of ejected mass
    var index = gameServer.nodesEjected.indexOf(this);
    if (index != -1) {
      gameServer.nodesEjected.splice(index,1);
    }
  }

  onConsume(consumer,gameServer) {
    // Adds mass to consumer
    consumer.addMass(this.mass);
  }

  onAutoMove(gameServer) {
    if (gameServer.nodesVirus.length < gameServer.config.virusMaxAmount) {
      // Check for viruses
      var v = gameServer.getNearestVirus(this);
      if (v) { // Feeds the virus if it exists
        v.feed(this,gameServer);
        return true;
      }
    }
  }

  moveDone(gameServer) {
    if (!this.onAutoMove(gameServer)) {
      gameServer.nodesEjected.push(this);
    }
  }

}
