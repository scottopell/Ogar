import Mode from './Mode';
import PlayerTracker from '../PlayerTracker'
import {Color} from '../HelperDefs/index';

export default class Teams extends Mode{
  colorFuzziness: number;
  colors: Color[];
  teamAmount: number;
  nodes: any[];

  constructor(){
    super();

    this.ID = 1;
    this.name = "Teams";
    this.decayMod = 1.5;
    this.packetLB = 50;
    this.haveTeams = true;
    this.colorFuzziness = 32;

    // Special
    // Amount of teams. Having more than 3 teams will cause the leaderboard to work incorrectly (client issue).
    this.teamAmount = 3;
    // Make sure you add extra colors here if you wish to increase the team amount [Default colors are: Red, Green, Blue]
    this.colors = [
      {'r': 223, 'g': 0, 'b': 0},
      {'r': 0, 'g': 223, 'b': 0},
      {'r': 0, 'g': 0, 'b': 223},
    ];
    this.nodes = []; // Teams
  }

  //Gamemode Specific Functions

  fuzzColorComponent(component) {
    component += Math.random() * this.colorFuzziness >> 0;
    return component;
  }

  getTeamColor(team) {
    var color = this.colors[team];
    return {
      r: this.fuzzColorComponent(color.r),
      b: this.fuzzColorComponent(color.b),
      g: this.fuzzColorComponent(color.g)
    };
  }

  // Override

  onPlayerSpawn(gameServer,player) {
    // Random color based on team
    player.color = this.getTeamColor(player.team);
    // Spawn player
    gameServer.spawnPlayer(player);
  }

  onServerInit(gameServer) {
    // Set up teams
    for (var i = 0; i < this.teamAmount; i++) {
      this.nodes[i] = [];
    }

    // migrate current players to team mode
    for (var i = 0; i < gameServer.clients.length; i++) {
      var client = gameServer.clients[i].playerTracker;
      this.onPlayerInit(client);
      client.color = this.getTeamColor(client.team);
      for (var j = 0; j < client.cells.length; j++) {
        var cell = client.cells[j];
        cell.setColor(client.color);
        this.nodes[client.team].push(cell);
      }
    }
  }

  onPlayerInit(player) {
    // Get random team
    player.team = Math.floor(Math.random() * this.teamAmount);
  }

  onCellAdd(cell) {
    // Add to team list
    this.nodes[cell.owner.getTeam()].push(cell);
  }

  onCellRemove(cell) {
    // Remove from team list
    var index = this.nodes[cell.owner.getTeam()].indexOf(cell);
    if (index != -1) {
      this.nodes[cell.owner.getTeam()].splice(index, 1);
    }
  }

  onCellMove(x1,y1,cell) {
    var team = cell.owner.getTeam();
    var r = cell.getSize();

    // Find team
    for (var i = 0; i < cell.owner.visibleNodes.length;i++) {
      // Only collide with player cells
      var check = cell.owner.visibleNodes[i];

      if ((check.getType() != 0) || (cell.owner == check.owner)){
        continue;
      }

      // Collision with teammates
      if (check.owner.getTeam() == team) {
        // Check if in collision range
        var collisionDist = check.getSize() + r; // Minimum distance between the 2 cells
        if (!cell.simpleCollide(x1,y1,check, collisionDist)) {
          // Skip
          continue;
        }

        // First collision check passed... now more precise checking
        var dist = cell.getDist(cell.position.x,cell.position.y,check.position.x,check.position.y);

        // Calculations
        if (dist < collisionDist) { // Collided
          // The moving cell pushes the colliding cell
          var newDeltaY = check.position.y - y1;
          var newDeltaX = check.position.x - x1;
          var newAngle = Math.atan2(newDeltaX,newDeltaY);

          var move = collisionDist - dist;

          check.position.x = check.position.x + ( move * Math.sin(newAngle) ) >> 0;
          check.position.y = check.position.y + ( move * Math.cos(newAngle) ) >> 0;
        }
      }
    }
  }

  updateLB(gameServer) {
    var total = 0;
    var teamMass = [];
    // Get mass
    for (var i = 0; i < this.teamAmount; i++) {
      // Set starting mass
      teamMass[i] = 0;

      // Loop through cells
      for (var j = 0; j < this.nodes[i].length;j++) {
        var cell = this.nodes[i][j];

        if (!cell) {
          continue;
        }

        teamMass[i] += cell.mass;
        total += cell.mass;
      }
    }
    // Calc percentage
    for (var i = 0; i < this.teamAmount; i++) {
      // No players
      if (total <= 0) {
        continue;
      }

      gameServer.leaderboard[i] = teamMass[i]/total;
    }
  }

}
