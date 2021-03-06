/// <reference path="../typings/tsd.d.ts" />
// Library imports
import * as WebSocket from 'ws';
import * as http from 'http';
import * as fs  from 'fs';

import * as ini from './modules/ini';

// Project imports
import * as Packet from './packet/index';
import * as Gamemode from './gamemodes/index';

import {Cell, PlayerCell, Food, Virus, EjectedMass}  from './entity/index';
import PlayerTracker from './PlayerTracker';
import PacketHandler from './PacketHandler';
import Mode from './gamemodes/Mode';
import BotLoader from './ai/BotLoader';
import Logger from './modules/log';
import Config from './config';

// GameServer implementation
export default class GameServer {
  // Startup
  run: boolean;
  lastNodeId: number;
  lastPlayerId: number;
  clients: any[];
  nodes: any[];
  // Virus nodes
  nodesVirus: Virus[];
  // Ejected mass nodes
  nodesEjected: Cell[];
  // Nodes controlled by players
  nodesPlayer: PlayerCell[];

  currentFood: number;
  movingNodes: any[];
  leaderboard: any[];
  lb_packet: ArrayBuffer;
  bots: BotLoader;
  log: Logger;
  commands: any;
  time: number;
  startTime: number;
  // 1 second ticks of mainLoop
  tick: number;
  // 50 ms ticks, 20 of these = 1 leaderboard update
  tickMain: number;
  // Used with spawning food
  tickSpawn: number;

  gameMode: Mode;
  config: Config;
  colors: any[];

  socketServer: WebSocket.Server;

  stats: any;
  httpServer: any; // should be httpServer

  constructor(){

    this.run = true;
    this.lastNodeId = 1;
    this.lastPlayerId = 1;
    this.clients = [];
    this.nodes = [];
    this.nodesVirus = [];
    this.nodesEjected = [];
    this.nodesPlayer = [];

    this.currentFood = 0;
    this.movingNodes = []; // For move engine
    this.leaderboard = [];
    this.lb_packet = new ArrayBuffer(0); // Leaderboard packet

    this.bots = new BotLoader(this);
    this.log = new Logger();
    this.commands; // Command handler

    // Main loop tick
    this.time = +new Date;
    this.startTime = this.time;
    this.tick = 0; // 1 second ticks of mainLoop
    this.tickMain = 0; // 50 ms ticks, 20 of these = 1 leaderboard update
    this.tickSpawn = 0; // Used with spawning food

    // Config
    this.config = new Config();

    // Parse config
    this.loadConfig();

    // Gamemodes
    this.gameMode = Gamemode.get(this.config.serverGamemode);

    // Colors
    this.colors = [
      {'r':235, 'g': 75, 'b':  0},
      {'r':225, 'g':125, 'b':255},
      {'r':180, 'g':  7, 'b': 20},
      {'r': 80, 'g':170, 'b':240},
      {'r':180, 'g': 90, 'b':135},
      {'r':195, 'g':240, 'b':  0},
      {'r':150, 'g': 18, 'b':255},
      {'r': 80, 'g':245, 'b':  0},
      {'r':165, 'g': 25, 'b':  0},
      {'r': 80, 'g':145, 'b':  0},
      {'r': 80, 'g':170, 'b':240},
      {'r': 55, 'g': 92, 'b':255},
    ];
  }


  start() {
    // Logging
    this.log.setup(this);

    // Gamemode configurations
    this.gameMode.onServerInit(this);

    var serverCallback = function(){
      // Spawn starting food
      this.startingFood();

      // Start Main Loop
      setInterval(this.mainLoop.bind(this), 1);

      // Done
      console.log("[Game] Listening on port " + this.config.serverPort);
      console.log("[Game] Current game mode is " + this.gameMode.name);

      // Player bots (Experimental)
      if (this.config.serverBots > 0) {
        for (var i = 0;i < this.config.serverBots;i++) {
          this.bots.addBot();
        }
        console.log("[Game] Loaded "+this.config.serverBots+" player bots");
      }
    }

    // Start the server
    this.socketServer = new WebSocket.Server(
        { port: this.config.serverPort, perMessageDeflate: false},
        serverCallback.bind(this)
    );

    this.socketServer.on('connection', connectionEstablished.bind(this));

    // Properly handle errors because some people are too lazy to read the readme
    this.socketServer.on('error', function err(e) {
      switch (e.name) {
        case "EADDRINUSE":
          console.log("[Error] EADDRINUSE. Server could not bind to port!");
          break;
        case "EACCES":
          console.log("[Error] EACCES. Tips:\nUse ports above 1000");
          break;
        default:
          console.log(`[Error] Unhandled error code: ${e.name}`);
          break;
      }
      process.exit(1); // Exits the program
    });

    function connectionEstablished(ws) {
      // Server full
      if (this.clients.length >= this.config.serverMaxConnections) {
        ws.close();
        return;
      }

      // ----- Client authenticity check code -----
      // !!!!! WARNING !!!!!
      // THE BELOW SECTION OF CODE CHECKS TO ENSURE THAT CONNECTIONS ARE COMING
      // FROM THE OFFICIAL AGAR.IO CLIENT. IF YOU REMOVE OR MODIFY THE BELOW
      // SECTION OF CODE TO ALLOW CONNECTIONS FROM A CLIENT ON A DIFFERENT DOMAIN,
      // YOU MAY BE COMMITTING COPYRIGHT INFRINGEMENT AND LEGAL ACTION MAY BE TAKEN
      // AGAINST YOU. THIS SECTION OF CODE WAS ADDED ON JULY 9, 2015 AT THE REQUEST
      // OF THE AGAR.IO DEVELOPERS.
      var origin = ws.upgradeReq.headers.origin;
      if (origin != 'http://agar.io' && origin != 'https://agar.io'
          && origin != 'http://localhost' && origin != 'https://localhost'
          && origin != 'http://127.0.0.1' && origin != 'https://127.0.0.1') {
        ws.close();
      return;
    }
    // -----/Client authenticity check code -----

    function close(error) {
      // Log disconnections
      this.server.log.onDisconnect(this.socket.remoteAddress);

      var client = this.socket.playerTracker;
      var len = this.socket.playerTracker.cells.length;
      for (var i = 0; i < len; i++) {
        var cell = this.socket.playerTracker.cells[i];

        if (!cell) {
          continue;
        }

        // Clear function so that the cell cant move
        cell.calcMove = function() {return;};
        //this.server.removeNode(cell);
      }

      client.disconnect = this.server.config.playerDisconnectTime * 20;
      // Clear function so no packets are sent
      this.socket.sendPacket = function() {return;};
    }

    ws.remoteAddress = ws._socket.remoteAddress;
    ws.remotePort = ws._socket.remotePort;
    this.log.onConnect(ws.remoteAddress); // Log connections

    ws.playerTracker = new PlayerTracker(this, ws);
    ws.packetHandler = new PacketHandler(this, ws);
    ws.on('message', ws.packetHandler.handleMessage.bind(ws.packetHandler));

    var bindObject = { server: this, socket: ws };
    ws.on('error', close.bind(bindObject));
    ws.on('close', close.bind(bindObject));
    this.clients.push(ws);
    }

    this.startStatsServer(this.config.serverStatsPort);
  }

  getMode() {
    return this.gameMode;
  }

  getNextNodeId() {
    // Resets integer
    // TODO
    if (this.lastNodeId > 2147483647) {
      this.lastNodeId = 1;
    }
    return this.lastNodeId++;
  }

  getNewPlayerID() {
    // Resets integer
    // TODO
    if (this.lastPlayerId > 2147483647) {
      this.lastPlayerId = 1;
    }
    return this.lastPlayerId++;
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * (this.config.borderRight - this.config.borderLeft)) + this.config.borderLeft,
      y: Math.floor(Math.random() * (this.config.borderBottom - this.config.borderTop)) + this.config.borderTop
    };
  }

  getRandomSpawn() {
    // Random spawns for players
    var pos;

    if (this.currentFood > 0) {
      // Spawn from food
      var node;
      for (var i = (this.nodes.length - 1); i > -1; i--) {
        // Find random food
        node = this.nodes[i];

        if (!node || node.inRange) {
          // Skip if food is about to be eaten/undefined
          continue;
        }

        if (node.getType() == 1) {
          pos = {x: node.position.x,y: node.position.y};
          this.removeNode(node);
          break;
        }
      }
    }

    if (!pos) {
      // Get random spawn if no food cell is found
      pos = this.getRandomPosition();
    }

    return pos;
  }

  getRandomColor() {
    var index = Math.floor(Math.random() * this.colors.length);
    var color = this.colors[index];
    return {
      r: color.r,
      b: color.b,
      g: color.g
    };
  }

  addNode(node) {
    this.nodes.push(node);

    // Adds to the owning player's screen
    if (node.owner) {
      node.setColor(node.owner.color);
      node.owner.cells.push(node);
      node.owner.socket.sendPacket(new Packet.AddNode(node));
    }

    // Special on-add actions
    node.onAdd(this);

    // Add to visible nodes
    for (var i = 0; i < this.clients.length;i++) {
      var client = this.clients[i].playerTracker;
      if (!client) {
        continue;
      }

      // client.nodeAdditionQueue is only used by human players, not bots
      // for bots it just gets collected forever, using ever-increasing amounts of memory
      if ('_socket' in client.socket && node.visibleCheck(client.viewBox,client.centerPos)) {
        client.nodeAdditionQueue.push(node);
      }
    }
  }

  removeNode(node) {
    // Remove from main nodes list
    var index = this.nodes.indexOf(node);
    if (index != -1) {
      this.nodes.splice(index, 1);
    }

    // Remove from moving cells list
    index = this.movingNodes.indexOf(node);
    if (index != -1) {
      this.movingNodes.splice(index, 1);
    }

    // Special on-remove actions
    node.onRemove(this);

    // Animation when eating
    for (var i = 0; i < this.clients.length;i++) {
      var client = this.clients[i].playerTracker;
      if (!client) {
        continue;
      }

      // Remove from client
      client.nodeDestroyQueue.push(node);
    }
  }

  cellTick() {
    // Move cells
    this.updateMoveEngine();
  }

  spawnTick() {
    // Spawn food
    this.tickSpawn++;
    if (this.tickSpawn >= this.config.spawnInterval) {
      this.updateFood(); // Spawn food
      this.virusCheck(); // Spawn viruses

      this.tickSpawn = 0; // Reset
    }
  }

  gamemodeTick() {
    // Gamemode tick
    this.gameMode.onTick(this);
  }

  cellUpdateTick() {
    // Update cells
    this.updateCells();
  }


  mainLoop() {
    // Timer
    var local = new Date();
    // TODO
    this.tick += (+local - this.time);
    this.time = +local;

    if (this.tick >= 50) {
      // Loop main functions
      if (this.run) {
        setTimeout(this.cellTick(), 0);
        setTimeout(this.spawnTick(), 0);
        setTimeout(this.gamemodeTick(), 0);
      }

      // Update the client's maps
      this.updateClients();

      // Update cells/leaderboard loop
      this.tickMain++;
      if (this.tickMain >= 20) { // 1 Second
        setTimeout(this.cellUpdateTick(), 0);

        // Update leaderboard with the gamemode's method
        this.leaderboard = [];
        this.gameMode.updateLB(this);
        var lbPack = new Packet.UpdateLeaderboard(
            this.leaderboard,
            this.gameMode.packetLB);

        this.lb_packet = lbPack.build();

        this.tickMain = 0; // Reset
      }

      // Debug
      //console.log(this.tick - 50);

      // Reset
      this.tick = 0;
    }
  }


  updateClients() {
    for (var i = 0; i < this.clients.length; i++) {
      if (typeof this.clients[i] == "undefined") {
        continue;
      }

      this.clients[i].playerTracker.update();
    }
  }

  startingFood() {
    // Spawns the starting amount of food cells
    for (var i = 0; i < this.config.foodStartAmount; i++) {
      this.spawnFood();
    }
  }

  updateFood() {
    var toSpawn = Math.min(this.config.foodSpawnAmount,(this.config.foodMaxAmount-this.currentFood));
    for (var i = 0; i < toSpawn; i++) {
      this.spawnFood();
    }
  }

  spawnFood() {
    var f = new Food(this.getNextNodeId(), null, this.getRandomPosition(), this.config.foodMass, null);
    f.setColor(this.getRandomColor());

    this.addNode(f);
    this.currentFood++;
  }

  spawnPlayer(player,pos,mass) {
    // Get random pos
    if (pos == null) {
      pos = this.getRandomSpawn();
    }
    // Get starting mass
    if (mass == null) {
      mass = this.config.playerStartMass;
    }

    // Spawn player and add to world
    var cell = new PlayerCell(this.getNextNodeId(), player, pos, mass, null);
    this.addNode(cell);

    // Set initial mouse coords
    player.mouse = {x: pos.x, y: pos.y};
  }

  virusCheck() {
    // Checks if there are enough viruses on the map
    if (this.nodesVirus.length < this.config.virusMinAmount) {
      // Spawns a virus
      var pos = this.getRandomPosition();
      var virusSquareSize = (this.config.virusStartMass * 100) >> 0;

      // Check for players
      for (var i = 0; i < this.nodesPlayer.length; i++) {
        var check = this.nodesPlayer[i];

        if (check.mass < this.config.virusStartMass) {
          continue;
        }

        var squareR = check.getSquareSize(); // squared Radius of checking player cell

        var dx = check.position.x - pos.x;
        var dy = check.position.y - pos.y;

        if (dx * dx + dy * dy + virusSquareSize <= squareR)
          return; // Collided
      }

      // Spawn if no cells are colliding
      var v = new Virus(this.getNextNodeId(), null, pos, this.config.virusStartMass, null);
      this.addNode(v);
    }
  }

  updateMoveEngine() {
    // Move player cells
    var len = this.nodesPlayer.length;
    for (var i = 0; i < len; i++) {
      var cell = this.nodesPlayer[i];

      // Do not move cells that have already been eaten or have collision turned off
      if (!cell){
        continue;
      }

      var client = cell.owner;

      cell.calcMove(client.mouse.x, client.mouse.y, this);

      // Check if cells nearby
      var list = this.getCellsInRange(cell);
      for (var j = 0; j < list.length ; j++) {
        var check = list[j];

        // if we're deleting from this.nodesPlayer, fix outer loop variables
        // we need to update its length, and maybe 'i' too
        if (check.cellType == 0) {
          len--;
          if (check.nodeId < cell.nodeId) {
            i--;
          }
        }

        // Consume effect
        check.onConsume(cell,this);

        // Remove cell
        check.setKiller(cell);
        this.removeNode(check);
      }
    }

    // A system to move cells not controlled by players (ex. viruses, ejected mass)
    len = this.movingNodes.length;
    for (var i = 0; i < len; i++) {
      var check = this.movingNodes[i];

      // Recycle unused nodes
      while ((typeof check == "undefined") && (i < this.movingNodes.length)) {
        // Remove moving cells that are undefined
        this.movingNodes.splice(i, 1);
        check = this.movingNodes[i];
      }

      if (i >= this.movingNodes.length) {
        continue;
      }

      if (check.moveEngineTicks > 0) {
        check.onAutoMove(this);
        // If the cell has enough move ticks, then move it
        check.calcMovePhys(this.config);
      } else {
        // Auto move is done
        check.moveDone(this);
        // Remove cell from list
        var index = this.movingNodes.indexOf(check);
        if (index != -1) {
          this.movingNodes.splice(index, 1);
        }
      }
    }
  }

  setAsMovingNode(node) {
    this.movingNodes.push(node);
  }

  splitCells(client: PlayerTracker) {
    var len = client.cells.length;
    for (var i = 0; i < len; i++) {
      if (client.cells.length >= this.config.playerMaxCells) {
        // Player cell limit
        continue;
      }

      var cell = client.cells[i];
      if (!cell) {
        continue;
      }

      if (cell.mass < this.config.playerMinMassSplit) {
        continue;
      }

      // Get angle
      var deltaY = client.mouse.y - cell.position.y;
      var deltaX = client.mouse.x - cell.position.x;
      var angle = Math.atan2(deltaX,deltaY);

      // Get starting position
      var size = cell.getSize()/2;
      var startPos = {
        x: cell.position.x + ( size * Math.sin(angle) ),
        y: cell.position.y + ( size * Math.cos(angle) )
      };
      // Calculate mass and speed of splitting cell
      var splitSpeed = cell.getSpeed() * 6;
      var newMass = cell.mass / 2;
      cell.mass = newMass;
      // Create cell
      var split = new PlayerCell(this.getNextNodeId(), client, startPos, newMass, null);
      split.setAngle(angle);
      split.setMoveEngineData(splitSpeed, 32, 0.85);
      split.calcMergeTime(this.config.playerRecombineTime);

      // Add to moving cells list
      this.setAsMovingNode(split);
      this.addNode(split);
    }
  }

  ejectMass(client) {
    for (var i = 0; i < client.cells.length; i++) {
      var cell = client.cells[i];

      if (!cell) {
        continue;
      }

      if (cell.mass < this.config.playerMinMassEject) {
        continue;
      }

      var deltaY = client.mouse.y - cell.position.y;
      var deltaX = client.mouse.x - cell.position.x;
      var angle = Math.atan2(deltaX,deltaY);

      // Get starting position
      var size = cell.getSize() + 5;
      var startPos = {
      x: cell.position.x + ( (size + this.config.ejectMass) * Math.sin(angle) ),
      y: cell.position.y + ( (size + this.config.ejectMass) * Math.cos(angle) )
      };

      // Remove mass from parent cell
      cell.mass -= this.config.ejectMassLoss;
      // Randomize angle
      angle += (Math.random() * .4) - .2;

      // Create cell
      var ejected = new EjectedMass(this.getNextNodeId(), null, startPos, this.config.ejectMass, null);
      ejected.setAngle(angle);
      ejected.setMoveEngineData(this.config.ejectSpeed, 20, null);
      ejected.setColor(cell.getColor());

      this.addNode(ejected);
      this.setAsMovingNode(ejected);
    }
  }

  newCellVirused(client, parent, angle, mass, speed) {
    // Starting position
    var startPos = {
      x: parent.position.x,
      y: parent.position.y
    };

    // Create cell
    var newCell = new PlayerCell(this.getNextNodeId(), client, startPos, mass, null);
    newCell.setAngle(angle);
    newCell.setMoveEngineData(speed, 15, null);
    newCell.calcMergeTime(this.config.playerRecombineTime);
    newCell.ignoreCollision = true; // Remove collision checks

    // Add to moving cells list
    this.addNode(newCell);
    this.setAsMovingNode(newCell);
  }

  shootVirus(parent) {
    var parentPos = {
    x: parent.position.x,
    y: parent.position.y,
    };

    var newVirus = new Virus(this.getNextNodeId(), null, parentPos, this.config.virusStartMass, null);
    newVirus.setAngle(parent.getAngle());
    newVirus.setMoveEngineData(200, 20, null);

    // Add to moving cells list
    this.addNode(newVirus);
    this.setAsMovingNode(newVirus);
  }

  getCellsInRange(cell) {
    var list = new Array();
    var squareR = cell.getSquareSize(); // Get cell squared radius

    // Loop through all cells that are visible to the cell. There is probably a more efficient way of doing this but whatever
    var len = cell.owner.visibleNodes.length;
    for (var i = 0;i < len;i++) {
      var check = cell.owner.visibleNodes[i];

      if (typeof check === 'undefined') {
        continue;
      }

      // if something already collided with this cell, don't check for other collisions
      if (check.inRange) {
        continue;
      }

      // Can't eat itself
      if (cell.nodeId == check.nodeId) {
        continue;
      }

      // Can't eat cells that have collision turned off
      if ((cell.owner == check.owner) && (cell.ignoreCollision)) {
        continue;
      }

      // AABB Collision
      if (!check.collisionCheck2(squareR, cell.position)) {
        continue;
      }

      // Cell type check - Cell must be bigger than this number times the mass of the cell being eaten
      var multiplier = 1.25;

      switch (check.getType()) {
        case 1: // Food cell
          list.push(check);
          check.inRange = true; // skip future collision checks for this food
          continue;
        case 2: // Virus
          multiplier = 1.33;
          break;
        case 0: // Players
          // Can't eat self if it's not time to recombine yet
          if (check.owner == cell.owner) {
            if ((cell.recombineTicks > 0) || (check.recombineTicks > 0)) {
              continue;
            }

            multiplier = 1.00;
          }

          // Can't eat team members
          if (this.gameMode.haveTeams) {
            if (!check.owner) { // Error check
              continue;
            }

            if ((check.owner != cell.owner)
                && (check.owner.getTeam() == cell.owner.getTeam())) {
              continue;
            }
          }
          break;
        default:
          break;
      }

      // Make sure the cell is big enough to be eaten.
      if ((check.mass * multiplier) > cell.mass) {
        continue;
      }

      // Eating range
      var xs = Math.pow(check.position.x - cell.position.x, 2);
      var ys = Math.pow(check.position.y - cell.position.y, 2);
      var dist = Math.sqrt( xs + ys );

      // Eating range = radius of eating cell + 40% of the radius of the cell being eaten
      var eatingRange = cell.getSize() - check.getEatingRange();
      if (dist > eatingRange) {
        // Not in eating range
        continue;
      }

      // Add to list of cells nearby
      list.push(check);

      // Something is about to eat this cell; no need to check for other collisions with it
      check.inRange = true;
    }
    return list;
  }

  getNearestVirus(cell) {
    // More like getNearbyVirus
    var virus = null;
    var r = 100; // Checking radius

    var topY = cell.position.y - r;
    var bottomY = cell.position.y + r;

    var leftX = cell.position.x - r;
    var rightX = cell.position.x + r;

    // Loop through all viruses on the map. There is probably a more efficient way of doing this but whatever
    var len = this.nodesVirus.length;
    for (var i = 0;i < len;i++) {
      var check = this.nodesVirus[i];

      if (typeof check === 'undefined') {
        continue;
      }

      if (!check.collisionCheck(bottomY,topY,rightX,leftX)) {
        continue;
      }

      // Add to list of cells nearby
      virus = check;
      break; // stop checking when a virus found
    }
    return virus;
  }

  updateCells() {
    if (!this.run) {
      // Server is paused
      return;
    }

    // Loop through all player cells
    var massDecay = 1 - (this.config.playerMassDecayRate * this.gameMode.decayMod);
    for (var i = 0; i < this.nodesPlayer.length; i++) {
      var cell = this.nodesPlayer[i];

      if (!cell) {
        continue;
      }

      if (cell.recombineTicks > 0) {
        // Recombining
        cell.recombineTicks--;
      }

      // Mass decay
      if (cell.mass >= this.config.playerMinMassDecay) {
        cell.mass *= massDecay;
      }
    }
  }

  loadConfig() {
    try {
      // Load the contents of the config file
      var load = ini.parse(fs.readFileSync('./gameserver.ini', 'utf-8'));

      // Replace all the default config's values with the loaded config's values
      for (var obj in load) {
        this.config[obj] = load[obj];
      }
    } catch (err) {
      // No config
      console.log("[Game] Config not found... Generating new config");

      // Create a new config
      fs.writeFileSync('./gameserver.ini', ini.stringify(this.config, null));
    }
  }

  switchSpectator(player) {
    if (this.gameMode.specByLeaderboard) {
      player.spectatedPlayer++;
      if (player.spectatedPlayer == this.leaderboard.length) {
        player.spectatedPlayer = 0;
      }
    } else {
      // Find next non-spectator with cells in the client list
      var oldPlayer = player.spectatedPlayer + 1;
      var count = 0;
      while (player.spectatedPlayer != oldPlayer && count != this.clients.length) {
        if (oldPlayer == this.clients.length) {
          oldPlayer = 0;
          continue;
        }

        if (!this.clients[oldPlayer]) {
          // Break out of loop in case client tries to spectate an undefined player
          player.spectatedPlayer = -1;
          break;
        }

        if (this.clients[oldPlayer].playerTracker.cells.length > 0) {
          break;
        }

        oldPlayer++;
        count++;
      }
      if (count == this.clients.length) {
        player.spectatedPlayer = -1;
      } else {
        player.spectatedPlayer = oldPlayer;
      }
    }
  }

  // Stats server

  startStatsServer(port) {
    // Do not start the server if the port is negative
    if (port < 1) {
      return;
    }

    // Create stats
    this.stats = "Test";
    this.getStats();

    // Show stats
    this.httpServer = http.createServer(function(req, res) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.writeHead(200);
      res.end(this.stats);
    }.bind(this));

    this.httpServer.listen(port, function() {
      // Stats server
      console.log("[Game] Loaded stats server on port " + port);
      setInterval(this.getStats.bind(this), this.config.serverStatsUpdate * 1000);
    }.bind(this));
  }

  getStats() {
    var players = 0;
    this.clients.forEach(function(client) {
      if (client.playerTracker && client.playerTracker.cells.length > 0)
        players++
    });
    var s = {
      'current_players': this.clients.length,
      'alive': players,
      'spectators': this.clients.length - players,
      'max_players': this.config.serverMaxConnections,
      'gamemode': this.gameMode.name,
      'start_time': this.startTime
    }
    this.stats = JSON.stringify(s);
  }
}

// Custom prototype functions
// [] syntax to override typescript warning
WebSocket['sendPacket'] = function(packet) {
  function getBuf(data) {
    var array = new Uint8Array(data.buffer || data);
    var l = data.byteLength || data.length;
    var o = data.byteOffset || 0;
    var buffer = new Buffer(l);

    for (var i = 0; i < l; i++) {
      buffer[i] = array[o + i];
    }

    return buffer;
  }

  //if (this.readyState == WebSocket.OPEN && (this._socket.bufferSize == 0) && packet.build) {
  if (this.readyState == WebSocket.OPEN && packet.build) {
    var buf = packet.build();
    this.send(getBuf(buf), {binary: true});
  } else if (!packet.build) {
    // Do nothing
  } else {
    this.readyState = WebSocket.CLOSED;
    this.emit('close');
    this.removeAllListeners();
  }
}

