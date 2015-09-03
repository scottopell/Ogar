/// <reference path="../typings/tsd.d.ts" />
// Imports
import * as Commands from './modules/CommandList';
import GameServer from './GameServer';
import * as Readline from 'readline';

// Init variables
var showConsole = true;

// Start msg
console.log("[Game] Ogar - An open source Agar.io server implementation");

// Handle arguments
process.argv.forEach(function(val) {
  if (val == "--noconsole") {
    showConsole = false;
  } else if (val == "--help") {
    console.log("Proper Usage: node index.js");
    console.log("    --noconsole         Disables the console");
    console.log("    --help              Help menu.");
    console.log("");
  }
});

// Run Ogar
var gameServer = new GameServer();
gameServer.start();
// Add command handler
gameServer.commands = Commands;
// Initialize the server console
if (showConsole) {
  var input = Readline.createInterface(
      { input: process.stdin, output: process.stdout }
      );
  setTimeout(showPrompt, 100);
}


// Console functions

function showPrompt() {
  input.question(">", function(str) {
    parseCommands(str);
    return showPrompt(); // Too lazy to learn async
  });
};

function parseCommands(str: string) {
  // Log the string
  gameServer.log.onCommand(str);

  // Don't process ENTER
  if (str === '')
    return;

  // Splits the string
  var split = str.split(" ");

  // Process the first string value
  var first = split[0].toLowerCase();

  // Get command function
  var execute = gameServer.commands[first];
  if (execute !== undefined) {
    execute(gameServer, split);
  } else {
    console.log("[Console] Invalid Command!");
  }
};
