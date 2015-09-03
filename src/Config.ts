export default class Config {
  // Maximum amount of connections to the server.
  serverMaxConnections: number;
  // Server port
  serverPort: number;
  // Gamemode, 0 = FFA, 1 = Teams
  serverGamemode = 0;
  // Amount of player bots to spawn
  serverBots: number;
  // Base view distance of players. Warning: high values may cause lag
  serverViewBaseX: number;
  serverViewBaseY: number;
  // Port for stats server. Having a negative number will disable the stats
  // server.
  serverStatsPort: number;
  // Amount of seconds per update for the server stats
  serverStatsUpdate: number;
  // Logging level of the server.
  // 0 = No logs
  // 1 = Logs the console
  // 2 = Logs console and ip connections
  serverLogLevel: number;
  // Left border of map (Vanilla value: 0)
  borderLeft: number;
  // Right border of map (Vanilla value: 11180.3398875)
  borderRight: number;
  // Top border of map (Vanilla value: 0)
  borderTop: number;
  // Bottom border of map (Vanilla value: 11180.3398875)
  borderBottom: number;
  // The interval between each food cell spawn in ticks (1 tick = 50 ms)
  spawnInterval: number;
  // The amount of food to spawn per interval
  foodSpawnAmount: number;
  // The starting amount of food in the map
  foodStartAmount: number;
  // Maximum food cells on the map
  foodMaxAmount: number;
  // Starting food size (In mass)
  foodMass: number;
  // Minimum amount of viruses on the map.
  virusMinAmount: number;
  // Maximum amount of viruses on the map.
  // If this amount is reached, then ejected cells will pass through viruses.
  virusMaxAmount: number;
  // Starting virus size (In mass)
  virusStartMass: number;
  // Amount of times you need to feed a virus to shoot it
  virusFeedAmount: number;
  // Mass of ejected cells
  ejectMass: number;
  // Mass lost when ejecting cells
  ejectMassLoss: number;
  // Base speed of ejected cells
  ejectSpeed: number;
  // Chance for a player to spawn from ejected mass
  ejectSpawnPlayer: number;
  // Starting mass of the player cell.
  playerStartMass: number;
  // Maximum mass a player can have
  playerMaxMass: number;
  // Mass required to eject a cell
  playerMinMassEject: number;
  // Mass required to split
  playerMinMassSplit: number;
  // Max cells the player is allowed to have
  playerMaxCells: number;
  // Base amount of seconds before a cell is allowed to recombine
  playerRecombineTime: number;
  // Amount of mass lost per second
  playerMassDecayRate: number;
  // Minimum mass for decay to occur
  playerMinMassDecay: number;
  // Maximum nick length
  playerMaxNickLength: number;
  // The amount of seconds it takes for a player cell to be removed after
  // disconnection (If set to -1, cells are never removed)
  playerDisconnectTime: number;
  // Maximum amount of participants for tournament style game modes
  tourneyMaxPlayers: number;
  // Amount of ticks to wait after all players are ready (1 tick = 1000 ms)
  tourneyPrepTime: number;
  // Amount of ticks to wait after a player wins (1 tick = 1000 ms)
  tourneyEndTime: number;
  // Time limit of the game, in minutes.
  tourneyTimeLimit: number;
  // If set to a value higher than 0, the tournament match will automatically
  // fill up with bots after this amount of seconds
  tourneyAutoFill: number;
  // The timer for filling the server with bots will not count down unless
  // there is this amount of real players
  tourneyAutoFillPlayers: number;

  constructor() {
    this.serverMaxConnections = 64;
    this.serverPort = 443;
    this.serverGamemode = 0;
    this.serverBots = 0;
    this.serverViewBaseX = 1024;
    this.serverViewBaseY = 592;
    this.serverStatsPort = 88;
    this.serverStatsUpdate = 60;
    this.serverLogLevel = 1;
    this.borderLeft = 0;
    this.borderRight = 6000;
    this.borderTop = 0;
    this.borderBottom = 6000;
    this.spawnInterval = 20;
    this.foodSpawnAmount = 10;
    this.foodStartAmount = 100;
    this.foodMaxAmount = 500;
    this.foodMass = 1;
    this.virusMinAmount = 10;
    this.virusMaxAmount = 50;
    this.virusStartMass = 100;
    this.virusFeedAmount = 7;
    this.ejectMass = 12;
    this.ejectMassLoss = 16;
    this.ejectSpeed = 160;
    this.ejectSpawnPlayer = 50;
    this.playerStartMass = 10;
    this.playerMaxMass = 22500;
    this.playerMinMassEject = 32;
    this.playerMinMassSplit = 36;
    this.playerMaxCells = 16;
    this.playerRecombineTime = 30;
    this.playerMassDecayRate = 0.02,
    this.playerMinMassDecay = 9;
    this.playerMaxNickLength = 15;
    this.playerDisconnectTime = 60;
    this.tourneyMaxPlayers = 12;
    this.tourneyPrepTime = 10;
    this.tourneyEndTime = 30;
    this.tourneyTimeLimit = 20;
    this.tourneyAutoFill = 0;
    this.tourneyAutoFillPlayers = 1;
  }
}
