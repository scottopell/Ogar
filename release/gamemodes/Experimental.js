'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _FFA2 = require('./FFA');

var _FFA3 = _interopRequireDefault(_FFA2);

var _entityIndex = require('../entity/index');

var VirusFeed = require('../entity/Virus').prototype.feed;

var Experimental = (function (_FFA) {
    _inherits(Experimental, _FFA);

    function Experimental() {
        _classCallCheck(this, Experimental);

        _get(Object.getPrototypeOf(Experimental.prototype), 'constructor', this).call(this);
        this.ID = 2;
        this.name = "Experimental";
        this.specByLeaderboard = true;
        this.nodesMother = [];
        this.tickMother = 0;
        this.tickMotherS = 0;
        this.motherCellMass = 200;
        this.motherUpdateInterval = 5;
        this.motherSpawnInterval = 100;
        this.motherMinAmount = 5;
    }

    _createClass(Experimental, [{
        key: 'updateMotherCells',
        value: function updateMotherCells(gameServer) {
            for (var i in this.nodesMother) {
                var mother = this.nodesMother[i];
                mother.update(gameServer);
                mother.checkEat(gameServer);
            }
        }
    }, {
        key: 'spawnMotherCell',
        value: function spawnMotherCell(gameServer) {
            if (this.nodesMother.length < this.motherMinAmount) {
                var pos = gameServer.getRandomPosition();
                for (var i = 0; i < gameServer.nodesPlayer.length; i++) {
                    var check = gameServer.nodesPlayer[i];
                    var r = check.getSize();
                    var topY = check.position.y - r;
                    var bottomY = check.position.y + r;
                    var leftX = check.position.x - r;
                    var rightX = check.position.x + r;
                    if (pos.y > bottomY) {
                        continue;
                    }
                    if (pos.y < topY) {
                        continue;
                    }
                    if (pos.x > rightX) {
                        continue;
                    }
                    if (pos.x < leftX) {
                        continue;
                    }
                    return;
                }
                var m = new MotherCell(gameServer.getNextNodeId(), null, pos, this.motherCellMass, null);
            }
        }
    }, {
        key: 'onServerInit',
        value: function onServerInit(gameServer) {
            gameServer.run = true;
            gameServer.getRandomSpawn = gameServer.getRandomPosition;
        }
    }, {
        key: 'onTick',
        value: function onTick(gameServer) {
            if (this.tickMother >= this.motherUpdateInterval) {
                this.updateMotherCells(gameServer);
                this.tickMother = 0;
            } else {
                this.tickMother++;
            }
            if (this.tickMotherS >= this.motherSpawnInterval) {
                this.spawnMotherCell(gameServer);
                this.tickMotherS = 0;
            } else {
                this.tickMotherS++;
            }
        }
    }, {
        key: 'onChange',
        value: function onChange(gameServer) {
            for (var i in this.nodesMother) {
                gameServer.removeNode(this.nodesMother[i]);
            }
            _entityIndex.Virus.prototype.feed = VirusFeed;
            gameServer.getRandomSpawn = require('../GameServer').prototype.getRandomSpawn;
        }
    }]);

    return Experimental;
})(_FFA3['default']);

exports['default'] = Experimental;

var MotherCell = (function (_Cell) {
    _inherits(MotherCell, _Cell);

    function MotherCell(nodeId, owner, position, mass, gameServer) {
        _classCallCheck(this, MotherCell);

        _get(Object.getPrototypeOf(MotherCell.prototype), 'constructor', this).call(this, nodeId, owner, position, mass, gameServer);
        this.cellType = 2;
        this.color = { r: 205, g: 85, b: 100 };
        this.spiked = 1;
    }

    _createClass(MotherCell, [{
        key: 'getEatingRange',
        value: function getEatingRange() {
            return this.getSize() * .5;
        }
    }, {
        key: 'update',
        value: function update(gameServer) {
            this.mass += .25;
            var maxFood = 10;
            var i = 0;
            while (this.mass > gameServer.gameMode.motherCellMass && i < maxFood) {
                if (gameServer.currentFood < gameServer.config.foodMaxAmount) {
                    this.spawnFood(gameServer);
                }
                this.mass--;
                i++;
            }
        }
    }, {
        key: 'checkEat',
        value: function checkEat(gameServer) {
            var safeMass = this.mass * .9;
            var r = this.getSize();
            for (var i in gameServer.nodesPlayer) {
                var check = gameServer.nodesPlayer[i];
                if (check.mass > safeMass) {
                    continue;
                }
                var len = r - check.getSize() / 2 >> 0;
                if (this.abs(this.position.x - check.position.x) < len && this.abs(this.position.y - check.position.y) < len) {
                    var xs = Math.pow(check.position.x - this.position.x, 2);
                    var ys = Math.pow(check.position.y - this.position.y, 2);
                    var dist = Math.sqrt(xs + ys);
                    if (r > dist) {
                        gameServer.removeNode(check);
                        this.mass += check.mass;
                    }
                }
            }
            for (var i in gameServer.movingNodes) {
                var check = gameServer.movingNodes[i];
                if (check.getType() == 1 || check.mass > safeMass) {
                    continue;
                }
                var len = r >> 0;
                if (this.abs(this.position.x - check.position.x) < len && this.abs(this.position.y - check.position.y) < len) {
                    gameServer.removeNode(check);
                    this.mass += check.mass;
                }
            }
        }
    }, {
        key: 'abs',
        value: function abs(n) {
            return n < 0 ? -n : n;
        }
    }, {
        key: 'spawnFood',
        value: function spawnFood(gameServer) {
            var angle = Math.random() * 6.28;
            var r = this.getSize();
            var pos = {
                x: this.position.x + r * Math.sin(angle),
                y: this.position.y + r * Math.cos(angle)
            };
            var f = new _entityIndex.Food(gameServer.getNextNodeId(), null, pos, gameServer.config.foodMass, null);
            f.setColor(gameServer.getRandomColor());
            gameServer.addNode(f);
            gameServer.currentFood++;
            f.angle = angle;
            var dist = Math.random() * 10 + 22;
            f.setMoveEngineData(dist, 15, null);
            gameServer.setAsMovingNode(f);
        }
    }, {
        key: 'onAdd',
        value: function onAdd(gameServer) {
            gameServer.gameMode.nodesMother.push(this);
        }
    }, {
        key: 'onRemove',
        value: function onRemove(gameServer) {
            var index = gameServer.gameMode.nodesMother.indexOf(this);
            if (index != -1) {
                gameServer.gameMode.nodesMother.splice(index, 1);
            }
        }
    }, {
        key: 'visibleCheck',
        value: function visibleCheck(box, centerPos) {
            var cellSize = this.getSize();
            var lenX = cellSize + box.width >> 0;
            var lenY = cellSize + box.height >> 0;
            return this.abs(this.position.x - centerPos.x) < lenX && this.abs(this.position.y - centerPos.y) < lenY;
        }
    }]);

    return MotherCell;
})(_entityIndex.Cell);

var ExperimentalVirus = (function (_Virus) {
    _inherits(ExperimentalVirus, _Virus);

    function ExperimentalVirus(nodeId, owner, position, mass, gameServer) {
        _classCallCheck(this, ExperimentalVirus);

        _get(Object.getPrototypeOf(ExperimentalVirus.prototype), 'constructor', this).call(this, nodeId, owner, position, mass, gameServer);
    }

    _createClass(ExperimentalVirus, [{
        key: 'feed',
        value: function feed(feeder, gameServer) {
            gameServer.removeNode(feeder);
            this.setAngle(feeder.getAngle());
            this.moveEngineTicks = 5;
            this.moveEngineSpeed = 30;
            var index = gameServer.movingNodes.indexOf(this);
            if (index == -1) {
                gameServer.movingNodes.push(this);
            }
        }
    }]);

    return ExperimentalVirus;
})(_entityIndex.Virus);

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9FeHBlcmltZW50YWwudHMiXSwibmFtZXMiOlsiRXhwZXJpbWVudGFsIiwiRXhwZXJpbWVudGFsLmNvbnN0cnVjdG9yIiwiRXhwZXJpbWVudGFsLnVwZGF0ZU1vdGhlckNlbGxzIiwiRXhwZXJpbWVudGFsLnNwYXduTW90aGVyQ2VsbCIsIkV4cGVyaW1lbnRhbC5vblNlcnZlckluaXQiLCJFeHBlcmltZW50YWwub25UaWNrIiwiRXhwZXJpbWVudGFsLm9uQ2hhbmdlIiwiTW90aGVyQ2VsbCIsIk1vdGhlckNlbGwuY29uc3RydWN0b3IiLCJNb3RoZXJDZWxsLmdldEVhdGluZ1JhbmdlIiwiTW90aGVyQ2VsbC51cGRhdGUiLCJNb3RoZXJDZWxsLmNoZWNrRWF0IiwiTW90aGVyQ2VsbC5hYnMiLCJNb3RoZXJDZWxsLnNwYXduRm9vZCIsIk1vdGhlckNlbGwub25BZGQiLCJNb3RoZXJDZWxsLm9uUmVtb3ZlIiwiTW90aGVyQ2VsbC52aXNpYmxlQ2hlY2siLCJFeHBlcmltZW50YWxWaXJ1cyIsIkV4cGVyaW1lbnRhbFZpcnVzLmNvbnN0cnVjdG9yIiwiRXhwZXJpbWVudGFsVmlydXMuZmVlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFBZ0IsT0FBTzs7OzsyQkFDUyxpQkFBaUI7O0FBQ2pELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7O0lBSzFELFlBQUE7Y0FBQSxZQUFBOztBQVlFQSxhQVpGLFlBQUEsR0FZRUE7OEJBWkYsWUFBQTs7QUFhSUMsbUNBYkosWUFBQSw2Q0FhWUE7QUFFUkEsWUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDWkEsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsY0FBY0EsQ0FBQ0E7QUFDM0JBLFlBQUlBLENBQUNBLGlCQUFpQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7QUFHOUJBLFlBQUlBLENBQUNBLFdBQVdBLEdBQUdB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QWpCSCxpQkFBQSIsImZpbGUiOiJnYW1lbW9kZXMvRXhwZXJpbWVudGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEZGQSBmcm9tICcuL0ZGQSc7XG5pbXBvcnQge0NlbGwsIEZvb2QsIFZpcnVzfSBmcm9tICcuLi9lbnRpdHkvaW5kZXgnO1xudmFyIFZpcnVzRmVlZCA9IHJlcXVpcmUoJy4uL2VudGl0eS9WaXJ1cycpLnByb3RvdHlwZS5mZWVkO1xuaW1wb3J0IFBsYXllclRyYWNrZXIgZnJvbSAnLi4vUGxheWVyVHJhY2tlcic7XG5pbXBvcnQgR2FtZVNlcnZlciBmcm9tICcuLi9HYW1lU2VydmVyJztcbmltcG9ydCB7UG9zaXRpb259IGZyb20gJy4uL0hlbHBlckRlZnMvaW5kZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBlcmltZW50YWwgZXh0ZW5kcyBGRkEge1xuICBub2Rlc01vdGhlcjogYW55W107XG4gIHRpY2tNb3RoZXI6IG51bWJlcjtcbiAgdGlja01vdGhlclM6IG51bWJlcjtcblxuICBtb3RoZXJDZWxsTWFzczogbnVtYmVyO1xuICAvLyBIb3cgbWFueSB0aWNrcyBpdCB0YWtlcyB0byB1cGRhdGUgdGhlIG1vdGhlciBjZWxsICgxIHRpY2sgPSA1MCBtcylcbiAgbW90aGVyVXBkYXRlSW50ZXJ2YWw6IG51bWJlcjtcbiAgLy8gSG93IG1hbnkgdGlja3MgaXQgdGFrZXMgdG8gc3Bhd24gYW5vdGhlciBtb3RoZXIgY2VsbCAtIEN1cnJlbnRseSA1IHNlY29uZHNcbiAgbW90aGVyU3Bhd25JbnRlcnZhbDogbnVtYmVyO1xuICBtb3RoZXJNaW5BbW91bnQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLklEID0gMjtcbiAgICB0aGlzLm5hbWUgPSBcIkV4cGVyaW1lbnRhbFwiO1xuICAgIHRoaXMuc3BlY0J5TGVhZGVyYm9hcmQgPSB0cnVlO1xuXG4gICAgLy8gR2FtZW1vZGUgU3BlY2lmaWMgVmFyaWFibGVzXG4gICAgdGhpcy5ub2Rlc01vdGhlciA9IFtdO1xuICAgIHRoaXMudGlja01vdGhlciA9IDA7XG4gICAgdGhpcy50aWNrTW90aGVyUyA9IDA7XG5cbiAgICAvLyBDb25maWdcbiAgICB0aGlzLm1vdGhlckNlbGxNYXNzID0gMjAwO1xuICAgIHRoaXMubW90aGVyVXBkYXRlSW50ZXJ2YWwgPSA1O1xuICAgIHRoaXMubW90aGVyU3Bhd25JbnRlcnZhbCA9IDEwMDtcbiAgICB0aGlzLm1vdGhlck1pbkFtb3VudCA9IDU7XG4gIH1cblxuICAvLyBHYW1lbW9kZSBTcGVjaWZpYyBGdW5jdGlvbnNcblxuICB1cGRhdGVNb3RoZXJDZWxscyhnYW1lU2VydmVyKSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLm5vZGVzTW90aGVyKSB7XG4gICAgICB2YXIgbW90aGVyID0gdGhpcy5ub2Rlc01vdGhlcltpXTtcblxuICAgICAgLy8gQ2hlY2tzXG4gICAgICBtb3RoZXIudXBkYXRlKGdhbWVTZXJ2ZXIpO1xuICAgICAgbW90aGVyLmNoZWNrRWF0KGdhbWVTZXJ2ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHNwYXduTW90aGVyQ2VsbChnYW1lU2VydmVyKSB7XG4gICAgLy8gQ2hlY2tzIGlmIHRoZXJlIGFyZSBlbm91Z2ggbW90aGVyIGNlbGxzIG9uIHRoZSBtYXBcbiAgICBpZiAodGhpcy5ub2Rlc01vdGhlci5sZW5ndGggPCB0aGlzLm1vdGhlck1pbkFtb3VudCkge1xuICAgICAgLy8gU3Bhd25zIGEgbW90aGVyIGNlbGxcbiAgICAgIHZhciBwb3MgPSAgZ2FtZVNlcnZlci5nZXRSYW5kb21Qb3NpdGlvbigpO1xuXG4gICAgICAvLyBDaGVjayBmb3IgcGxheWVyc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnYW1lU2VydmVyLm5vZGVzUGxheWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVjayA9IGdhbWVTZXJ2ZXIubm9kZXNQbGF5ZXJbaV07XG5cbiAgICAgICAgdmFyIHIgPSBjaGVjay5nZXRTaXplKCk7IC8vIFJhZGl1cyBvZiBjaGVja2luZyBwbGF5ZXIgY2VsbFxuXG4gICAgICAgIC8vIENvbGxpc2lvbiBib3hcbiAgICAgICAgdmFyIHRvcFkgPSBjaGVjay5wb3NpdGlvbi55IC0gcjtcbiAgICAgICAgdmFyIGJvdHRvbVkgPSBjaGVjay5wb3NpdGlvbi55ICsgcjtcbiAgICAgICAgdmFyIGxlZnRYID0gY2hlY2sucG9zaXRpb24ueCAtIHI7XG4gICAgICAgIHZhciByaWdodFggPSBjaGVjay5wb3NpdGlvbi54ICsgcjtcblxuICAgICAgICAvLyBDaGVjayBmb3IgY29sbGlzaW9uc1xuICAgICAgICBpZiAocG9zLnkgPiBib3R0b21ZKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zLnkgPCB0b3BZKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zLnggPiByaWdodFgpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3MueCA8IGxlZnRYKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb2xsaWRlZFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFNwYXduIGlmIG5vIGNlbGxzIGFyZSBjb2xsaWRpbmdcbiAgICAgIHZhciBtID0gbmV3IE1vdGhlckNlbGwoZ2FtZVNlcnZlci5nZXROZXh0Tm9kZUlkKCksIG51bGwsIHBvcywgdGhpcy5tb3RoZXJDZWxsTWFzcywgbnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIE92ZXJyaWRlXG5cbiAgb25TZXJ2ZXJJbml0KGdhbWVTZXJ2ZXIpIHtcbiAgICAvLyBDYWxsZWQgd2hlbiB0aGUgc2VydmVyIHN0YXJ0c1xuICAgIGdhbWVTZXJ2ZXIucnVuID0gdHJ1ZTtcblxuICAgIC8vIFRPRE8gdXNlIGV4cGVyaW1lbnRhbCBWaXJ1cyBoZXJlXG5cbiAgICAvLyBPdmVycmlkZSB0aGlzXG4gICAgZ2FtZVNlcnZlci5nZXRSYW5kb21TcGF3biA9IGdhbWVTZXJ2ZXIuZ2V0UmFuZG9tUG9zaXRpb247XG4gIH07XG5cbiAgb25UaWNrKGdhbWVTZXJ2ZXIpIHtcbiAgICAvLyBNb3RoZXIgQ2VsbCB1cGRhdGVzXG4gICAgaWYgKHRoaXMudGlja01vdGhlciA+PSB0aGlzLm1vdGhlclVwZGF0ZUludGVydmFsKSB7XG4gICAgICB0aGlzLnVwZGF0ZU1vdGhlckNlbGxzKGdhbWVTZXJ2ZXIpO1xuICAgICAgdGhpcy50aWNrTW90aGVyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50aWNrTW90aGVyKys7XG4gICAgfVxuXG4gICAgLy8gTW90aGVyIENlbGwgU3Bhd25pbmdcbiAgICBpZiAodGhpcy50aWNrTW90aGVyUyA+PSB0aGlzLm1vdGhlclNwYXduSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuc3Bhd25Nb3RoZXJDZWxsKGdhbWVTZXJ2ZXIpO1xuICAgICAgdGhpcy50aWNrTW90aGVyUyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGlja01vdGhlclMrKztcbiAgICB9XG4gIH07XG5cbiAgb25DaGFuZ2UoZ2FtZVNlcnZlcikge1xuICAgIC8vIFJlbW92ZSBhbGwgbW90aGVyIGNlbGxzXG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLm5vZGVzTW90aGVyKSB7XG4gICAgICBnYW1lU2VydmVyLnJlbW92ZU5vZGUodGhpcy5ub2Rlc01vdGhlcltpXSk7XG4gICAgfVxuICAgIC8vIEFkZCBiYWNrIGRlZmF1bHQgZnVuY3Rpb25zXG4gICAgVmlydXMucHJvdG90eXBlLmZlZWQgPSBWaXJ1c0ZlZWQ7XG4gICAgZ2FtZVNlcnZlci5nZXRSYW5kb21TcGF3biA9IHJlcXVpcmUoJy4uL0dhbWVTZXJ2ZXInKS5wcm90b3R5cGUuZ2V0UmFuZG9tU3Bhd247XG4gIH07XG5cbiAgLy8gTmV3IGNlbGwgdHlwZVxuXG59XG5cbmNsYXNzIE1vdGhlckNlbGwgZXh0ZW5kcyBDZWxse1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIG5vZGVJZDogbnVtYmVyLFxuICAgICAgb3duZXI6IFBsYXllclRyYWNrZXIsXG4gICAgICBwb3NpdGlvbjogUG9zaXRpb24sXG4gICAgICBtYXNzOiBudW1iZXIsXG4gICAgICBnYW1lU2VydmVyOiBHYW1lU2VydmVyKSB7XG5cbiAgICBzdXBlcihub2RlSWQsIG93bmVyLCBwb3NpdGlvbiwgbWFzcywgZ2FtZVNlcnZlcik7XG5cbiAgICB0aGlzLmNlbGxUeXBlID0gMjsgLy8gbWltaWNzIFZpcnVzXG4gICAgdGhpcy5jb2xvciA9IHtyOiAyMDUsIGc6IDg1LCBiOiAxMDB9O1xuICAgIHRoaXMuc3Bpa2VkID0gMTtcblxuICB9XG5cbiAgZ2V0RWF0aW5nUmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2l6ZSgpICogLjU7XG4gIH07XG5cbiAgdXBkYXRlKGdhbWVTZXJ2ZXIpIHtcbiAgICAvLyBBZGQgbWFzc1xuICAgIHRoaXMubWFzcyArPSAuMjU7XG5cbiAgICAvLyBTcGF3biBmb29kXG4gICAgdmFyIG1heEZvb2QgPSAxMDsgLy8gTWF4IGZvb2Qgc3Bhd25lZCBwZXIgdGlja1xuICAgIHZhciBpID0gMDsgLy8gRm9vZCBzcGF3biBjb3VudGVyXG4gICAgd2hpbGUgKCh0aGlzLm1hc3MgPiBnYW1lU2VydmVyLmdhbWVNb2RlLm1vdGhlckNlbGxNYXNzKSAmJiAoaSA8IG1heEZvb2QpKSAge1xuICAgICAgLy8gT25seSBzcGF3biBpZiBmb29kIGNhcCBoYXNuIGJlZW4gcmVhY2hlZFxuICAgICAgaWYgKGdhbWVTZXJ2ZXIuY3VycmVudEZvb2QgPCBnYW1lU2VydmVyLmNvbmZpZy5mb29kTWF4QW1vdW50KSB7XG4gICAgICAgIHRoaXMuc3Bhd25Gb29kKGdhbWVTZXJ2ZXIpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbmNyZW1lbnRlcnNcbiAgICAgIHRoaXMubWFzcy0tO1xuICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrRWF0KGdhbWVTZXJ2ZXIpIHtcbiAgICB2YXIgc2FmZU1hc3MgPSB0aGlzLm1hc3MgKiAuOTtcbiAgICB2YXIgciA9IHRoaXMuZ2V0U2l6ZSgpOyAvLyBUaGUgYm94IGFyZWEgdGhhdCB0aGUgY2hlY2tlZCBjZWxsIG5lZWRzIHRvIGJlIGluIHRvIGJlIGNvbnNpZGVyZWQgZWF0ZW5cblxuICAgIC8vIExvb3AgZm9yIHBvdGVudGlhbCBwcmV5XG4gICAgZm9yICh2YXIgaSBpbiBnYW1lU2VydmVyLm5vZGVzUGxheWVyKSB7XG4gICAgICB2YXIgY2hlY2sgPSBnYW1lU2VydmVyLm5vZGVzUGxheWVyW2ldO1xuXG4gICAgICBpZiAoY2hlY2subWFzcyA+IHNhZmVNYXNzKSB7XG4gICAgICAgIC8vIFRvbyBiaWcgdG8gYmUgY29uc3VtZWRcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbGN1bGF0aW9uc1xuICAgICAgdmFyIGxlbiA9IHIgLSAoY2hlY2suZ2V0U2l6ZSgpIC8gMikgPj4gMDtcbiAgICAgIGlmICgodGhpcy5hYnModGhpcy5wb3NpdGlvbi54IC0gY2hlY2sucG9zaXRpb24ueCkgPCBsZW4pICYmICh0aGlzLmFicyh0aGlzLnBvc2l0aW9uLnkgLSBjaGVjay5wb3NpdGlvbi55KSA8IGxlbikpIHtcbiAgICAgICAgLy8gQSBzZWNvbmQsIG1vcmUgcHJlY2lzZSBjaGVja1xuICAgICAgICB2YXIgeHMgPSBNYXRoLnBvdyhjaGVjay5wb3NpdGlvbi54IC0gdGhpcy5wb3NpdGlvbi54LCAyKTtcbiAgICAgICAgdmFyIHlzID0gTWF0aC5wb3coY2hlY2sucG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueSwgMik7XG4gICAgICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KCB4cyArIHlzICk7XG5cbiAgICAgICAgaWYgKHIgPiBkaXN0KSB7XG4gICAgICAgICAgLy8gRWF0cyB0aGUgY2VsbFxuICAgICAgICAgIGdhbWVTZXJ2ZXIucmVtb3ZlTm9kZShjaGVjayk7XG4gICAgICAgICAgdGhpcy5tYXNzICs9IGNoZWNrLm1hc3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSBpbiBnYW1lU2VydmVyLm1vdmluZ05vZGVzKSB7XG4gICAgICB2YXIgY2hlY2sgPSBnYW1lU2VydmVyLm1vdmluZ05vZGVzW2ldO1xuXG4gICAgICBpZiAoKGNoZWNrLmdldFR5cGUoKSA9PSAxKSB8fCAoY2hlY2subWFzcyA+IHNhZmVNYXNzKSkge1xuICAgICAgICAvLyBUb28gYmlnIHRvIGJlIGNvbnN1bWVkLyBObyBwbGF5ZXIgY2VsbHNcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbGN1bGF0aW9uc1xuICAgICAgdmFyIGxlbiA9IHIgPj4gMDtcbiAgICAgIGlmICgodGhpcy5hYnModGhpcy5wb3NpdGlvbi54IC0gY2hlY2sucG9zaXRpb24ueCkgPCBsZW4pICYmICh0aGlzLmFicyh0aGlzLnBvc2l0aW9uLnkgLSBjaGVjay5wb3NpdGlvbi55KSA8IGxlbikpIHtcbiAgICAgICAgLy8gRWF0IHRoZSBjZWxsXG4gICAgICAgIGdhbWVTZXJ2ZXIucmVtb3ZlTm9kZShjaGVjayk7XG4gICAgICAgIHRoaXMubWFzcyArPSBjaGVjay5tYXNzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFicyhuKSB7XG4gICAgLy8gQmVjYXVzZSBNYXRoLmFicyBpcyBzbG93XG4gICAgcmV0dXJuIChuIDwgMCkgPyAtbjogbjtcbiAgfVxuXG4gIHNwYXduRm9vZChnYW1lU2VydmVyKSB7XG4gICAgLy8gR2V0IHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgdmFyIGFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDYuMjg7IC8vIChNYXRoLlBJICogMikgPz8/IFByZWNpc2lvbiBpcyBub3Qgb3VyIGdyZWF0ZXN0IGNvbmNlcm4gaGVyZVxuICAgIHZhciByID0gdGhpcy5nZXRTaXplKCk7XG4gICAgdmFyIHBvcyA9IHtcbiAgICB4OiB0aGlzLnBvc2l0aW9uLnggKyAoIHIgKiBNYXRoLnNpbihhbmdsZSkgKSxcbiAgICB5OiB0aGlzLnBvc2l0aW9uLnkgKyAoIHIgKiBNYXRoLmNvcyhhbmdsZSkgKVxuICAgIH07XG5cbiAgICAvLyBTcGF3biBmb29kXG4gICAgdmFyIGYgPSBuZXcgRm9vZChnYW1lU2VydmVyLmdldE5leHROb2RlSWQoKSwgbnVsbCwgcG9zLCBnYW1lU2VydmVyLmNvbmZpZy5mb29kTWFzcywgbnVsbCk7XG4gICAgZi5zZXRDb2xvcihnYW1lU2VydmVyLmdldFJhbmRvbUNvbG9yKCkpO1xuXG4gICAgZ2FtZVNlcnZlci5hZGROb2RlKGYpO1xuICAgIGdhbWVTZXJ2ZXIuY3VycmVudEZvb2QrKztcblxuICAgIC8vIE1vdmUgZW5naW5lXG4gICAgZi5hbmdsZSA9IGFuZ2xlO1xuICAgIHZhciBkaXN0ID0gKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAyMjsgLy8gUmFuZG9tIGRpc3RhbmNlXG4gICAgZi5zZXRNb3ZlRW5naW5lRGF0YShkaXN0LCAxNSwgbnVsbCk7XG5cbiAgICBnYW1lU2VydmVyLnNldEFzTW92aW5nTm9kZShmKTtcbiAgfTtcblxuICBvbkFkZChnYW1lU2VydmVyKSB7XG4gICAgZ2FtZVNlcnZlci5nYW1lTW9kZS5ub2Rlc01vdGhlci5wdXNoKHRoaXMpOyAvLyBUZW1wb3JhcnlcbiAgfTtcblxuICBvblJlbW92ZShnYW1lU2VydmVyKSB7XG4gICAgdmFyIGluZGV4ID0gZ2FtZVNlcnZlci5nYW1lTW9kZS5ub2Rlc01vdGhlci5pbmRleE9mKHRoaXMpO1xuICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgZ2FtZVNlcnZlci5nYW1lTW9kZS5ub2Rlc01vdGhlci5zcGxpY2UoaW5kZXgsMSk7XG4gICAgfVxuICB9O1xuXG4gIHZpc2libGVDaGVjayhib3gsY2VudGVyUG9zKSB7XG4gICAgLy8gQ2hlY2tzIGlmIHRoaXMgY2VsbCBpcyB2aXNpYmxlIHRvIHRoZSBwbGF5ZXJcbiAgICB2YXIgY2VsbFNpemUgPSB0aGlzLmdldFNpemUoKTtcbiAgICB2YXIgbGVuWCA9IGNlbGxTaXplICsgYm94LndpZHRoID4+IDA7IC8vIFdpZHRoIG9mIGNlbGwgKyB3aWR0aCBvZiB0aGUgYm94IChJbnQpXG4gICAgdmFyIGxlblkgPSBjZWxsU2l6ZSArIGJveC5oZWlnaHQgPj4gMDsgLy8gSGVpZ2h0IG9mIGNlbGwgKyBoZWlnaHQgb2YgdGhlIGJveCAoSW50KVxuXG4gICAgcmV0dXJuICh0aGlzLmFicyh0aGlzLnBvc2l0aW9uLnggLSBjZW50ZXJQb3MueCkgPCBsZW5YKSAmJiAodGhpcy5hYnModGhpcy5wb3NpdGlvbi55IC0gY2VudGVyUG9zLnkpIDwgbGVuWSk7XG4gIH07XG59XG5jbGFzcyBFeHBlcmltZW50YWxWaXJ1cyBleHRlbmRzIFZpcnVze1xuICBjb25zdHJ1Y3Rvcihub2RlSWQsIG93bmVyLCBwb3NpdGlvbiwgbWFzcywgZ2FtZVNlcnZlcil7XG4gICAgc3VwZXIobm9kZUlkLCBvd25lciwgcG9zaXRpb24sIG1hc3MsIGdhbWVTZXJ2ZXIpO1xuICB9XG5cbiAgLy8gU3BlY2lhbCB2aXJ1cyBtZWNoYW5pY3NcbiAgZmVlZChmZWVkZXIsZ2FtZVNlcnZlcikge1xuICAgIGdhbWVTZXJ2ZXIucmVtb3ZlTm9kZShmZWVkZXIpO1xuICAgIC8vIFB1c2hlcyB0aGUgdmlydXNcbiAgICB0aGlzLnNldEFuZ2xlKGZlZWRlci5nZXRBbmdsZSgpKTsgLy8gU2V0IGRpcmVjdGlvbiBpZiB0aGUgdmlydXMgZXhwbG9kZXNcbiAgICB0aGlzLm1vdmVFbmdpbmVUaWNrcyA9IDU7IC8vIEFtb3VudCBvZiB0aW1lcyB0byBsb29wIHRoZSBtb3ZlbWVudCBmdW5jdGlvblxuICAgIHRoaXMubW92ZUVuZ2luZVNwZWVkID0gMzA7XG5cbiAgICB2YXIgaW5kZXggPSBnYW1lU2VydmVyLm1vdmluZ05vZGVzLmluZGV4T2YodGhpcyk7XG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICBnYW1lU2VydmVyLm1vdmluZ05vZGVzLnB1c2godGhpcyk7XG4gICAgfVxuICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9