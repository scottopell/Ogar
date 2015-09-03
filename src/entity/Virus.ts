import Cell from './Cell';

export default class Virus extends Cell{
  spiked: number;
  fed: number;

  constructor(nodeId, owner, position, mass, gameServer){
    super(nodeId, owner, position, mass, gameServer);
    this.cellType = 2;
    this.spiked = 1;
    this.fed = 0;
  }

  calcMove(){
    // no-op Only for player controlled movement
  }

  feed(feeder,gameServer) {
    // Set direction if the virus explodes
    this.setAngle(feeder.getAngle());
    this.mass += feeder.mass;
    this.fed++; // Increase feed count
    gameServer.removeNode(feeder);

    // Check if the virus is going to explode
    if (this.fed >= gameServer.config.virusFeedAmount) {
      this.mass = gameServer.config.virusStartMass; // Reset mass
      this.fed = 0;
      gameServer.shootVirus(this);
    }

  }

  // Main Functions

  getEatingRange() {
    return this.getSize() * .4; // 0 for ejected cells
  }

  onConsume(consumer,gameServer) {
    var client = consumer.owner;

    // Maximum amount of splits
    var maxSplits = Math.floor(consumer.mass/16) - 1;
    // Get number of splits
    var numSplits = gameServer.config.playerMaxCells - client.cells.length;
    numSplits = Math.min(numSplits, maxSplits);
    // Maximum size of new splits
    var splitMass = Math.min(consumer.mass/(numSplits + 1), 36);

    // Cell consumes mass before splitting
    consumer.addMass(this.mass);

    // Cell cannot split any further
    if (numSplits <= 0) {
      return;
    }

    // Big cells will split into cells larger than 36 mass (1/4 of their mass)
    var bigSplits = 0;
    var endMass = consumer.mass - (numSplits * splitMass);
    if ((endMass > 300) && (numSplits > 0)) {
      bigSplits++;
      numSplits--;
    }
    if ((endMass > 1200) && (numSplits > 0)) {
      bigSplits++;
      numSplits--;
    }
    if ((endMass > 3000) && (numSplits > 0)) {
      bigSplits++;
      numSplits--;
    }

    // Splitting
    var angle = 0; // Starting angle
    for (var k = 0; k < numSplits; k++) {
      angle += 6/numSplits; // Get directions of splitting cells
      gameServer.newCellVirused(client, consumer, angle, splitMass,150);
      consumer.mass -= splitMass;
    }

    for (var k = 0; k < bigSplits; k++) {
      angle = Math.random() * 6.28; // Random directions
      splitMass = consumer.mass / 4;
      gameServer.newCellVirused(client, consumer, angle, splitMass,20);
      consumer.mass -= splitMass;
    }

    // Prevent consumer cell from merging with other cells
    consumer.calcMergeTime(gameServer.config.playerRecombineTime);
  }

  onAdd(gameServer) {
    gameServer.nodesVirus.push(this);
  }

  onRemove(gameServer) {
    var index = gameServer.nodesVirus.indexOf(this);
    if (index != -1) {
      gameServer.nodesVirus.splice(index, 1);
    } else {
      console.log("[Warning] Tried to remove a non existing virus!");
    }
  }

}
