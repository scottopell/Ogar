'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _modulesCommandList = require('./modules/CommandList');

var Commands = _interopRequireWildcard(_modulesCommandList);

var _GameServer = require('./GameServer');

var _GameServer2 = _interopRequireDefault(_GameServer);

var _readline = require('readline');

var Readline = _interopRequireWildcard(_readline);

var showConsole = true;
console.log("[Game] Ogar - An open source Agar.io server implementation");
process.argv.forEach(function (val) {
    if (val == "--noconsole") {
        showConsole = false;
    } else if (val == "--help") {
        console.log("Proper Usage: node index.js");
        console.log("    --noconsole         Disables the console");
        console.log("    --help              Help menu.");
        console.log("");
    }
});
var gameServer = new _GameServer2['default']();
gameServer.start();
gameServer.commands = Commands;
if (showConsole) {
    var input = Readline.createInterface({ input: process.stdin, output: process.stdout });
    setTimeout(showPrompt, 100);
}
function showPrompt() {
    input.question(">", function (str) {
        parseCommands(str);
        return showPrompt();
    });
}
;
function parseCommands(str) {
    gameServer.log.onCommand(str);
    if (str === '') return;
    var split = str.split(" ");
    var first = split[0].toLowerCase();
    var execute = gameServer.commands[first];
    if (execute !== undefined) {
        execute(gameServer, split);
    } else {
        console.log("[Console] Invalid Command!");
    }
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbInNob3dQcm9tcHQiLCJwYXJzZUNvbW1hbmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7a0NBRTBCLHVCQUF1Qjs7SUFBckMsUUFBUTs7MEJBQ0csY0FBYzs7Ozt3QkFDWCxVQUFVOztJQUF4QixRQUFROztBQUdwQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFHdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0FBRzFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBRyxFQUFBO0FBQy9CLFFBQUksR0FBRyxJQUFJLGFBQWEsRUFBRTtBQUN4QixtQkFBVyxHQUFHLEtBQUssQ0FBQztLQUNyQixNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtBQUMxQixlQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0MsZUFBTyxDQUFDLEdBQUcsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQzVELGVBQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUNsRCxlQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2pCO0NBQ0YsQ0FBQyxDQUFDO0FBR0gsSUFBSSxVQUFVLEdBQUcsNkJBQWdCLENBQUM7QUFDbEMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBRW5CLFVBQVUsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBRS9CLElBQUksV0FBVyxFQUFFO0FBQ2YsUUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FDaEMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUMvQyxDQUFDO0FBQ04sY0FBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztDQUM3QjtBQUtELFNBQUEsVUFBQSxHQUFBO0FBQ0VBLFNBQUtBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEVBQUVBLFVBQVNBLEdBQUdBLEVBQUFBO0FBQzlCLHFCQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsZUFBTyxVQUFVLEVBQUUsQ0FBQztLQUNyQixDQUFDQSxDQUFDQTtDQUNKQTtBQUFBLENBQUM7QUFFRixTQUFBLGFBQUEsQ0FBdUIsR0FBVyxFQUFBO0FBRWhDQyxjQUFVQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUc5QkEsUUFBSUEsR0FBR0EsS0FBS0EsRUFBRUEsRUFDWkEsT0FBT0E7QUFHVEEsUUFBSUEsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFHM0JBLFFBQUlBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO0FBR25DQSxRQUFJQSxPQUFPQSxHQUFHQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtBQUN6Q0EsUUFBSUEsT0FBT0EsS0FBS0EsU0FBU0EsRUFBRUE7QUFDekJBLGVBQU9BLENBQUNBLFVBQVVBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO0tBQzVCQSxNQUFNQTtBQUNMQSxlQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSw0QkFBNEJBLENBQUNBLENBQUNBO0tBQzNDQTtDQUNGQTtBQUFBLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vLyBJbXBvcnRzXG5pbXBvcnQgKiBhcyBDb21tYW5kcyBmcm9tICcuL21vZHVsZXMvQ29tbWFuZExpc3QnO1xuaW1wb3J0IEdhbWVTZXJ2ZXIgZnJvbSAnLi9HYW1lU2VydmVyJztcbmltcG9ydCAqIGFzIFJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcblxuLy8gSW5pdCB2YXJpYWJsZXNcbnZhciBzaG93Q29uc29sZSA9IHRydWU7XG5cbi8vIFN0YXJ0IG1zZ1xuY29uc29sZS5sb2coXCJbR2FtZV0gT2dhciAtIEFuIG9wZW4gc291cmNlIEFnYXIuaW8gc2VydmVyIGltcGxlbWVudGF0aW9uXCIpO1xuXG4vLyBIYW5kbGUgYXJndW1lbnRzXG5wcm9jZXNzLmFyZ3YuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcbiAgaWYgKHZhbCA9PSBcIi0tbm9jb25zb2xlXCIpIHtcbiAgICBzaG93Q29uc29sZSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKHZhbCA9PSBcIi0taGVscFwiKSB7XG4gICAgY29uc29sZS5sb2coXCJQcm9wZXIgVXNhZ2U6IG5vZGUgaW5kZXguanNcIik7XG4gICAgY29uc29sZS5sb2coXCIgICAgLS1ub2NvbnNvbGUgICAgICAgICBEaXNhYmxlcyB0aGUgY29uc29sZVwiKTtcbiAgICBjb25zb2xlLmxvZyhcIiAgICAtLWhlbHAgICAgICAgICAgICAgIEhlbHAgbWVudS5cIik7XG4gICAgY29uc29sZS5sb2coXCJcIik7XG4gIH1cbn0pO1xuXG4vLyBSdW4gT2dhclxudmFyIGdhbWVTZXJ2ZXIgPSBuZXcgR2FtZVNlcnZlcigpO1xuZ2FtZVNlcnZlci5zdGFydCgpO1xuLy8gQWRkIGNvbW1hbmQgaGFuZGxlclxuZ2FtZVNlcnZlci5jb21tYW5kcyA9IENvbW1hbmRzO1xuLy8gSW5pdGlhbGl6ZSB0aGUgc2VydmVyIGNvbnNvbGVcbmlmIChzaG93Q29uc29sZSkge1xuICB2YXIgaW5wdXQgPSBSZWFkbGluZS5jcmVhdGVJbnRlcmZhY2UoXG4gICAgICB7IGlucHV0OiBwcm9jZXNzLnN0ZGluLCBvdXRwdXQ6IHByb2Nlc3Muc3Rkb3V0IH1cbiAgICAgICk7XG4gIHNldFRpbWVvdXQoc2hvd1Byb21wdCwgMTAwKTtcbn1cblxuXG4vLyBDb25zb2xlIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBzaG93UHJvbXB0KCkge1xuICBpbnB1dC5xdWVzdGlvbihcIj5cIiwgZnVuY3Rpb24oc3RyKSB7XG4gICAgcGFyc2VDb21tYW5kcyhzdHIpO1xuICAgIHJldHVybiBzaG93UHJvbXB0KCk7IC8vIFRvbyBsYXp5IHRvIGxlYXJuIGFzeW5jXG4gIH0pO1xufTtcblxuZnVuY3Rpb24gcGFyc2VDb21tYW5kcyhzdHI6IHN0cmluZykge1xuICAvLyBMb2cgdGhlIHN0cmluZ1xuICBnYW1lU2VydmVyLmxvZy5vbkNvbW1hbmQoc3RyKTtcblxuICAvLyBEb24ndCBwcm9jZXNzIEVOVEVSXG4gIGlmIChzdHIgPT09ICcnKVxuICAgIHJldHVybjtcblxuICAvLyBTcGxpdHMgdGhlIHN0cmluZ1xuICB2YXIgc3BsaXQgPSBzdHIuc3BsaXQoXCIgXCIpO1xuXG4gIC8vIFByb2Nlc3MgdGhlIGZpcnN0IHN0cmluZyB2YWx1ZVxuICB2YXIgZmlyc3QgPSBzcGxpdFswXS50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEdldCBjb21tYW5kIGZ1bmN0aW9uXG4gIHZhciBleGVjdXRlID0gZ2FtZVNlcnZlci5jb21tYW5kc1tmaXJzdF07XG4gIGlmIChleGVjdXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICBleGVjdXRlKGdhbWVTZXJ2ZXIsIHNwbGl0KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcIltDb25zb2xlXSBJbnZhbGlkIENvbW1hbmQhXCIpO1xuICB9XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9