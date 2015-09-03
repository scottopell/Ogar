'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _BotPlayer = require('./BotPlayer');

var _BotPlayer2 = _interopRequireDefault(_BotPlayer);

var _FakeSocket = require('./FakeSocket');

var _FakeSocket2 = _interopRequireDefault(_FakeSocket);

var _PacketHandler = require('../PacketHandler');

var _PacketHandler2 = _interopRequireDefault(_PacketHandler);

var BotLoader = (function () {
    function BotLoader(gameServer) {
        _classCallCheck(this, BotLoader);

        this.gameServer = gameServer;
        this.loadNames();
    }

    _createClass(BotLoader, [{
        key: 'getName',
        value: function getName() {
            var name = "";
            if (this.randomNames.length > 0) {
                var index = Math.floor(Math.random() * this.randomNames.length);
                name = this.randomNames[index];
                this.randomNames.splice(index, 1);
            } else {
                name = "bot" + ++this.nameIndex;
            }
            return name;
        }
    }, {
        key: 'loadNames',
        value: function loadNames() {
            this.randomNames = [];
            try {
                var fs = require("fs");
                this.randomNames = fs.readFileSync("./botnames.txt", "utf8").split(/[\r\n]+/).filter(function (x) {
                    return x != '';
                });
            } catch (e) {}
            this.nameIndex = 0;
        }
    }, {
        key: 'addBot',
        value: function addBot() {
            var s = new _FakeSocket2['default'](this.gameServer);
            s.playerTracker = new _BotPlayer2['default'](this.gameServer, s);
            s.packetHandler = new _PacketHandler2['default'](this.gameServer, s);
            this.gameServer.clients.push(s);
            s.packetHandler.setNickname(this.getName());
        }
    }]);

    return BotLoader;
})();

exports['default'] = BotLoader;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFpL0JvdExvYWRlci50cyJdLCJuYW1lcyI6WyJCb3RMb2FkZXIiLCJCb3RMb2FkZXIuY29uc3RydWN0b3IiLCJCb3RMb2FkZXIuZ2V0TmFtZSIsIkJvdExvYWRlci5sb2FkTmFtZXMiLCJCb3RMb2FkZXIuYWRkQm90Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7eUJBQ3NCLGFBQWE7Ozs7MEJBQ1osY0FBYzs7Ozs2QkFDWCxrQkFBa0I7Ozs7SUFHNUMsU0FBQTtBQUtFQSxhQUxGLFNBQUEsQ0FLY0EsVUFBc0JBLEVBQUFBOzhCQUxwQyxTQUFBOztBQU1JQyxZQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtBQUM3QkEsWUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7S0FDbEJBOztpQkFSSCxTQUFBOztlQVdTRCxtQkFBQUE7QUFDTEUsZ0JBQUlBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO0FBR2RBLGdCQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxFQUFFQTtBQUMvQkEsb0JBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0FBQ2hFQSxvQkFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7QUFDL0JBLG9CQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxFQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTthQUNsQ0EsTUFBTUE7QUFDTEEsb0JBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO2FBQ2pDQTtBQUVEQSxtQkFBT0EsSUFBSUEsQ0FBQ0E7U0FDYkE7OztlQUVRRixxQkFBQUE7QUFDUEcsZ0JBQUlBLENBQUNBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBO0FBR3RCQSxnQkFBSUE7QUFDRkEsb0JBQUlBLEVBQUVBLEdBQUdBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBR3ZCQSxvQkFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFTQSxDQUFDQSxFQUFBQTtBQUM3RiwyQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNoQixDQUFDQSxDQUFDQTthQUNIQSxDQUFBQSxPQUFPQSxDQUFDQSxFQUFFQSxFQUVYQTtBQUVEQSxnQkFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7U0FDcEJBOzs7ZUFFS0gsa0JBQUFBO0FBQ0pJLGdCQUFJQSxDQUFDQSxHQUFHQSw0QkFBZUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7QUFDeENBLGFBQUNBLENBQUNBLGFBQWFBLEdBQUdBLDJCQUFjQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUNwREEsYUFBQ0EsQ0FBQ0EsYUFBYUEsR0FBR0EsK0JBQWtCQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUd4REEsZ0JBQUlBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBR2hDQSxhQUFDQSxDQUFDQSxhQUFhQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxDQUFDQTtTQUM3Q0E7OztXQXRESCxTQUFBOzs7cUJBQUEsU0FBQSIsImZpbGUiOiJhaS9Cb3RMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQcm9qZWN0IGltcG9ydHNcbmltcG9ydCBCb3RQbGF5ZXIgZnJvbSAnLi9Cb3RQbGF5ZXInO1xuaW1wb3J0IEZha2VTb2NrZXQgZnJvbSAnLi9GYWtlU29ja2V0JztcbmltcG9ydCBQYWNrZXRIYW5kbGVyIGZyb20gJy4uL1BhY2tldEhhbmRsZXInO1xuaW1wb3J0IEdhbWVTZXJ2ZXIgZnJvbSAnLi4vR2FtZVNlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdExvYWRlciB7XG4gIGdhbWVTZXJ2ZXI6IEdhbWVTZXJ2ZXI7XG4gIHJhbmRvbU5hbWVzOiBzdHJpbmdbXTtcbiAgbmFtZUluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZ2FtZVNlcnZlcjogR2FtZVNlcnZlcil7XG4gICAgdGhpcy5nYW1lU2VydmVyID0gZ2FtZVNlcnZlcjtcbiAgICB0aGlzLmxvYWROYW1lcygpO1xuICB9XG5cblxuICBnZXROYW1lKCkge1xuICAgIHZhciBuYW1lID0gXCJcIjtcblxuICAgIC8vIFBpY2tzIGEgcmFuZG9tIG5hbWUgZm9yIHRoZSBib3RcbiAgICBpZiAodGhpcy5yYW5kb21OYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnJhbmRvbU5hbWVzLmxlbmd0aCk7XG4gICAgICBuYW1lID0gdGhpcy5yYW5kb21OYW1lc1tpbmRleF07XG4gICAgICB0aGlzLnJhbmRvbU5hbWVzLnNwbGljZShpbmRleCwxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IFwiYm90XCIgKyArK3RoaXMubmFtZUluZGV4O1xuICAgIH1cblxuICAgIHJldHVybiBuYW1lO1xuICB9O1xuXG4gIGxvYWROYW1lcygpIHtcbiAgICB0aGlzLnJhbmRvbU5hbWVzID0gW107XG5cbiAgICAvLyBMb2FkIG5hbWVzXG4gICAgdHJ5IHtcbiAgICAgIHZhciBmcyA9IHJlcXVpcmUoXCJmc1wiKTsgLy8gSW1wb3J0IHRoZSB1dGlsIGxpYnJhcnlcblxuICAgICAgLy8gUmVhZCBhbmQgcGFyc2UgdGhlIG5hbWVzIC0gZmlsdGVyIG91dCB3aGl0ZXNwYWNlLW9ubHkgbmFtZXNcbiAgICAgIHRoaXMucmFuZG9tTmFtZXMgPSBmcy5yZWFkRmlsZVN5bmMoXCIuL2JvdG5hbWVzLnR4dFwiLCBcInV0ZjhcIikuc3BsaXQoL1tcXHJcXG5dKy8pLmZpbHRlcihmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB4ICE9ICcnOyAvLyBmaWx0ZXIgZW1wdHkgbmFtZXNcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIE5vdGhpbmcsIHVzZSB0aGUgZGVmYXVsdCBuYW1lc1xuICAgIH1cblxuICAgIHRoaXMubmFtZUluZGV4ID0gMDtcbiAgfTtcblxuICBhZGRCb3QoKSB7XG4gICAgdmFyIHMgPSBuZXcgRmFrZVNvY2tldCh0aGlzLmdhbWVTZXJ2ZXIpO1xuICAgIHMucGxheWVyVHJhY2tlciA9IG5ldyBCb3RQbGF5ZXIodGhpcy5nYW1lU2VydmVyLCBzKTtcbiAgICBzLnBhY2tldEhhbmRsZXIgPSBuZXcgUGFja2V0SGFuZGxlcih0aGlzLmdhbWVTZXJ2ZXIsIHMpO1xuXG4gICAgLy8gQWRkIHRvIGNsaWVudCBsaXN0XG4gICAgdGhpcy5nYW1lU2VydmVyLmNsaWVudHMucHVzaChzKTtcblxuICAgIC8vIEFkZCB0byB3b3JsZFxuICAgIHMucGFja2V0SGFuZGxlci5zZXROaWNrbmFtZSh0aGlzLmdldE5hbWUoKSk7XG4gIH07XG5cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9