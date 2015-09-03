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

var Teams = (function (_Mode) {
    _inherits(Teams, _Mode);

    function Teams() {
        _classCallCheck(this, Teams);

        _get(Object.getPrototypeOf(Teams.prototype), 'constructor', this).call(this);
        this.ID = 1;
        this.name = "Teams";
        this.decayMod = 1.5;
        this.packetLB = 50;
        this.haveTeams = true;
        this.colorFuzziness = 32;
        this.teamAmount = 3;
        this.colors = [{ 'r': 223, 'g': 0, 'b': 0 }, { 'r': 0, 'g': 223, 'b': 0 }, { 'r': 0, 'g': 0, 'b': 223 }];
        this.nodes = [];
    }

    _createClass(Teams, [{
        key: 'fuzzColorComponent',
        value: function fuzzColorComponent(component) {
            component += Math.random() * this.colorFuzziness >> 0;
            return component;
        }
    }, {
        key: 'getTeamColor',
        value: function getTeamColor(team) {
            var color = this.colors[team];
            return {
                r: this.fuzzColorComponent(color.r),
                b: this.fuzzColorComponent(color.b),
                g: this.fuzzColorComponent(color.g)
            };
        }
    }, {
        key: 'onPlayerSpawn',
        value: function onPlayerSpawn(gameServer, player) {
            player.color = this.getTeamColor(player.team);
            gameServer.spawnPlayer(player);
        }
    }, {
        key: 'onServerInit',
        value: function onServerInit(gameServer) {
            for (var i = 0; i < this.teamAmount; i++) {
                this.nodes[i] = [];
            }
            for (var i = 0; i < gameServer.clients.length; i++) {
                var client = gameServer.clients[i].playerTracker;
                this.onPlayerInit(client);
                client.color = this.getTeamColor(client.team);
                for (var j = 0; j < client.cells.length; j++) {
                    var cell = client.cells[j];
                    cell.setColor(client.color);
                    this.nodes[client.team].push(cell);
                }
            }
        }
    }, {
        key: 'onPlayerInit',
        value: function onPlayerInit(player) {
            player.team = Math.floor(Math.random() * this.teamAmount);
        }
    }, {
        key: 'onCellAdd',
        value: function onCellAdd(cell) {
            this.nodes[cell.owner.getTeam()].push(cell);
        }
    }, {
        key: 'onCellRemove',
        value: function onCellRemove(cell) {
            var index = this.nodes[cell.owner.getTeam()].indexOf(cell);
            if (index != -1) {
                this.nodes[cell.owner.getTeam()].splice(index, 1);
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
                if (check.owner.getTeam() == team) {
                    var collisionDist = check.getSize() + r;
                    if (!cell.simpleCollide(x1, y1, check, collisionDist)) {
                        continue;
                    }
                    var dist = cell.getDist(cell.position.x, cell.position.y, check.position.x, check.position.y);
                    if (dist < collisionDist) {
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
            var total = 0;
            var teamMass = [];
            for (var i = 0; i < this.teamAmount; i++) {
                teamMass[i] = 0;
                for (var j = 0; j < this.nodes[i].length; j++) {
                    var cell = this.nodes[i][j];
                    if (!cell) {
                        continue;
                    }
                    teamMass[i] += cell.mass;
                    total += cell.mass;
                }
            }
            for (var i = 0; i < this.teamAmount; i++) {
                if (total <= 0) {
                    continue;
                }
                gameServer.leaderboard[i] = teamMass[i] / total;
            }
        }
    }]);

    return Teams;
})(_Mode3['default']);

exports['default'] = Teams;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9UZWFtcy50cyJdLCJuYW1lcyI6WyJUZWFtcyIsIlRlYW1zLmNvbnN0cnVjdG9yIiwiVGVhbXMuZnV6ekNvbG9yQ29tcG9uZW50IiwiVGVhbXMuZ2V0VGVhbUNvbG9yIiwiVGVhbXMub25QbGF5ZXJTcGF3biIsIlRlYW1zLm9uU2VydmVySW5pdCIsIlRlYW1zLm9uUGxheWVySW5pdCIsIlRlYW1zLm9uQ2VsbEFkZCIsIlRlYW1zLm9uQ2VsbFJlbW92ZSIsIlRlYW1zLm9uQ2VsbE1vdmUiLCJUZWFtcy51cGRhdGVMQiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztJQUl6QixLQUFBO2NBQUEsS0FBQTs7QUFNRUEsYUFORixLQUFBLEdBTUVBOzhCQU5GLEtBQUE7O0FBT0lDLG1DQVBKLEtBQUEsNkNBT1lBO0FBRVJBLFlBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO0FBQ1pBLFlBQUlBLENBQUNBLElBQUlBLEdBQUdBLE9BQU9BLENBQUNBO0FBQ3BCQSxZQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQTtBQUNwQkEsWUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDbkJBLFlBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO0FBQ3RCQSxZQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUl6QkEsWUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFFcEJBLFlBQUlBLENBQUNBLE1BQU1BLEdBQUdBLENBQ1pBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUNBLEVBQzFCQSxFQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxFQUFDQSxFQUMxQkEs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aENBLDZCQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFLQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxBQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUN6RUEsNkJBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUtBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLEFBQUVBLElBQUlBLENBQUNBLENBQUNBO3FCQUMxRUE7aUJBQ0ZBO2FBQ0ZBO1NBQ0ZBOzs7ZUFFT1Qsa0JBQUNBLFVBQVVBLEVBQUFBO0FBQ2pCVSxnQkFBSUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDZEEsZ0JBQUlBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO0FBRWxCQSxpQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFFeENBLHdCQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUdoQkEscUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLEVBQUNBLENBQUNBLEVBQUVBLEVBQUVBO0FBQzVDQSx3QkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFNUJBLHdCQUFJQSxDQUFDQSxJQUFJQSxFQUFFQTtBQUNUQSxpQ0FBU0E7cUJBQ1ZBO0FBRURBLDRCQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtBQUN6QkEseUJBQUtBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO2lCQUNwQkE7YUFDRkE7QUFFREEsaUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBO0FBRXhDQSxvQkFBSUEsS0FBS0EsSUFBSUEsQ0FBQ0EsRUFBRUE7QUFDZEEsNkJBQVNBO2lCQUNWQTtBQUVEQSwwQkFBVUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsS0FBS0EsQ0FBQ0E7YUFDL0NBO1NBQ0ZBOzs7V0FoS0gsS0FBQTs7O3FCQUFBLEtBQUEiLCJmaWxlIjoiZ2FtZW1vZGVzL1RlYW1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZGUgZnJvbSAnLi9Nb2RlJztcbmltcG9ydCBQbGF5ZXJUcmFja2VyIGZyb20gJy4uL1BsYXllclRyYWNrZXInXG5pbXBvcnQge0NvbG9yfSBmcm9tICcuLi9IZWxwZXJEZWZzL2luZGV4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVhbXMgZXh0ZW5kcyBNb2Rle1xuICBjb2xvckZ1enppbmVzczogbnVtYmVyO1xuICBjb2xvcnM6IENvbG9yW107XG4gIHRlYW1BbW91bnQ6IG51bWJlcjtcbiAgbm9kZXM6IGFueVtdO1xuXG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuSUQgPSAxO1xuICAgIHRoaXMubmFtZSA9IFwiVGVhbXNcIjtcbiAgICB0aGlzLmRlY2F5TW9kID0gMS41O1xuICAgIHRoaXMucGFja2V0TEIgPSA1MDtcbiAgICB0aGlzLmhhdmVUZWFtcyA9IHRydWU7XG4gICAgdGhpcy5jb2xvckZ1enppbmVzcyA9IDMyO1xuXG4gICAgLy8gU3BlY2lhbFxuICAgIC8vIEFtb3VudCBvZiB0ZWFtcy4gSGF2aW5nIG1vcmUgdGhhbiAzIHRlYW1zIHdpbGwgY2F1c2UgdGhlIGxlYWRlcmJvYXJkIHRvIHdvcmsgaW5jb3JyZWN0bHkgKGNsaWVudCBpc3N1ZSkuXG4gICAgdGhpcy50ZWFtQW1vdW50ID0gMztcbiAgICAvLyBNYWtlIHN1cmUgeW91IGFkZCBleHRyYSBjb2xvcnMgaGVyZSBpZiB5b3Ugd2lzaCB0byBpbmNyZWFzZSB0aGUgdGVhbSBhbW91bnQgW0RlZmF1bHQgY29sb3JzIGFyZTogUmVkLCBHcmVlbiwgQmx1ZV1cbiAgICB0aGlzLmNvbG9ycyA9IFtcbiAgICAgIHsncic6IDIyMywgJ2cnOiAwLCAnYic6IDB9LFxuICAgICAgeydyJzogMCwgJ2cnOiAyMjMsICdiJzogMH0sXG4gICAgICB7J3InOiAwLCAnZyc6IDAsICdiJzogMjIzfSxcbiAgICBdO1xuICAgIHRoaXMubm9kZXMgPSBbXTsgLy8gVGVhbXNcbiAgfVxuXG4gIC8vR2FtZW1vZGUgU3BlY2lmaWMgRnVuY3Rpb25zXG5cbiAgZnV6ekNvbG9yQ29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGNvbXBvbmVudCArPSBNYXRoLnJhbmRvbSgpICogdGhpcy5jb2xvckZ1enppbmVzcyA+PiAwO1xuICAgIHJldHVybiBjb21wb25lbnQ7XG4gIH1cblxuICBnZXRUZWFtQ29sb3IodGVhbSkge1xuICAgIHZhciBjb2xvciA9IHRoaXMuY29sb3JzW3RlYW1dO1xuICAgIHJldHVybiB7XG4gICAgICByOiB0aGlzLmZ1enpDb2xvckNvbXBvbmVudChjb2xvci5yKSxcbiAgICAgIGI6IHRoaXMuZnV6ekNvbG9yQ29tcG9uZW50KGNvbG9yLmIpLFxuICAgICAgZzogdGhpcy5mdXp6Q29sb3JDb21wb25lbnQoY29sb3IuZylcbiAgICB9O1xuICB9XG5cbiAgLy8gT3ZlcnJpZGVcblxuICBvblBsYXllclNwYXduKGdhbWVTZXJ2ZXIscGxheWVyKSB7XG4gICAgLy8gUmFuZG9tIGNvbG9yIGJhc2VkIG9uIHRlYW1cbiAgICBwbGF5ZXIuY29sb3IgPSB0aGlzLmdldFRlYW1Db2xvcihwbGF5ZXIudGVhbSk7XG4gICAgLy8gU3Bhd24gcGxheWVyXG4gICAgZ2FtZVNlcnZlci5zcGF3blBsYXllcihwbGF5ZXIpO1xuICB9XG5cbiAgb25TZXJ2ZXJJbml0KGdhbWVTZXJ2ZXIpIHtcbiAgICAvLyBTZXQgdXAgdGVhbXNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGVhbUFtb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLm5vZGVzW2ldID0gW107XG4gICAgfVxuXG4gICAgLy8gbWlncmF0ZSBjdXJyZW50IHBsYXllcnMgdG8gdGVhbSBtb2RlXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnYW1lU2VydmVyLmNsaWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjbGllbnQgPSBnYW1lU2VydmVyLmNsaWVudHNbaV0ucGxheWVyVHJhY2tlcjtcbiAgICAgIHRoaXMub25QbGF5ZXJJbml0KGNsaWVudCk7XG4gICAgICBjbGllbnQuY29sb3IgPSB0aGlzLmdldFRlYW1Db2xvcihjbGllbnQudGVhbSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNsaWVudC5jZWxscy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgY2VsbCA9IGNsaWVudC5jZWxsc1tqXTtcbiAgICAgICAgY2VsbC5zZXRDb2xvcihjbGllbnQuY29sb3IpO1xuICAgICAgICB0aGlzLm5vZGVzW2NsaWVudC50ZWFtXS5wdXNoKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uUGxheWVySW5pdChwbGF5ZXIpIHtcbiAgICAvLyBHZXQgcmFuZG9tIHRlYW1cbiAgICBwbGF5ZXIudGVhbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMudGVhbUFtb3VudCk7XG4gIH1cblxuICBvbkNlbGxBZGQoY2VsbCkge1xuICAgIC8vIEFkZCB0byB0ZWFtIGxpc3RcbiAgICB0aGlzLm5vZGVzW2NlbGwub3duZXIuZ2V0VGVhbSgpXS5wdXNoKGNlbGwpO1xuICB9XG5cbiAgb25DZWxsUmVtb3ZlKGNlbGwpIHtcbiAgICAvLyBSZW1vdmUgZnJvbSB0ZWFtIGxpc3RcbiAgICB2YXIgaW5kZXggPSB0aGlzLm5vZGVzW2NlbGwub3duZXIuZ2V0VGVhbSgpXS5pbmRleE9mKGNlbGwpO1xuICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgdGhpcy5ub2Rlc1tjZWxsLm93bmVyLmdldFRlYW0oKV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBvbkNlbGxNb3ZlKHgxLHkxLGNlbGwpIHtcbiAgICB2YXIgdGVhbSA9IGNlbGwub3duZXIuZ2V0VGVhbSgpO1xuICAgIHZhciByID0gY2VsbC5nZXRTaXplKCk7XG5cbiAgICAvLyBGaW5kIHRlYW1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNlbGwub3duZXIudmlzaWJsZU5vZGVzLmxlbmd0aDtpKyspIHtcbiAgICAgIC8vIE9ubHkgY29sbGlkZSB3aXRoIHBsYXllciBjZWxsc1xuICAgICAgdmFyIGNoZWNrID0gY2VsbC5vd25lci52aXNpYmxlTm9kZXNbaV07XG5cbiAgICAgIGlmICgoY2hlY2suZ2V0VHlwZSgpICE9IDApIHx8IChjZWxsLm93bmVyID09IGNoZWNrLm93bmVyKSl7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDb2xsaXNpb24gd2l0aCB0ZWFtbWF0ZXNcbiAgICAgIGlmIChjaGVjay5vd25lci5nZXRUZWFtKCkgPT0gdGVhbSkge1xuICAgICAgICAvLyBDaGVjayBpZiBpbiBjb2xsaXNpb24gcmFuZ2VcbiAgICAgICAgdmFyIGNvbGxpc2lvbkRpc3QgPSBjaGVjay5nZXRTaXplKCkgKyByOyAvLyBNaW5pbXVtIGRpc3RhbmNlIGJldHdlZW4gdGhlIDIgY2VsbHNcbiAgICAgICAgaWYgKCFjZWxsLnNpbXBsZUNvbGxpZGUoeDEseTEsY2hlY2ssIGNvbGxpc2lvbkRpc3QpKSB7XG4gICAgICAgICAgLy8gU2tpcFxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlyc3QgY29sbGlzaW9uIGNoZWNrIHBhc3NlZC4uLiBub3cgbW9yZSBwcmVjaXNlIGNoZWNraW5nXG4gICAgICAgIHZhciBkaXN0ID0gY2VsbC5nZXREaXN0KGNlbGwucG9zaXRpb24ueCxjZWxsLnBvc2l0aW9uLnksY2hlY2sucG9zaXRpb24ueCxjaGVjay5wb3NpdGlvbi55KTtcblxuICAgICAgICAvLyBDYWxjdWxhdGlvbnNcbiAgICAgICAgaWYgKGRpc3QgPCBjb2xsaXNpb25EaXN0KSB7IC8vIENvbGxpZGVkXG4gICAgICAgICAgLy8gVGhlIG1vdmluZyBjZWxsIHB1c2hlcyB0aGUgY29sbGlkaW5nIGNlbGxcbiAgICAgICAgICB2YXIgbmV3RGVsdGFZID0gY2hlY2sucG9zaXRpb24ueSAtIHkxO1xuICAgICAgICAgIHZhciBuZXdEZWx0YVggPSBjaGVjay5wb3NpdGlvbi54IC0geDE7XG4gICAgICAgICAgdmFyIG5ld0FuZ2xlID0gTWF0aC5hdGFuMihuZXdEZWx0YVgsbmV3RGVsdGFZKTtcblxuICAgICAgICAgIHZhciBtb3ZlID0gY29sbGlzaW9uRGlzdCAtIGRpc3Q7XG5cbiAgICAgICAgICBjaGVjay5wb3NpdGlvbi54ID0gY2hlY2sucG9zaXRpb24ueCArICggbW92ZSAqIE1hdGguc2luKG5ld0FuZ2xlKSApID4+IDA7XG4gICAgICAgICAgY2hlY2sucG9zaXRpb24ueSA9IGNoZWNrLnBvc2l0aW9uLnkgKyAoIG1vdmUgKiBNYXRoLmNvcyhuZXdBbmdsZSkgKSA+PiAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTEIoZ2FtZVNlcnZlcikge1xuICAgIHZhciB0b3RhbCA9IDA7XG4gICAgdmFyIHRlYW1NYXNzID0gW107XG4gICAgLy8gR2V0IG1hc3NcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGVhbUFtb3VudDsgaSsrKSB7XG4gICAgICAvLyBTZXQgc3RhcnRpbmcgbWFzc1xuICAgICAgdGVhbU1hc3NbaV0gPSAwO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggY2VsbHNcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5ub2Rlc1tpXS5sZW5ndGg7aisrKSB7XG4gICAgICAgIHZhciBjZWxsID0gdGhpcy5ub2Rlc1tpXVtqXTtcblxuICAgICAgICBpZiAoIWNlbGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlYW1NYXNzW2ldICs9IGNlbGwubWFzcztcbiAgICAgICAgdG90YWwgKz0gY2VsbC5tYXNzO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBDYWxjIHBlcmNlbnRhZ2VcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGVhbUFtb3VudDsgaSsrKSB7XG4gICAgICAvLyBObyBwbGF5ZXJzXG4gICAgICBpZiAodG90YWwgPD0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZ2FtZVNlcnZlci5sZWFkZXJib2FyZFtpXSA9IHRlYW1NYXNzW2ldL3RvdGFsO1xuICAgIH1cbiAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=