'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Mode2 = require('./Mode');

var _Mode3 = _interopRequireDefault(_Mode2);

var FFA = (function (_Mode) {
    _inherits(FFA, _Mode);

    function FFA() {
        _classCallCheck(this, FFA);

        _get(Object.getPrototypeOf(FFA.prototype), 'constructor', this).call(this);
        this.ID = 0;
        this.name = "Free For All";
        this.specByLeaderboard = true;
    }

    _createClass(FFA, [{
        key: 'leaderboardAddSort',
        value: function leaderboardAddSort(player, leaderboard) {
            var len = leaderboard.length - 1;
            var loop = true;
            while (len >= 0 && loop) {
                if (player.getScore(false) <= leaderboard[len].getScore(false)) {
                    leaderboard.splice(len + 1, 0, player);
                    loop = false;
                }
                len--;
            }
            if (loop) {
                leaderboard.splice(0, 0, player);
            }
        }
    }, {
        key: 'onPlayerSpawn',
        value: function onPlayerSpawn(gameServer, player) {
            player.color = gameServer.getRandomColor();
            var pos, startMass;
            if (gameServer.nodesEjected.length > 0) {
                var index = Math.floor(Math.random() * 100) + 1;
                if (index <= gameServer.config.ejectSpawnPlayer) {
                    var index = Math.floor(Math.random() * gameServer.nodesEjected.length);
                    var e = gameServer.nodesEjected[index];
                    gameServer.removeNode(e);
                    pos = { x: e.position.x, y: e.position.y };
                    startMass = e.mass;
                    var color = e.getColor();
                    player.setColor({
                        'r': color.r,
                        'g': color.g,
                        'b': color.b
                    });
                }
            }
            gameServer.spawnPlayer(player, pos, startMass);
        }
    }, {
        key: 'updateLB',
        value: function updateLB(gameServer) {
            var lb = gameServer.leaderboard;
            for (var i = 0; i < gameServer.clients.length; i++) {
                if (typeof gameServer.clients[i] == "undefined") {
                    continue;
                }
                var player = gameServer.clients[i].playerTracker;
                var playerScore = player.getScore(true);
                if (player.cells.length <= 0) {
                    continue;
                }
                if (lb.length == 0) {
                    lb.push(player);
                    continue;
                } else if (lb.length < 10) {
                    this.leaderboardAddSort(player, lb);
                } else {
                    if (playerScore > lb[9].getScore(false)) {
                        lb.pop();
                        this.leaderboardAddSort(player, lb);
                    }
                }
            }
            this.rankOne = lb[0];
        }
    }]);

    return FFA;
})(_Mode3['default']);

exports['default'] = FFA;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9GRkEudHMiXSwibmFtZXMiOlsiRkZBIiwiRkZBLmNvbnN0cnVjdG9yIiwiRkZBLmxlYWRlcmJvYXJkQWRkU29ydCIsIkZGQS5vblBsYXllclNwYXduIiwiRkZBLnVwZGF0ZUxCIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0lBR3pCLEdBQUE7Y0FBQSxHQUFBOztBQUNFQSxhQURGLEdBQUEsR0FDRUE7OEJBREYsR0FBQTs7QUFFSUMsbUNBRkosR0FBQSw2Q0FFWUE7QUFDUkEsWUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDWkEsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsY0FBY0EsQ0FBQ0E7QUFDM0JBLFlBQUlBLENBQUNBLGlCQUFpQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7S0FDL0JBOztpQkFOSCxHQUFBOztlQVNvQkQsNEJBQUNBLE1BQXFCQSxFQUFFQSxXQUFXQSxFQUFBQTtBQUVuREUsZ0JBQUlBLEdBQUdBLEdBQUdBLFdBQVdBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO0FBQ2pDQSxnQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7QUFDaEJBLG1CQUFPQSxBQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFNQSxJQUFJQSxBQUFDQSxFQUFFQTtBQUUzQkEsb0JBQUlBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLEVBQUVBO0FBQzlEQSwrQkFBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7QUFDdkNBLHdCQUFJQSxHQUFHQSxLQUFLQSxDQUFDQTtpQkFDZEE7QUFDREEsbUJBQUdBLEVBQUVBLENBQUNBO2FBQ1BBO0FBQ0RBLGdCQUFJQSxJQUFJ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Q0E7QUFDaEJBLDZCQUFTQTtpQkFDVkEsTUFBTUEsSUFBSUEsRUFBRUEsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsRUFBRUE7QUFDekJBLHdCQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLE1BQU1BLEVBQUNBLEVBQUVBLENBQUNBLENBQUNBO2lCQUNwQ0EsTUFBTUE7QUFFTEEsd0JBQUlBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLEVBQUVBO0FBQ3ZDQSwwQkFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDVEEsNEJBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsTUFBTUEsRUFBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7cUJBQ3BDQTtpQkFDRkE7YUFDRkE7QUFFREEsZ0JBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1NBQ3RCQTs7O1dBOUZILEdBQUE7OztxQkFBQSxHQUFBIiwiZmlsZSI6ImdhbWVtb2Rlcy9GRkEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kZSBmcm9tICcuL01vZGUnO1xuaW1wb3J0IFBsYXllclRyYWNrZXIgZnJvbSAnLi4vUGxheWVyVHJhY2tlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRkZBIGV4dGVuZHMgTW9kZXtcbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuSUQgPSAwO1xuICAgIHRoaXMubmFtZSA9IFwiRnJlZSBGb3IgQWxsXCI7XG4gICAgdGhpcy5zcGVjQnlMZWFkZXJib2FyZCA9IHRydWU7XG4gIH1cblxuICAvLyBHYW1lbW9kZSBTcGVjaWZpYyBGdW5jdGlvbnNcbiAgbGVhZGVyYm9hcmRBZGRTb3J0KHBsYXllcjogUGxheWVyVHJhY2tlciwgbGVhZGVyYm9hcmQpIHtcbiAgICAvLyBBZGRzIHRoZSBwbGF5ZXIgYW5kIHNvcnRzIHRoZSBsZWFkZXJib2FyZFxuICAgIHZhciBsZW4gPSBsZWFkZXJib2FyZC5sZW5ndGggLSAxO1xuICAgIHZhciBsb29wID0gdHJ1ZTtcbiAgICB3aGlsZSAoKGxlbiA+PSAwKSAmJiAobG9vcCkpIHtcbiAgICAgIC8vIFN0YXJ0IGZyb20gdGhlIGJvdHRvbSBvZiB0aGUgbGVhZGVyYm9hcmRcbiAgICAgIGlmIChwbGF5ZXIuZ2V0U2NvcmUoZmFsc2UpIDw9IGxlYWRlcmJvYXJkW2xlbl0uZ2V0U2NvcmUoZmFsc2UpKSB7XG4gICAgICAgIGxlYWRlcmJvYXJkLnNwbGljZShsZW4gKyAxLCAwLCBwbGF5ZXIpO1xuICAgICAgICBsb29wID0gZmFsc2U7IC8vIEVuZCB0aGUgbG9vcCBpZiBhIHNwb3QgaXMgZm91bmRcbiAgICAgIH1cbiAgICAgIGxlbi0tO1xuICAgIH1cbiAgICBpZiAobG9vcCkge1xuICAgICAgLy8gQWRkIHRvIHRvcCBvZiB0aGUgbGlzdCBiZWNhdXNlIG5vIHNwb3RzIHdlcmUgZm91bmRcbiAgICAgIGxlYWRlcmJvYXJkLnNwbGljZSgwLCAwLCBwbGF5ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlXG5cbiAgb25QbGF5ZXJTcGF3bihnYW1lU2VydmVyLHBsYXllcikge1xuICAgIC8vIFJhbmRvbSBjb2xvclxuICAgIHBsYXllci5jb2xvciA9IGdhbWVTZXJ2ZXIuZ2V0UmFuZG9tQ29sb3IoKTtcblxuICAgIC8vIFNldCB1cCB2YXJpYWJsZXNcbiAgICB2YXIgcG9zLCBzdGFydE1hc3M7XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgZWplY3RlZCBtYXNzIGluIHRoZSB3b3JsZC5cbiAgICBpZiAoZ2FtZVNlcnZlci5ub2Rlc0VqZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDE7XG4gICAgICBpZiAoaW5kZXggPD0gZ2FtZVNlcnZlci5jb25maWcuZWplY3RTcGF3blBsYXllcikge1xuICAgICAgICAvLyBHZXQgZWplY3RlZCBjZWxsXG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdhbWVTZXJ2ZXIubm9kZXNFamVjdGVkLmxlbmd0aCk7XG4gICAgICAgIHZhciBlID0gZ2FtZVNlcnZlci5ub2Rlc0VqZWN0ZWRbaW5kZXhdO1xuXG4gICAgICAgIC8vIFJlbW92ZSBlamVjdGVkIG1hc3NcbiAgICAgICAgZ2FtZVNlcnZlci5yZW1vdmVOb2RlKGUpO1xuXG4gICAgICAgIC8vIEluaGVyaXRcbiAgICAgICAgcG9zID0ge3g6IGUucG9zaXRpb24ueCwgeTogZS5wb3NpdGlvbi55fTtcbiAgICAgICAgc3RhcnRNYXNzID0gZS5tYXNzO1xuXG4gICAgICAgIHZhciBjb2xvciA9IGUuZ2V0Q29sb3IoKTtcbiAgICAgICAgcGxheWVyLnNldENvbG9yKHtcbiAgICAgICAgICAncic6IGNvbG9yLnIsXG4gICAgICAgICAgJ2cnOiBjb2xvci5nLFxuICAgICAgICAgICdiJzogY29sb3IuYlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTcGF3biBwbGF5ZXJcbiAgICBnYW1lU2VydmVyLnNwYXduUGxheWVyKHBsYXllcixwb3Msc3RhcnRNYXNzKTtcbiAgfVxuXG4gIHVwZGF0ZUxCKGdhbWVTZXJ2ZXIpIHtcbiAgICB2YXIgbGIgPSBnYW1lU2VydmVyLmxlYWRlcmJvYXJkO1xuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgY2xpZW50c1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2FtZVNlcnZlci5jbGllbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodHlwZW9mIGdhbWVTZXJ2ZXIuY2xpZW50c1tpXSA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGxheWVyID0gZ2FtZVNlcnZlci5jbGllbnRzW2ldLnBsYXllclRyYWNrZXI7XG4gICAgICB2YXIgcGxheWVyU2NvcmUgPSBwbGF5ZXIuZ2V0U2NvcmUodHJ1ZSk7XG4gICAgICBpZiAocGxheWVyLmNlbGxzLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobGIubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gSW5pdGlhbCBwbGF5ZXJcbiAgICAgICAgbGIucHVzaChwbGF5ZXIpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAobGIubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgdGhpcy5sZWFkZXJib2FyZEFkZFNvcnQocGxheWVyLGxiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIDEwIGluIGxlYWRlcmJvYXJkIGFscmVhZHlcbiAgICAgICAgaWYgKHBsYXllclNjb3JlID4gbGJbOV0uZ2V0U2NvcmUoZmFsc2UpKSB7XG4gICAgICAgICAgbGIucG9wKCk7XG4gICAgICAgICAgdGhpcy5sZWFkZXJib2FyZEFkZFNvcnQocGxheWVyLGxiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmFua09uZSA9IGxiWzBdO1xuICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==