// Imports
import {get as getGameMode} from '../gamemodes/index';
import {Food, Virus} from '../entity/index';

// Utils
var fillChar = function (data, charr, fieldLength, rTL) {
  var result = data.toString();
  if (rTL === true) {
    for (var i = result.length; i < fieldLength; i++){
      result = charr.concat(result);
    }
  } else {
    for (var i = result.length; i < fieldLength; i++){
      result = result.concat(charr);
    }
  }
  return result;
};

// Commands
export default function help(gameServer,split) {
  console.log("[Console] ======================== HELP ======================");
  console.log("[Console] addbot     : add bot to the server");
  console.log("[Console] board      : set scoreboard text");
  console.log("[Console] boardreset : reset scoreboard text");
  console.log("[Console] change     : change specified settings");
  console.log("[Console] clear      : clear console output");
  console.log("[Console] color      : set cell(s) color by client ID");
  console.log("[Console] exit       : stop the server");
  console.log("[Console] food       : spawn food at specified Location");
  console.log("[Console] gamemode   : change server gamemode");
  console.log("[Console] kick       : kick player or bot by client ID");
  console.log("[Console] kill       : kill cell(s) by client ID");
  console.log("[Console] killall    : kill everyone");
  console.log("[Console] mass       : set cell(s) mass by client ID");
  console.log("[Console] name       : change cell(s) name by client ID");
  console.log("[Console] playerlist : get list of players and bots");
  console.log("[Console] pause      : pause game , freeze all cells");
  console.log("[Console] reload     : reload config");
  console.log("[Console] status     : get server status");
  console.log("[Console] tp         : teleport player to specified location");
  console.log("[Console] virus      : spawn virus at a specified Location");
  console.log("[Console] ====================================================");
}

export function addbot(gameServer,split) {
  var add = parseInt(split[1]);
  if (isNaN(add)) {
    add = 1; // Adds 1 bot if user doesnt specify a number
  }

  for (var i = 0; i < add; i++) {
    gameServer.bots.addBot();
  }
  console.log("[Console] Added "+add+" player bots");
}
export function board(gameServer,split) {
  var newLB = [];
  for (var i = 1; i < split.length; i++) {
    newLB[i - 1] = split[i];
  }

  // Clears the update leaderboard function and replaces it with our own
  gameServer.gameMode.packetLB = 48;
  gameServer.gameMode.specByLeaderboard = false;
  gameServer.gameMode.updateLB = function(gameServer) {gameServer.leaderboard = newLB};
  console.log("[Console] Successfully changed leaderboard values");
}
export function boardreset(gameServer) {
  // Gets the current gamemode
  var gm = getGameMode(gameServer.gameMode.ID);

  // Replace functions
  gameServer.gameMode.packetLB = gm.packetLB;
  gameServer.gameMode.updateLB = gm.updateLB;
  console.log("[Console] Successfully reset leaderboard");
}
export function change(gameServer,split) {
  var key = split[1];
  var value = split[2];

  // Check if int/float
  if (value.indexOf('.') != -1) {
    value = parseFloat(value);
  } else {
    value = parseInt(value);
  }

  if (typeof gameServer.config[key] != 'undefined') {
    gameServer.config[key] = value;
    console.log("[Console] Set " + key + " to " + value);
  } else {
    console.log("[Console] Invalid config value");
  }
}
export function clear() {
  process.stdout.write("\u001b[2J\u001b[0;0H");
}
export function color(gameServer,split) {
  // Validation checks
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  var color = {r: 0, g: 0, b: 0};
  color.r = Math.max(Math.min(parseInt(split[2]), 255), 0);
  color.g = Math.max(Math.min(parseInt(split[3]), 255), 0);
  color.b = Math.max(Math.min(parseInt(split[4]), 255), 0);

  // Sets color to the specified amount
  for (var i in gameServer.clients) {
    if (gameServer.clients[i].playerTracker.pID == id) {
      var client = gameServer.clients[i].playerTracker;
      client.setColor(color); // Set color
      for (var j in client.cells) {
        client.cells[j].setColor(color);
      }
      break;
    }
  }
}
export function exit(gameServer,split) {
  console.log("[Console] Closing server...");
  gameServer.socketServer.close();
  process.exit(1);
}
export function food(gameServer,split) {
  var pos = {x: parseInt(split[1]), y: parseInt(split[2])};
  var mass = parseInt(split[3]);

  // Make sure the input values are numbers
  if (isNaN(pos.x) || isNaN(pos.y)) {
    console.log("[Console] Invalid coordinates");
    return;
  }

  if (isNaN(mass)) {
    mass = gameServer.config.foodStartMass;
  }

  // Spawn
  var f = new Food(gameServer.getNextNodeId(), null, pos, mass, null);
  f.setColor(gameServer.getRandomColor());
  gameServer.addNode(f);
  gameServer.currentFood++;
  console.log("[Console] Spawned 1 food cell at ("+pos.x+" , "+pos.y+")");
}
export function gamemode(gameServer,split) {
  try {
    var n = parseInt(split[1]);
    var gm = getGameMode(n); // If there is an invalid gamemode, the function will exit
    gameServer.gameMode.onChange(gameServer); // Reverts the changes of the old gamemode
    gameServer.gameMode = gm; // Apply new gamemode
    gameServer.gameMode.onServerInit(gameServer); // Resets the server
    console.log("[Game] Changed game mode to " + gameServer.gameMode.name);
  } catch (e) {
    console.log("[Console] Invalid game mode selected");
  }
}
export function kick(gameServer,split) {
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  for (var i in gameServer.clients) {
    if (gameServer.clients[i].playerTracker.pID == id) {
      var client = gameServer.clients[i].playerTracker;
      var len = client.cells.length;
      for (var j = 0; j < len; j++) {
        gameServer.removeNode(client.cells[0]);
      }
      client.socket.close();
      console.log("[Console] Kicked " + client.name);
      break;
    }
  }
}
export function kill(gameServer,split) {
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  var count = 0;
  for (var i in gameServer.clients) {
    if (gameServer.clients[i].playerTracker.pID == id) {
      var client = gameServer.clients[i].playerTracker;
      var len = client.cells.length;
      for (var j = 0; j < len; j++) {
        gameServer.removeNode(client.cells[0]);
        count++;
      }

      console.log("[Console] Removed " + count + " cells");
      break;
    }
  }
}
export function killall(gameServer,split) {
  var count = 0;
  var len = gameServer.nodesPlayer.length;
  for (var i = 0; i < len; i++) {
    gameServer.removeNode(gameServer.nodesPlayer[0]);
    count++;
  }
  console.log("[Console] Removed " + count + " cells");
}
export function mass(gameServer,split) {
  // Validation checks
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  var amount = Math.max(parseInt(split[2]),9);
  if (isNaN(amount)) {
    console.log("[Console] Please specify a valid number");
    return;
  }

  // Sets mass to the specified amount
  for (var i in gameServer.clients) {
    if (gameServer.clients[i].playerTracker.pID == id) {
      var client = gameServer.clients[i].playerTracker;
      for (var j in client.cells) {
        client.cells[j].mass = amount;
      }

      console.log("[Console] Set mass of "+client.name+" to "+amount);
      break;
    }
  }
}
export function name(gameServer,split) {
  // Validation checks
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  var name = split.slice(2, split.length).join(' ');
  if (typeof name == 'undefined') {
    console.log("[Console] Please type a valid name");
    return;
  }

  // Change name
  for (var i = 0; i < gameServer.clients.length; i++) {
    var client = gameServer.clients[i].playerTracker;

    if (client.pID == id) {
      console.log("[Console] Changing "+client.name+" to "+name);
      client.name = name;
      return;
    }
  }

  // Error
  console.log("[Console] Player "+id+" was not found");
}
export function playerlist(gameServer,split) {
  console.log("[Console] Showing " + gameServer.clients.length + " players: ");
  console.log(" ID         | IP              | "+fillChar('NICK', ' ', gameServer.config.playerMaxNickLength, false)+" | CELLS | SCORE  | POSITION    "); // Fill space
  console.log(fillChar('', '-', ' ID         | IP              |  | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, false));
  for (var i = 0; i < gameServer.clients.length; i++) {
    var client = gameServer.clients[i].playerTracker;

    // ID with 3 digits length
    var id = fillChar((client.pID), ' ', 10, true);

    // Get ip (15 digits length)
    var ip = "BOT";
    if (typeof gameServer.clients[i].remoteAddress != 'undefined' ) {
      ip = gameServer.clients[i].remoteAddress;
    }
    ip = fillChar(ip, ' ', 15, false);

    // Get name and data
    var nick = '', cells = '', score = '', position = '', data = '';
    if (client.spectate) {
      try {
        // Get spectated player
        if (gameServer.getMode().specByLeaderboard) { // Get spec type
          nick = gameServer.leaderboard[client.spectatedPlayer].name;
        } else {
          nick = gameServer.clients[client.spectatedPlayer].playerTracker.name;
        }
      } catch (e) {
        // Specating nobody
        nick = "";
      }
      nick = (nick == "") ? "An unnamed cell" : nick;
      data = fillChar("SPECTATING: " + nick, '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
      console.log(" " + id + " | " + ip + " | " + data);
    } else if (client.cells.length > 0) {
      nick = fillChar((client.name == "") ? "An unnamed cell" : client.name, ' ', gameServer.config.playerMaxNickLength, false);
      cells = fillChar(client.cells.length, ' ', 5, true);
      score = fillChar(client.getScore(true), ' ', 6, true);
      position = fillChar(client.centerPos.x >> 0, ' ', 5, true) + ', ' + fillChar(client.centerPos.y >> 0, ' ', 5, true);
      console.log(" "+id+" | "+ip+" | "+nick+" | "+cells+" | "+score+" | "+position);
    } else {
      // No cells = dead player or in-menu
      data = fillChar('DEAD OR NOT PLAYING', '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
      console.log(" " + id + " | " + ip + " | " + data);
    }
  }
}
export function pause(gameServer,split) {
  gameServer.run = !gameServer.run; // Switches the pause state
  var s = gameServer.run ? "Unpaused" : "Paused";
  console.log("[Console] " + s + " the game.");
}
export function reload(gameServer) {
  gameServer.loadConfig();
  console.log("[Console] Reloaded the config file successfully");
}
export function status(gameServer,split) {
  // Get amount of humans/bots
  var humans = 0, bots = 0;
  for (var i = 0; i < gameServer.clients.length; i++) {
    if ('_socket' in gameServer.clients[i]) {
      humans++;
    } else {
      bots++;
    }
  }
  //
  console.log("[Console] Connected players: "+gameServer.clients.length+"/"+gameServer.config.serverMaxConnections);
  console.log("[Console] Players: "+humans+" Bots: "+bots);
  console.log("[Console] Server has been running for "+process.uptime()+" seconds.");
  console.log("[Console] Current memory usage: "+process.memoryUsage().heapUsed/1000+"/"+process.memoryUsage().heapTotal/1000+" kb");
  console.log("[Console] Current game mode: "+gameServer.gameMode.name);
}
export function tp(gameServer,split) {
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  // Make sure the input values are numbers
  var pos = {x: parseInt(split[2]), y: parseInt(split[3])};
  if (isNaN(pos.x) || isNaN(pos.y)) {
    console.log("[Console] Invalid coordinates");
    return;
  }

  // Spawn
  for (var i in gameServer.clients) {
    if (gameServer.clients[i].playerTracker.pID == id) {
      var client = gameServer.clients[i].playerTracker;
      for (var j in client.cells) {
        client.cells[j].position.x = pos.x;
        client.cells[j].position.y = pos.y;
      }

      console.log("[Console] Teleported "+client.name+" to ("+pos.x+" , "+pos.y+")");
      break;
    }
  }
}
export function virus(gameServer,split) {
  var pos = {x: parseInt(split[1]), y: parseInt(split[2])};
  var mass = parseInt(split[3]);

  // Make sure the input values are numbers
  if (isNaN(pos.x) || isNaN(pos.y)) {
    console.log("[Console] Invalid coordinates");
    return;
  } if (isNaN(mass)) {
    mass = gameServer.config.virusStartMass;
  }

  // Spawn
  var v = new Virus(gameServer.getNextNodeId(), null, pos, mass, null);
  gameServer.addNode(v);
  console.log("[Console] Spawned 1 virus at ("+pos.x+" , "+pos.y+")");
}
