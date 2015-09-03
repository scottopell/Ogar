import Cell from './Cell';

export default class Food extends Cell{
  size: number;
  squareSize: number;

  constructor(nodeId, owner, position, mass, gameServer){
    super(nodeId, owner, position, mass, gameServer);

    this.cellType = 1;
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

  calcMove(){
    //no-op Food has no need to move
  }

  sendUpdate() {
    // Whether or not to include this cell in the update packet
    if (this.moveEngineTicks == 0) {
      return false;
    }
    return true;
  }

  onRemove(gameServer) {
    gameServer.currentFood--;
  }

  onConsume(consumer,gameServer) {
    consumer.addMass(this.mass);
  }

}
