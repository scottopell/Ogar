import GameServer from '../GameServer'
import PlayerTracker from '../PlayerTracker'

export default class Mode {
  ID: number;
  name: string;
  // Modifier for decay rate (multiplier)
  decayMod: number;
  // Packet id for leaderboard packet (48 = Text List, 49 = List, 50 = Pie chart)
  packetLB: number;
  // True = gamemode uses teams, false = gamemode doesnt use teams
  haveTeams: boolean;
  // false = spectate from player list instead of leaderboard
  specByLeaderboard: boolean;

  rankOne: any;

  constructor(){
    this.ID = -1;
    this.name = "Blank";
    this.decayMod = 1.0;
    this.packetLB = 49;
    this.haveTeams = false;
    this.specByLeaderboard = false;
  }

  onServerInit(gameServer: GameServer){
    // Called when the server starts
    gameServer.run = true;
  }

  onTick(gameServer: GameServer) {
      // Called on every game tick 
  }

  onChange(gameServer: GameServer) {
      // Called when someone changes the gamemode via console commands
  }

  onPlayerInit(player: PlayerTracker) {
      // Called after a player object is constructed
  }

  onPlayerSpawn(gameServer: GameServer, player: PlayerTracker) {
      // Called when a player is spawned
      player.color = gameServer.getRandomColor(); // Random color
      gameServer.spawnPlayer(player, null, null);
  }

  pressQ(gameServer: GameServer, player: PlayerTracker) {
      // Called when the Q key is pressed
      if (player.spectate) {
          gameServer.switchSpectator(player);
      }
  }

  pressW(gameServer: GameServer, player: PlayerTracker) {
      // Called when the W key is pressed
      gameServer.ejectMass(player);
  }

  pressSpace(gameServer: GameServer, player: PlayerTracker) {
      // Called when the Space bar is pressed
      gameServer.splitCells(player);
  }

  onCellAdd(cell: PlayerTracker) {
      // Called when a player cell is added
  }

  onCellRemove(cell: PlayerTracker) {
      // Called when a player cell is removed
  }

  onCellMove(x1: number, y1: number, cell: PlayerTracker) {
    // Called when a player cell is moved
  }

  updateLB(gameServer: GameServer) {
      // Called when the leaderboard update function is called
  }
}
