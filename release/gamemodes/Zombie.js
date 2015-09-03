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

var Zombie = (function (_Mode) {
    _inherits(Zombie, _Mode);

    function Zombie() {
        _classCallCheck(this, Zombie);

        _get(Object.getPrototypeOf(Zombie.prototype), 'constructor', this).call(this);
        this.ID = 12;
        this.name = "Zombie FFA";
        this.haveTeams = true;
        this.zombieColor = { 'r': 223, 'g': 223, 'b': 223 };
        this.zombies = [];
        this.players = [];
    }

    _createClass(Zombie, [{
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
        key: 'makeZombie',
        value: function makeZombie(player) {
            player.team = 0;
            player.color = this.zombieColor;
            for (var i = 0; i < player.cells.length; i++) {
                var index = this.players.indexOf(player.cells[i]);
                if (index != -1) {
                    this.players.splice(index, 1);
                }
                player.cells[i].color = this.zombieColor;
                this.zombies.push(player.cells[i]);
            }
        }
    }, {
        key: 'onPlayerSpawn',
        value: function onPlayerSpawn(gameServer, player) {
            if (this.zombies.length == 0) {
                player.team = 0;
                player.color = this.zombieColor;
            } else {
                player.team = player.pID;
                player.color = gameServer.getRandomColor();
            }
            gameServer.spawnPlayer(player);
        }
    }, {
        key: 'onCellAdd',
        value: function onCellAdd(cell) {
            if (cell.owner.getTeam() == 0) {
                this.zombies.push(cell);
            } else {
                this.players.push(cell);
            }
        }
    }, {
        key: 'onCellRemove',
        value: function onCellRemove(cell) {
            if (cell.owner.getTeam() == 0) {
                var index = this.zombies.indexOf(cell);
                if (index != -1) {
                    this.zombies.splice(index, 1);
                }
            } else {
                var index = this.players.indexOf(cell);
                if (index != -1) {
                    this.players.splice(index, 1);
                }
            }
        }
    }, {
        key: 'onCellMove',
        value: function onCellMove(x1, y1, cell) {
            var team = cell.owner.getTeam();
            var r = cell.getSize();
            for (var i = 0; i < cell.owner.visibleNodes.length; i++) {
                var check = cell.owner.visibleNodes[i];
                if (check.getType() != 0 || cell.owner == check.owner) {
                    continue;
                }
                if (check.owner.getTeam() == team || check.owner.getTeam() == 0 || team == 0) {
                    var collisionDist = check.getSize() + r;
                    if (cell.simpleCollide(check, collisionDist)) {
                        continue;
                    }
                    var dist = cell.getDist(cell.position.x, cell.position.y, check.position.x, check.position.y);
                    if (dist < collisionDist) {
                        if (check.owner.getTeam() == 0 && team != 0) {
                            this.makeZombie(cell.owner);
                        } else if (team == 0 && check.owner.getTeam() != 0) {
                            this.makeZombie(check.owner);
                        }
                        var newDeltaY = check.position.y - y1;
                        var newDeltaX = check.position.x - x1;
                        var newAngle = Math.atan2(newDeltaX, newDeltaY);
                        var move = collisionDist - dist;
                        check.position.x = check.position.x + move * Math.sin(newAngle) >> 0;
                        check.position.y = check.position.y + move * Math.cos(newAngle) >> 0;
                    }
                }
            }
        }
    }, {
        key: 'updateLB',
        value: function updateLB(gameServer) {
            var lb = gameServer.leaderboard;
            for (var i = 0; i < gameServer.clients.length; i++) {
                if (typeof gameServer.clients[i] == "undefined" || gameServer.clients[i].playerTracker.team == 0) {
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

    return Zombie;
})(_Mode3['default']);

exports['default'] = Zombie;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9ab21iaWUudHMiXSwibmFtZXMiOlsiWm9tYmllIiwiWm9tYmllLmNvbnN0cnVjdG9yIiwiWm9tYmllLmxlYWRlcmJvYXJkQWRkU29ydCIsIlpvbWJpZS5tYWtlWm9tYmllIiwiWm9tYmllLm9uUGxheWVyU3Bhd24iLCJab21iaWUub25DZWxsQWRkIiwiWm9tYmllLm9uQ2VsbFJlbW92ZSIsIlpvbWJpZS5vbkNlbGxNb3ZlIiwiWm9tYmllLnVwZGF0ZUxCIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0lBSXpCLE1BQUE7Y0FBQSxNQUFBOztBQUtFQSxhQUxGLE1BQUEsR0FLRUE7OEJBTEYsTUFBQTs7QUFNSUMsbUNBTkosTUFBQSw2Q0FNWUE7QUFFUkEsWUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDYkEsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsWUFBWUEsQ0FBQ0E7QUFDekJBLFlBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO0FBQ3RCQSxZQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFDQSxDQUFDQTtBQUNsREEsWUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDbEJBLFlBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBO0tBRW5CQTs7aUJBZkgsTUFBQTs7ZUFtQm9CRCw0QkFBQ0EsTUFBTUEsRUFBQ0EsV0FBV0EsRUFBQUE7QUFFbkNFLGdCQUFJQSxHQUFHQSxHQUFHQSxXQUFXQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNqQ0EsZ0JBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO0FBQ2hCQSxtQkFBT0EsQUFBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBTUEsSUFBSUEsQUFB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b20gJy4vTW9kZSc7XG5pbXBvcnQge0NvbG9yfSBmcm9tICcuLi9IZWxwZXJEZWZzL2luZGV4JztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBab21iaWUgZXh0ZW5kcyBNb2Rle1xuICB6b21iaWVDb2xvcjogQ29sb3I7XG4gIHpvbWJpZXM6IGFueVtdO1xuICBwbGF5ZXJzOiBhbnlbXTtcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLklEID0gMTI7XG4gICAgdGhpcy5uYW1lID0gXCJab21iaWUgRkZBXCI7XG4gICAgdGhpcy5oYXZlVGVhbXMgPSB0cnVlO1xuICAgIHRoaXMuem9tYmllQ29sb3IgPSB7J3InOiAyMjMsICdnJzogMjIzLCAnYic6IDIyM307XG4gICAgdGhpcy56b21iaWVzID0gW107XG4gICAgdGhpcy5wbGF5ZXJzID0gW107XG5cbiAgfVxuXG4gIC8vIEdhbWVtb2RlIFNwZWNpZmljIEZ1bmN0aW9uc1xuXG4gIGxlYWRlcmJvYXJkQWRkU29ydChwbGF5ZXIsbGVhZGVyYm9hcmQpIHtcbiAgICAvLyBBZGRzIHRoZSBwbGF5ZXIgYW5kIHNvcnRzIHRoZSBsZWFkZXJib2FyZFxuICAgIHZhciBsZW4gPSBsZWFkZXJib2FyZC5sZW5ndGggLSAxO1xuICAgIHZhciBsb29wID0gdHJ1ZTtcbiAgICB3aGlsZSAoKGxlbiA+PSAwKSAmJiAobG9vcCkpIHtcbiAgICAgIC8vIFN0YXJ0IGZyb20gdGhlIGJvdHRvbSBvZiB0aGUgbGVhZGVyYm9hcmRcbiAgICAgIGlmIChwbGF5ZXIuZ2V0U2NvcmUoZmFsc2UpIDw9IGxlYWRlcmJvYXJkW2xlbl0uZ2V0U2NvcmUoZmFsc2UpKSB7XG4gICAgICAgIGxlYWRlcmJvYXJkLnNwbGljZShsZW4gKyAxLCAwLCBwbGF5ZXIpO1xuICAgICAgICBsb29wID0gZmFsc2U7IC8vIEVuZCB0aGUgbG9vcCBpZiBhIHNwb3QgaXMgZm91bmRcbiAgICAgIH1cbiAgICAgIGxlbi0tO1xuICAgIH1cbiAgICBpZiAobG9vcCkge1xuICAgICAgLy8gQWRkIHRvIHRvcCBvZiB0aGUgbGlzdCBiZWNhdXNlIG5vIHNwb3RzIHdlcmUgZm91bmRcbiAgICAgIGxlYWRlcmJvYXJkLnNwbGljZSgwLCAwLHBsYXllcik7XG4gICAgfVxuICB9XG5cbiAgbWFrZVpvbWJpZShwbGF5ZXIpIHtcbiAgICAvLyB0dXJucyBhIHBsYXllciBpbnRvIGEgem9tYmllXG4gICAgcGxheWVyLnRlYW0gPSAwO1xuICAgIHBsYXllci5jb2xvciA9IHRoaXMuem9tYmllQ29sb3I7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHBsYXllci5jZWxscy5sZW5ndGg7IGkrKyl7XG4gICAgICAvLyByZW1vdmUgY2VsbCBmcm9tIHBsYXllcnMgYXJyYXlcbiAgICAgIHZhciBpbmRleCA9IHRoaXMucGxheWVycy5pbmRleE9mKHBsYXllci5jZWxsc1tpXSk7XG4gICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICB0aGlzLnBsYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIGNoYW5nZSBjb2xvciBvZiBjZWxsXG4gICAgICBwbGF5ZXIuY2VsbHNbaV0uY29sb3IgPSB0aGlzLnpvbWJpZUNvbG9yO1xuICAgICAgLy8gYWRkIGNlbGwgdG8gem9tYmllIGFycmF5XG4gICAgICB0aGlzLnpvbWJpZXMucHVzaChwbGF5ZXIuY2VsbHNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlXG5cbiAgb25QbGF5ZXJTcGF3bihnYW1lU2VydmVyLHBsYXllcikge1xuICAgIC8vIG1ha2UgcGxheWVyIGEgem9tYmllIGlmIHRoZXJlIGFyZSBub25lXG4gICAgaWYodGhpcy56b21iaWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICBwbGF5ZXIudGVhbSA9IDA7XG4gICAgICBwbGF5ZXIuY29sb3IgPSB0aGlzLnpvbWJpZUNvbG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1c2UgcGxheWVyIGlkIGFzIHRlYW0gc28gdGhhdCBib3RzIGFyZSBzdGlsbCBhYmxlIHRvIGZpZ2h0IChldmVuIHRob3VnaCB0aGV5IHByb2JhYmx5IHR1cm4gaW50byB6b21iaWVzIHZlcnkgZmFzdClcbiAgICAgIHBsYXllci50ZWFtID0gcGxheWVyLnBJRDtcbiAgICAgIHBsYXllci5jb2xvciA9IGdhbWVTZXJ2ZXIuZ2V0UmFuZG9tQ29sb3IoKTtcbiAgICB9XG5cbiAgICAvLyBTcGF3biBwbGF5ZXJcbiAgICBnYW1lU2VydmVyLnNwYXduUGxheWVyKHBsYXllcik7XG4gIH1cblxuICBvbkNlbGxBZGQoY2VsbCkge1xuICAgIC8vIEFkZCB0byB0ZWFtIGxpc3RcbiAgICBpZihjZWxsLm93bmVyLmdldFRlYW0oKSA9PSAwKSB7XG4gICAgICB0aGlzLnpvbWJpZXMucHVzaChjZWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wbGF5ZXJzLnB1c2goY2VsbCk7XG4gICAgfVxuICB9XG5cbiAgb25DZWxsUmVtb3ZlKGNlbGwpIHtcbiAgICAvLyBSZW1vdmUgZnJvbSB0ZWFtIGxpc3RcbiAgICBpZihjZWxsLm93bmVyLmdldFRlYW0oKSA9PSAwKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLnpvbWJpZXMuaW5kZXhPZihjZWxsKTtcbiAgICAgIGlmKGluZGV4ICE9IC0xKSB7XG4gICAgICAgIHRoaXMuem9tYmllcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLnBsYXllcnMuaW5kZXhPZihjZWxsKTtcbiAgICAgIGlmKGluZGV4ICE9IC0xKSB7XG4gICAgICAgIHRoaXMucGxheWVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2VsbE1vdmUoeDEseTEsY2VsbCkge1xuICAgIHZhciB0ZWFtID0gY2VsbC5vd25lci5nZXRUZWFtKCk7XG4gICAgdmFyIHIgPSBjZWxsLmdldFNpemUoKTtcblxuICAgIC8vIEZpbmQgdGVhbVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbC5vd25lci52aXNpYmxlTm9kZXMubGVuZ3RoO2krKykge1xuICAgICAgLy8gT25seSBjb2xsaWRlIHdpdGggcGxheWVyIGNlbGxzXG4gICAgICB2YXIgY2hlY2sgPSBjZWxsLm93bmVyLnZpc2libGVOb2Rlc1tpXTtcblxuICAgICAgaWYgKChjaGVjay5nZXRUeXBlKCkgIT0gMCkgfHwgKGNlbGwub3duZXIgPT0gY2hlY2sub3duZXIpKXtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbGxpc2lvbiB3aXRoIHpvbWJpZXNcbiAgICAgIGlmIChjaGVjay5vd25lci5nZXRUZWFtKCkgPT0gdGVhbSB8fCBjaGVjay5vd25lci5nZXRUZWFtKCkgPT0gMCB8fCB0ZWFtID09IDApIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaW4gY29sbGlzaW9uIHJhbmdlXG4gICAgICAgIHZhciBjb2xsaXNpb25EaXN0ID0gY2hlY2suZ2V0U2l6ZSgpICsgcjsgLy8gTWluaW11bSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSAyIGNlbGxzXG4gICAgICAgIGlmIChjZWxsLnNpbXBsZUNvbGxpZGUoY2hlY2ssIGNvbGxpc2lvbkRpc3QpKSB7XG4gICAgICAgICAgLy8gU2tpcFxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlyc3QgY29sbGlzaW9uIGNoZWNrIHBhc3NlZC4uLiBub3cgbW9yZSBwcmVjaXNlIGNoZWNraW5nXG4gICAgICAgIHZhciBkaXN0ID0gY2VsbC5nZXREaXN0KGNlbGwucG9zaXRpb24ueCwgY2VsbC5wb3NpdGlvbi55LCBjaGVjay5wb3NpdGlvbi54LCBjaGVjay5wb3NpdGlvbi55KTtcblxuICAgICAgICAvLyBDYWxjdWxhdGlvbnNcbiAgICAgICAgaWYgKGRpc3QgPCBjb2xsaXNpb25EaXN0KSB7IC8vIENvbGxpZGVkXG4gICAgICAgICAgaWYgKGNoZWNrLm93bmVyLmdldFRlYW0oKSA9PSAwICYmIHRlYW0gIT0gMCl7XG4gICAgICAgICAgICAvLyB0dXJuIHBsYXllciBpbnRvIHpvbWJpZVxuICAgICAgICAgICAgdGhpcy5tYWtlWm9tYmllKGNlbGwub3duZXIpO1xuICAgICAgICAgIH1lbHNlIGlmKHRlYW0gPT0gMCAmJiBjaGVjay5vd25lci5nZXRUZWFtKCkgIT0gMCl7XG4gICAgICAgICAgICAvLyB0dXJuIG90aGVyIHBsYXllciBpbnRvIHpvbWJpZVxuICAgICAgICAgICAgdGhpcy5tYWtlWm9tYmllKGNoZWNrLm93bmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVGhlIG1vdmluZyBjZWxsIHB1c2hlcyB0aGUgY29sbGlkaW5nIGNlbGxcbiAgICAgICAgICB2YXIgbmV3RGVsdGFZID0gY2hlY2sucG9zaXRpb24ueSAtIHkxO1xuICAgICAgICAgIHZhciBuZXdEZWx0YVggPSBjaGVjay5wb3NpdGlvbi54IC0geDE7XG4gICAgICAgICAgdmFyIG5ld0FuZ2xlID0gTWF0aC5hdGFuMihuZXdEZWx0YVgsIG5ld0RlbHRhWSk7XG5cbiAgICAgICAgICB2YXIgbW92ZSA9IGNvbGxpc2lvbkRpc3QgLSBkaXN0O1xuXG4gICAgICAgICAgY2hlY2sucG9zaXRpb24ueCA9IGNoZWNrLnBvc2l0aW9uLnggKyAoIG1vdmUgKiBNYXRoLnNpbihuZXdBbmdsZSkgKSA+PiAwO1xuICAgICAgICAgIGNoZWNrLnBvc2l0aW9uLnkgPSBjaGVjay5wb3NpdGlvbi55ICsgKCBtb3ZlICogTWF0aC5jb3MobmV3QW5nbGUpICkgPj4gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUxCKGdhbWVTZXJ2ZXIpIHtcbiAgICB2YXIgbGIgPSBnYW1lU2VydmVyLmxlYWRlcmJvYXJkO1xuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgY2xpZW50c1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2FtZVNlcnZlci5jbGllbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodHlwZW9mIGdhbWVTZXJ2ZXIuY2xpZW50c1tpXSA9PSBcInVuZGVmaW5lZFwiIHx8IGdhbWVTZXJ2ZXIuY2xpZW50c1tpXS5wbGF5ZXJUcmFja2VyLnRlYW0gPT0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHBsYXllciA9IGdhbWVTZXJ2ZXIuY2xpZW50c1tpXS5wbGF5ZXJUcmFja2VyO1xuICAgICAgdmFyIHBsYXllclNjb3JlID0gcGxheWVyLmdldFNjb3JlKHRydWUpO1xuICAgICAgaWYgKHBsYXllci5jZWxscy5sZW5ndGggPD0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxiLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIEluaXRpYWwgcGxheWVyXG4gICAgICAgIGxiLnB1c2gocGxheWVyKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2UgaWYgKGxiLmxlbmd0aCA8IDEwKSB7XG4gICAgICAgIHRoaXMubGVhZGVyYm9hcmRBZGRTb3J0KHBsYXllcixsYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAxMCBpbiBsZWFkZXJib2FyZCBhbHJlYWR5XG4gICAgICAgIGlmIChwbGF5ZXJTY29yZSA+IGxiWzldLmdldFNjb3JlKGZhbHNlKSkge1xuICAgICAgICAgIGxiLnBvcCgpO1xuICAgICAgICAgIHRoaXMubGVhZGVyYm9hcmRBZGRTb3J0KHBsYXllcixsYik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJhbmtPbmUgPSBsYlswXTtcbiAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=