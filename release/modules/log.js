'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _util = require('util');

var util = _interopRequireWildcard(_util);

var _os = require('os');

var Log = (function () {
    function Log() {
        _classCallCheck(this, Log);
    }

    _createClass(Log, [{
        key: 'setup',
        value: function setup(gameServer) {
            if (!fs.existsSync('./logs')) {
                fs.mkdir('./logs');
            }
            switch (gameServer.config.serverLogLevel) {
                case 2:
                    var ip_log = fs.createWriteStream('./logs/ip.log', { flags: 'w' });
                    this.onConnect = function (ip) {
                        ip_log.write("[" + this.formatTime() + "] Connect: " + ip + _os.EOL);
                    };
                    this.onDisconnect = function (ip) {
                        ip_log.write("[" + this.formatTime() + "] Disconnect: " + ip + _os.EOL);
                    };
                case 1:
                    var console_log = fs.createWriteStream('./logs/console.log', { flags: 'w' });
                    console.log = function (d) {
                        console_log.write(util.format(d) + _os.EOL);
                        process.stdout.write(util.format(d) + _os.EOL);
                    };
                    this.onCommand = function (command) {
                        console_log.write(">" + command + _os.EOL);
                    };
                case 0:
                    process.on('uncaughtException', function (err) {
                        console.log(err.stack);
                    });
                default:
                    break;
            }
        }
    }, {
        key: 'onConnect',
        value: function onConnect(ip) {}
    }, {
        key: 'onDisconnect',
        value: function onDisconnect(ip) {}
    }, {
        key: 'onCommand',
        value: function onCommand(command) {}
    }, {
        key: 'formatTime',
        value: function formatTime() {
            var date = new Date();
            var strTime;
            var hour = date.getHours();
            strTime = (hour < 10 ? "0" : "") + hour;
            var min = date.getMinutes();
            strTime += ":" + (min < 10 ? "0" : "") + min;
            return strTime;
        }
    }]);

    return Log;
})();

exports['default'] = Log;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvbG9nLnRzIl0sIm5hbWVzIjpbIkxvZyIsIkxvZy5jb25zdHJ1Y3RvciIsIkxvZy5zZXR1cCIsIkxvZy5vbkNvbm5lY3QiLCJMb2cub25EaXNjb25uZWN0IiwiTG9nLm9uQ29tbWFuZCIsIkxvZy5mb3JtYXRUaW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7a0JBQ29CLElBQUk7O0lBQVosRUFBRTs7b0JBQ1EsTUFBTTs7SUFBaEIsSUFBSTs7a0JBQ0UsSUFBSTs7SUFFdEIsR0FBQTtBQUNFQSxhQURGLEdBQUEsR0FDRUE7OEJBREYsR0FBQTtLQUdHQzs7aUJBSEgsR0FBQTs7ZUFLT0QsZUFBQ0EsVUFBVUEsRUFBQUE7QUFDZEUsZ0JBQUlBLENBQUNBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBO0FBRTVCQSxrQkFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7YUFDcEJBO0FBRURBLG9CQUFRQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQTtBQUN0Q0EscUJBQUtBLENBQUNBO0FBQ0pBLHdCQUFJQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQSxpQkFBaUJBLENBQUNBLGVBQWVBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUdBLEdBQUdBLEVBQUNBLENBQUNBLENBQUNBO0FBR2xFQSx3QkFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsVUFBU0EsRUFBRUEsRUFBQUE7QUFDMUIsOEJBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBQyxhQUFhLEdBQUcsRUFBRSxVQUFNLENBQUMsQ0FBQztxQkFDOUQsQ0FBQ0E7QUFFRkEsd0JBQUlBLENBQUNBLFlBQVlBLEdBQUdBLFVBQVNBLEVBQUVBLEVBQUFBO0FBQzdCLDhCQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUMsZ0JBQWdCLEdBQUcsRUFBRSxVQUFNLENBQUMsQ0FBQztxQkFDakUsQ0FBQ0E7QUFBQUEsQUFDSkEscUJBQUtBLENBQUNBO0FBQ0pBLHdCQUFJQSxXQUFXQSxHQUFHQSxFQUFFQSxDQUFDQSxpQkFBaUJBLENBQUNBLG9CQUFvQkEsRUFBRUEsRUFBQ0EsS0FBS0EsRUFBR0EsR0FBR0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFNUVBLDJCQUFPQSxDQUFDQSxHQUFHQSxHQUFHQSxVQUFTQSxDQUFDQSxFQUFBQTtBQUN0QixtQ0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsQ0FBQztBQUN4QywrQkFBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLENBQUM7cUJBQzVDLENBQUNBO0FBR0ZBLHdCQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxVQUFTQSxPQUFPQSxFQUFBQTtBQUMvQixtQ0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxVQUFNLENBQUMsQ0FBQztxQkFDeEMsQ0FBQ0E7QUFBQUEsQUFDSkEscUJBQUtBLENBQUNBO0FBRUpBLDJCQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxtQkFBbUJBLEVBQUVBLFVBQVNBLEdBQUdBLEVBQUFBO0FBQzFDLCtCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDeEIsQ0FBQ0EsQ0FBQ0E7QUFBQUEsQUFDTEE7QUFDRUEsMEJBQU1BO0FBQUFBLGFBQ1RBO1NBQ0ZBOzs7ZUFFUUYsbUJBQUNBLEVBQUVBLEVBQUFBLEVBRVhHOzs7ZUFFV0gsc0JBQUNBLEVBQUVBLEVBQUFBLEVBRWRJOzs7ZUFFUUosbUJBQUNBLE9BQU9BLEVBQUFBLEVBRWhCSzs7O2VBRVNMLHNCQUFBQTtBQUNSTSxnQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsRUFBRUEsQ0FBQ0E7QUFDdEJBLGdCQUFJQSxPQUFnQkEsQ0FBQ0E7QUFFckJBLGdCQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtBQUMzQkEsbUJBQU9BLEdBQUdBLENBQUNBLElBQUlBLEdBQUdBLEVBQUVBLEdBQUdBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUFBLEdBQUlBLElBQUlBLENBQUNBO0FBRXhDQSxnQkFBSUEsR0FBR0EsR0FBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7QUFDN0JBLG1CQUFPQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxHQUFHQSxFQUFFQSxHQUFHQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFBQSxBQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtBQUU3Q0EsbUJBQU9BLE9BQU9BLENBQUNBO1NBQ2hCQTs7O1dBcEVILEdBQUE7OztxQkFBQSxHQUFBIiwiZmlsZSI6Im1vZHVsZXMvbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICd1dGlsJztcbmltcG9ydCB7RU9MfSBmcm9tICdvcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ3tcbiAgY29uc3RydWN0b3IoKXtcbiAgICAvLyBlbXB0eVxuICB9XG5cbiAgc2V0dXAoZ2FtZVNlcnZlcikge1xuICAgIGlmICghZnMuZXhpc3RzU3luYygnLi9sb2dzJykpIHtcbiAgICAgIC8vIE1ha2UgbG9nIGZvbGRlclxuICAgICAgZnMubWtkaXIoJy4vbG9ncycpO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZ2FtZVNlcnZlci5jb25maWcuc2VydmVyTG9nTGV2ZWwpIHtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgdmFyIGlwX2xvZyA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKCcuL2xvZ3MvaXAubG9nJywge2ZsYWdzIDogJ3cnfSk7XG5cbiAgICAgICAgLy8gT3ZlcnJpZGVcbiAgICAgICAgdGhpcy5vbkNvbm5lY3QgPSBmdW5jdGlvbihpcCkge1xuICAgICAgICAgIGlwX2xvZy53cml0ZShcIltcIit0aGlzLmZvcm1hdFRpbWUoKStcIl0gQ29ubmVjdDogXCIgKyBpcCArIEVPTCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QgPSBmdW5jdGlvbihpcCkge1xuICAgICAgICAgIGlwX2xvZy53cml0ZShcIltcIit0aGlzLmZvcm1hdFRpbWUoKStcIl0gRGlzY29ubmVjdDogXCIgKyBpcCArIEVPTCk7XG4gICAgICAgIH07XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBjb25zb2xlX2xvZyA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKCcuL2xvZ3MvY29uc29sZS5sb2cnLCB7ZmxhZ3MgOiAndyd9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyA9IGZ1bmN0aW9uKGQpIHsgLy9cbiAgICAgICAgICBjb25zb2xlX2xvZy53cml0ZSh1dGlsLmZvcm1hdChkKSArIEVPTCk7XG4gICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUodXRpbC5mb3JtYXQoZCkgKyBFT0wpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMub25Db21tYW5kID0gZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgICAgIGNvbnNvbGVfbG9nLndyaXRlKFwiPlwiICsgY29tbWFuZCArIEVPTCk7XG4gICAgICAgIH07XG4gICAgICBjYXNlIDA6XG4gICAgICAgIC8vIFByZXZlbnQgY3Jhc2hlc1xuICAgICAgICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG4gICAgICAgIH0pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Db25uZWN0KGlwKSB7XG4gICAgLy8gTm90aGluZ1xuICB9XG5cbiAgb25EaXNjb25uZWN0KGlwKSB7XG4gICAgLy8gTm90aGluZ1xuICB9XG5cbiAgb25Db21tYW5kKGNvbW1hbmQpIHtcbiAgICAvLyBOb3RoaW5nXG4gIH1cblxuICBmb3JtYXRUaW1lKCkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgc3RyVGltZSA6IHN0cmluZztcblxuICAgIHZhciBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xuICAgIHN0clRpbWUgPSAoaG91ciA8IDEwID8gXCIwXCIgOiBcIlwiKSArIGhvdXI7XG5cbiAgICB2YXIgbWluICA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgIHN0clRpbWUgKz0gXCI6XCIgKyAobWluIDwgMTAgPyBcIjBcIiA6IFwiXCIpICsgbWluO1xuXG4gICAgcmV0dXJuIHN0clRpbWU7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==