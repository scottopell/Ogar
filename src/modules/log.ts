/// <reference path="../../typings/tsd.d.ts" />
import * as fs from 'fs';
import * as util from 'util';
import {EOL} from 'os';

export default class Log{
  constructor(){
    // empty
  }

  setup(gameServer) {
    if (!fs.existsSync('./logs')) {
      // Make log folder
      fs.mkdir('./logs');
    }

    switch (gameServer.config.serverLogLevel) {
      case 2:
        var ip_log = fs.createWriteStream('./logs/ip.log', {flags : 'w'});

        // Override
        this.onConnect = function(ip) {
          ip_log.write("["+this.formatTime()+"] Connect: " + ip + EOL);
        };

        this.onDisconnect = function(ip) {
          ip_log.write("["+this.formatTime()+"] Disconnect: " + ip + EOL);
        };
      case 1:
        var console_log = fs.createWriteStream('./logs/console.log', {flags : 'w'});

        console.log = function(d) { //
          console_log.write(util.format(d) + EOL);
          process.stdout.write(util.format(d) + EOL);
        };

        //
        this.onCommand = function(command) {
          console_log.write(">" + command + EOL);
        };
      case 0:
        // Prevent crashes
        process.on('uncaughtException', function(err) {
          console.log(err.stack);
        });
      default:
        break;
    }
  }

  onConnect(ip) {
    // Nothing
  }

  onDisconnect(ip) {
    // Nothing
  }

  onCommand(command) {
    // Nothing
  }

  formatTime() {
    var date = new Date();
    var strTime : string;

    var hour = date.getHours();
    strTime = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    strTime += ":" + (min < 10 ? "0" : "") + min;

    return strTime;
  }
}
