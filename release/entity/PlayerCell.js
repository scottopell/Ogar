'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Cell2 = require('./Cell');

var _Cell3 = _interopRequireDefault(_Cell2);

var PlayerCell = (function (_Cell) {
    _inherits(PlayerCell, _Cell);

    function PlayerCell(nodeId, owner, position, mass, gameServer) {
        _classCallCheck(this, PlayerCell);

        _get(Object.getPrototypeOf(PlayerCell.prototype), 'constructor', this).call(this, nodeId, owner, position, mass, gameServer);
        this.cellType = 0;
        this.recombineTicks = 0;
        this.ignoreCollision = false;
    }

    _createClass(PlayerCell, [{
        key: 'visibleCheck',
        value: function visibleCheck(box, centerPos) {
            if (this.mass < 100) {
                return this.collisionCheck(box.bottomY, box.topY, box.rightX, box.leftX);
            }
            var cellSize = this.getSize();
            var lenX = cellSize + box.width >> 0;
            var lenY = cellSize + box.height >> 0;
            return this.abs(this.position.x - centerPos.x) < lenX && this.abs(this.position.y - centerPos.y) < lenY;
        }
    }, {
        key: 'simpleCollide',
        value: function simpleCollide(x1, y1, check, d) {
            var len = d >> 0;
            return this.abs(x1 - check.position.x) < len && this.abs(y1 - check.position.y) < len;
        }
    }, {
        key: 'calcMergeTime',
        value: function calcMergeTime(base) {
            this.recombineTicks = base + (0.02 * this.mass >> 0);
        }
    }, {
        key: 'calcMove',
        value: function calcMove(x2, y2, gameServer) {
            var config = gameServer.config;
            var r = this.getSize();
            var deltaY = y2 - this.position.y;
            var deltaX = x2 - this.position.x;
            var angle = Math.atan2(deltaX, deltaY);
            if (isNaN(angle)) {
                return;
            }
            var dist = this.getDist(this.position.x, this.position.y, x2, y2);
            var speed = Math.min(this.getSpeed(), dist);
            var x1 = this.position.x + speed * Math.sin(angle);
            var y1 = this.position.y + speed * Math.cos(angle);
            for (var i = 0; i < this.owner.cells.length; i++) {
                var cell = this.owner.cells[i];
                if (this.nodeId == cell.nodeId || this.ignoreCollision) {
                    continue;
                }
                if (cell.recombineTicks > 0 || this.recombineTicks > 0) {
                    var collisionDist = cell.getSize() + r;
                    if (!this.simpleCollide(x1, y1, cell, collisionDist)) {
                        continue;
                    }
                    dist = this.getDist(this.position.x, this.position.y, cell.position.x, cell.position.y);
                    if (dist < collisionDist) {
                        var newDeltaY = cell.position.y - y1;
                        var newDeltaX = cell.position.x - x1;
                        var newAngle = Math.atan2(newDeltaX, newDeltaY);
                        var move = collisionDist - dist + 5;
                        cell.position.x = cell.position.x + move * Math.sin(newAngle) >> 0;
                        cell.position.y = cell.position.y + move * Math.cos(newAngle) >> 0;
                    }
                }
            }
            gameServer.gameMode.onCellMove(x1, y1, this);
            if (x1 < config.borderLeft) {
                x1 = config.borderLeft;
            }
            if (x1 > config.borderRight) {
                x1 = config.borderRight;
            }
            if (y1 < config.borderTop) {
                y1 = config.borderTop;
            }
            if (y1 > config.borderBottom) {
                y1 = config.borderBottom;
            }
            this.position.x = x1 >> 0;
            this.position.y = y1 >> 0;
        }
    }, {
        key: 'getEatingRange',
        value: function getEatingRange() {
            return this.getSize() * .4;
        }
    }, {
        key: 'onConsume',
        value: function onConsume(consumer, gameServer) {
            consumer.addMass(this.mass);
        }
    }, {
        key: 'onAdd',
        value: function onAdd(gameServer) {
            gameServer.nodesPlayer.push(this);
            gameServer.gameMode.onCellAdd(this);
        }
    }, {
        key: 'onRemove',
        value: function onRemove(gameServer) {
            var index;
            index = this.owner.cells.indexOf(this);
            if (index != -1) {
                this.owner.cells.splice(index, 1);
            }
            index = gameServer.nodesPlayer.indexOf(this);
            if (index != -1) {
                gameServer.nodesPlayer.splice(index, 1);
            }
            gameServer.gameMode.onCellRemove(this);
        }
    }, {
        key: 'moveDone',
        value: function moveDone(gameServer) {
            this.ignoreCollision = false;
        }
    }, {
        key: 'abs',
        value: function abs(x) {
            return x < 0 ? -x : x;
        }
    }, {
        key: 'getDist',
        value: function getDist(x1, y1, x2, y2) {
            var xs = x2 - x1;
            xs = xs * xs;
            var ys = y2 - y1;
            ys = ys * ys;
            return Math.sqrt(xs + ys);
        }
    }]);

    return PlayerCell;
})(_Cell3['default']);

exports['default'] = PlayerCell;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS9QbGF5ZXJDZWxsLnRzIl0sIm5hbWVzIjpbIlBsYXllckNlbGwiLCJQbGF5ZXJDZWxsLmNvbnN0cnVjdG9yIiwiUGxheWVyQ2VsbC52aXNpYmxlQ2hlY2siLCJQbGF5ZXJDZWxsLnNpbXBsZUNvbGxpZGUiLCJQbGF5ZXJDZWxsLmNhbGNNZXJnZVRpbWUiLCJQbGF5ZXJDZWxsLmNhbGNNb3ZlIiwiUGxheWVyQ2VsbC5nZXRFYXRpbmdSYW5nZSIsIlBsYXllckNlbGwub25Db25zdW1lIiwiUGxheWVyQ2VsbC5vbkFkZCIsIlBsYXllckNlbGwub25SZW1vdmUiLCJQbGF5ZXJDZWxsLm1vdmVEb25lIiwiUGxheWVyQ2VsbC5hYnMiLCJQbGF5ZXJDZWxsLmdldERpc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWlCLFFBQVE7Ozs7SUFFekIsVUFBQTtjQUFBLFVBQUE7O0FBUUVBLGFBUkYsVUFBQSxDQVFjQSxNQUFNQSxFQUFFQSxLQUFLQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxFQUFFQSxVQUFVQSxFQUFBQTs4QkFSdkQsVUFBQTs7QUFTSUMsbUNBVEosVUFBQSw2Q0FTVUEsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUEsVUFBVUEsRUFBRUE7QUFFakRBLFlBQUlBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO0FBQ2xCQSxZQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUN4QkEsWUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsS0FBS0EsQ0FBQ0E7S0FDOUJBOztpQkFkSCxVQUFBOztlQWtCY0Qsc0JBQUNBLEdBQUdBLEVBQUNBLFNBQVNBLEVBQUFBO0FBRXhCRSxnQkFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsR0FBR0EsRUFBRUE7QUFDbkJBLHVCQUFPQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxFQUFDQSxHQUFHQSxD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RUEsQ0FBQ0E7QUFDdkRBLGdCQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFLQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxBQUFFQSxDQUFDQTtBQUd2REEsaUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUNBLENBQUNBLEVBQUVBLEVBQUVBO0FBQy9DQSxvQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFL0JBLG9CQUFJQSxBQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFNQSxJQUFJQSxDQUFDQSxlQUFlQSxBQUFDQSxFQUFFQTtBQUMxREEsNkJBQVNBO2lCQUNWQTtBQUVEQSxvQkFBSUEsQUFBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsSUFBTUEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQUFBQ0EsRUFBRUE7QUFFMURBLHdCQUFJQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUN2Q0Esd0JBQUlBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLEVBQUVBLEVBQUNBLEVBQUVBLEVBQUNBLElBQUlBLEVBQUNBLGFBQWFBLENBQUNBLEVBQUVBO0FBRWpEQSxpQ0FBU0E7cUJBQ1ZBO0FBR0RBLHdCQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxR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QUE7OztxQkFBQSxVQUFBIiwiZmlsZSI6ImVudGl0eS9QbGF5ZXJDZWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENlbGwgZnJvbSAnLi9DZWxsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyQ2VsbCBleHRlbmRzIENlbGx7XG4gIGNlbGxUeXBlOiBudW1iZXI7XG4gIC8vIFRpY2tzIHVudGlsIHRoZSBjZWxsIGNhbiByZWNvbWJpbmUgd2l0aCBvdGhlciBjZWxsc1xuICByZWNvbWJpbmVUaWNrczogbnVtYmVyO1xuICAvLyBUaGlzIGlzIHVzZWQgYnkgcGxheWVyIGNlbGxzIHNvIHRoYXQgdGhleSBkb250XG4gIC8vIGNhdXNlIGFueSBwcm9ibGVtcyB3aGVuIHNwbGl0dGluZ1xuICBpZ25vcmVDb2xsaXNpb246IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Iobm9kZUlkLCBvd25lciwgcG9zaXRpb24sIG1hc3MsIGdhbWVTZXJ2ZXIpe1xuICAgIHN1cGVyKG5vZGVJZCwgb3duZXIsIHBvc2l0aW9uLCBtYXNzLCBnYW1lU2VydmVyKTtcblxuICAgIHRoaXMuY2VsbFR5cGUgPSAwO1xuICAgIHRoaXMucmVjb21iaW5lVGlja3MgPSAwO1xuICAgIHRoaXMuaWdub3JlQ29sbGlzaW9uID0gZmFsc2U7XG4gIH1cblxuICAvLyBNYWluIEZ1bmN0aW9uc1xuXG4gIHZpc2libGVDaGVjayhib3gsY2VudGVyUG9zKSB7XG4gICAgLy8gVXNlIG9sZCBmYXNoaW9uZWQgY2hlY2tpbmcgbWV0aG9kIGlmIGNlbGwgaXMgc21hbGxcbiAgICBpZiAodGhpcy5tYXNzIDwgMTAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsaXNpb25DaGVjayhib3guYm90dG9tWSxib3gudG9wWSxib3gucmlnaHRYLGJveC5sZWZ0WCk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoaXMgY2VsbCBpcyB2aXNpYmxlIHRvIHRoZSBwbGF5ZXJcbiAgICB2YXIgY2VsbFNpemUgPSB0aGlzLmdldFNpemUoKTtcbiAgICAvLyBXaWR0aCBvZiBjZWxsICsgd2lkdGggb2YgdGhlIGJveCAoSW50KVxuICAgIHZhciBsZW5YID0gY2VsbFNpemUgKyBib3gud2lkdGggPj4gMDtcbiAgICAvLyBIZWlnaHQgb2YgY2VsbCArIGhlaWdodCBvZiB0aGUgYm94IChJbnQpXG4gICAgdmFyIGxlblkgPSBjZWxsU2l6ZSArIGJveC5oZWlnaHQgPj4gMDtcblxuICAgIHJldHVybiAodGhpcy5hYnModGhpcy5wb3NpdGlvbi54IC0gY2VudGVyUG9zLngpIDwgbGVuWClcbiAgICAgICYmICh0aGlzLmFicyh0aGlzLnBvc2l0aW9uLnkgLSBjZW50ZXJQb3MueSkgPCBsZW5ZKTtcbiAgfTtcblxuICBzaW1wbGVDb2xsaWRlKHgxLHkxLGNoZWNrLGQpIHtcbiAgICAvLyBTaW1wbGUgY29sbGlzaW9uIGNoZWNrXG4gICAgdmFyIGxlbiA9IGQgPj4gMDsgLy8gV2lkdGggb2YgY2VsbCArIHdpZHRoIG9mIHRoZSBib3ggKEludClcblxuICAgIHJldHVybiAodGhpcy5hYnMoeDEgLSBjaGVjay5wb3NpdGlvbi54KSA8IGxlbikgJiZcbiAgICAgICh0aGlzLmFicyh5MSAtIGNoZWNrLnBvc2l0aW9uLnkpIDwgbGVuKTtcbiAgfTtcblxuICBjYWxjTWVyZ2VUaW1lKGJhc2UpIHtcbiAgICB0aGlzLnJlY29tYmluZVRpY2tzID0gYmFzZSArICgoMC4wMiAqIHRoaXMubWFzcykgPj4gMCk7IC8vIEludCAoMzAgc2VjICsgKC4wMiAqIG1hc3MpKVxuICB9O1xuXG4gIC8vIE1vdmVtZW50XG5cbiAgY2FsY01vdmUoeDIsIHkyLCBnYW1lU2VydmVyKSB7XG4gICAgdmFyIGNvbmZpZyA9IGdhbWVTZXJ2ZXIuY29uZmlnO1xuICAgIHZhciByID0gdGhpcy5nZXRTaXplKCk7IC8vIENlbGwgcmFkaXVzXG5cbiAgICAvLyBHZXQgYW5nbGVcbiAgICB2YXIgZGVsdGFZID0geTIgLSB0aGlzLnBvc2l0aW9uLnk7XG4gICAgdmFyIGRlbHRhWCA9IHgyIC0gdGhpcy5wb3NpdGlvbi54O1xuICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoZGVsdGFYLGRlbHRhWSk7XG5cbiAgICBpZihpc05hTihhbmdsZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEaXN0YW5jZSBiZXR3ZWVuIG1vdXNlIHBvaW50ZXIgYW5kIGNlbGxcbiAgICB2YXIgZGlzdCA9IHRoaXMuZ2V0RGlzdCh0aGlzLnBvc2l0aW9uLngsdGhpcy5wb3NpdGlvbi55LHgyLHkyKTtcbiAgICB2YXIgc3BlZWQgPSBNYXRoLm1pbih0aGlzLmdldFNwZWVkKCksZGlzdCk7XG5cbiAgICB2YXIgeDEgPSB0aGlzLnBvc2l0aW9uLnggKyAoIHNwZWVkICogTWF0aC5zaW4oYW5nbGUpICk7XG4gICAgdmFyIHkxID0gdGhpcy5wb3NpdGlvbi55ICsgKCBzcGVlZCAqIE1hdGguY29zKGFuZ2xlKSApO1xuXG4gICAgLy8gQ29sbGlzaW9uIGNoZWNrIGZvciBvdGhlciBjZWxsc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vd25lci5jZWxscy5sZW5ndGg7aSsrKSB7XG4gICAgICB2YXIgY2VsbCA9IHRoaXMub3duZXIuY2VsbHNbaV07XG5cbiAgICAgIGlmICgodGhpcy5ub2RlSWQgPT0gY2VsbC5ub2RlSWQpIHx8ICh0aGlzLmlnbm9yZUNvbGxpc2lvbikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICgoY2VsbC5yZWNvbWJpbmVUaWNrcyA+IDApIHx8ICh0aGlzLnJlY29tYmluZVRpY2tzID4gMCkpIHtcbiAgICAgICAgLy8gQ2Fubm90IHJlY29tYmluZSAtIENvbGxpc2lvbiB3aXRoIHlvdXIgb3duIGNlbGxzXG4gICAgICAgIHZhciBjb2xsaXNpb25EaXN0ID0gY2VsbC5nZXRTaXplKCkgKyByOyAvLyBNaW5pbXVtIGRpc3RhbmNlIGJldHdlZW4gdGhlIDIgY2VsbHNcbiAgICAgICAgaWYgKCF0aGlzLnNpbXBsZUNvbGxpZGUoeDEseTEsY2VsbCxjb2xsaXNpb25EaXN0KSkge1xuICAgICAgICAgIC8vIFNraXBcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcnN0IGNvbGxpc2lvbiBjaGVjayBwYXNzZWQuLi4gbm93IG1vcmUgcHJlY2lzZSBjaGVja2luZ1xuICAgICAgICBkaXN0ID0gdGhpcy5nZXREaXN0KHRoaXMucG9zaXRpb24ueCx0aGlzLnBvc2l0aW9uLnksY2VsbC5wb3NpdGlvbi54LGNlbGwucG9zaXRpb24ueSk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRpb25zXG4gICAgICAgIGlmIChkaXN0IDwgY29sbGlzaW9uRGlzdCkgeyAvLyBDb2xsaWRlZFxuICAgICAgICAgIC8vIFRoZSBtb3ZpbmcgY2VsbCBwdXNoZXMgdGhlIGNvbGxpZGluZyBjZWxsXG4gICAgICAgICAgdmFyIG5ld0RlbHRhWSA9IGNlbGwucG9zaXRpb24ueSAtIHkxO1xuICAgICAgICAgIHZhciBuZXdEZWx0YVggPSBjZWxsLnBvc2l0aW9uLnggLSB4MTtcbiAgICAgICAgICB2YXIgbmV3QW5nbGUgPSBNYXRoLmF0YW4yKG5ld0RlbHRhWCxuZXdEZWx0YVkpO1xuXG4gICAgICAgICAgdmFyIG1vdmUgPSBjb2xsaXNpb25EaXN0IC0gZGlzdCArIDU7XG5cbiAgICAgICAgICBjZWxsLnBvc2l0aW9uLnggPSBjZWxsLnBvc2l0aW9uLnggKyAoIG1vdmUgKiBNYXRoLnNpbihuZXdBbmdsZSkgKSA+PiAwO1xuICAgICAgICAgIGNlbGwucG9zaXRpb24ueSA9IGNlbGwucG9zaXRpb24ueSArICggbW92ZSAqIE1hdGguY29zKG5ld0FuZ2xlKSApID4+IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnYW1lU2VydmVyLmdhbWVNb2RlLm9uQ2VsbE1vdmUoeDEseTEsdGhpcyk7XG5cbiAgICAvLyBDaGVjayB0byBlbnN1cmUgd2UncmUgbm90IHBhc3NpbmcgdGhlIHdvcmxkIGJvcmRlclxuICAgIGlmICh4MSA8IGNvbmZpZy5ib3JkZXJMZWZ0KSB7XG4gICAgICB4MSA9IGNvbmZpZy5ib3JkZXJMZWZ0O1xuICAgIH1cbiAgICBpZiAoeDEgPiBjb25maWcuYm9yZGVyUmlnaHQpIHtcbiAgICAgIHgxID0gY29uZmlnLmJvcmRlclJpZ2h0O1xuICAgIH1cbiAgICBpZiAoeTEgPCBjb25maWcuYm9yZGVyVG9wKSB7XG4gICAgICB5MSA9IGNvbmZpZy5ib3JkZXJUb3A7XG4gICAgfVxuICAgIGlmICh5MSA+IGNvbmZpZy5ib3JkZXJCb3R0b20pIHtcbiAgICAgIHkxID0gY29uZmlnLmJvcmRlckJvdHRvbTtcbiAgICB9XG5cbiAgICB0aGlzLnBvc2l0aW9uLnggPSB4MSA+PiAwO1xuICAgIHRoaXMucG9zaXRpb24ueSA9IHkxID4+IDA7XG4gIH07XG5cbiAgLy8gT3ZlcnJpZGVcblxuICBnZXRFYXRpbmdSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTaXplKCkgKiAuNDtcbiAgfTtcblxuICBvbkNvbnN1bWUoY29uc3VtZXIsZ2FtZVNlcnZlcikge1xuICAgIGNvbnN1bWVyLmFkZE1hc3ModGhpcy5tYXNzKTtcbiAgfTtcblxuICBvbkFkZChnYW1lU2VydmVyKSB7XG4gICAgLy8gQWRkIHRvIHNwZWNpYWwgcGxheWVyIG5vZGUgbGlzdFxuICAgIGdhbWVTZXJ2ZXIubm9kZXNQbGF5ZXIucHVzaCh0aGlzKTtcbiAgICAvLyBHYW1lbW9kZSBhY3Rpb25zXG4gICAgZ2FtZVNlcnZlci5nYW1lTW9kZS5vbkNlbGxBZGQodGhpcyk7XG4gIH07XG5cbiAgb25SZW1vdmUoZ2FtZVNlcnZlcikge1xuICAgIHZhciBpbmRleDtcbiAgICAvLyBSZW1vdmUgZnJvbSBwbGF5ZXIgY2VsbCBsaXN0XG4gICAgaW5kZXggPSB0aGlzLm93bmVyLmNlbGxzLmluZGV4T2YodGhpcyk7XG4gICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICB0aGlzLm93bmVyLmNlbGxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIC8vIFJlbW92ZSBmcm9tIHNwZWNpYWwgcGxheWVyIGNvbnRyb2xsZWQgbm9kZSBsaXN0XG4gICAgaW5kZXggPSBnYW1lU2VydmVyLm5vZGVzUGxheWVyLmluZGV4T2YodGhpcyk7XG4gICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICBnYW1lU2VydmVyLm5vZGVzUGxheWVyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIC8vIEdhbWVtb2RlIGFjdGlvbnNcbiAgICBnYW1lU2VydmVyLmdhbWVNb2RlLm9uQ2VsbFJlbW92ZSh0aGlzKTtcbiAgfTtcblxuICBtb3ZlRG9uZShnYW1lU2VydmVyKSB7XG4gICAgdGhpcy5pZ25vcmVDb2xsaXNpb24gPSBmYWxzZTtcbiAgfTtcblxuICAvLyBMaWJcblxuICBhYnMoeCkge1xuICAgIHJldHVybiB4IDwgMCA/IC14IDogeDtcbiAgfVxuXG4gIGdldERpc3QoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICB2YXIgeHMgPSB4MiAtIHgxO1xuICAgIHhzID0geHMgKiB4cztcblxuICAgIHZhciB5cyA9IHkyIC0geTE7XG4gICAgeXMgPSB5cyAqIHlzO1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCh4cyArIHlzKTtcbiAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=