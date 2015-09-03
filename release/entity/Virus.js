"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Cell2 = require('./Cell');

var _Cell3 = _interopRequireDefault(_Cell2);

var Virus = (function (_Cell) {
    _inherits(Virus, _Cell);

    function Virus(nodeId, owner, position, mass, gameServer) {
        _classCallCheck(this, Virus);

        _get(Object.getPrototypeOf(Virus.prototype), "constructor", this).call(this, nodeId, owner, position, mass, gameServer);
        this.cellType = 2;
        this.spiked = 1;
        this.fed = 0;
    }

    _createClass(Virus, [{
        key: "calcMove",
        value: function calcMove() {}
    }, {
        key: "feed",
        value: function feed(feeder, gameServer) {
            this.setAngle(feeder.getAngle());
            this.mass += feeder.mass;
            this.fed++;
            gameServer.removeNode(feeder);
            if (this.fed >= gameServer.config.virusFeedAmount) {
                this.mass = gameServer.config.virusStartMass;
                this.fed = 0;
                gameServer.shootVirus(this);
            }
        }
    }, {
        key: "getEatingRange",
        value: function getEatingRange() {
            return this.getSize() * .4;
        }
    }, {
        key: "onConsume",
        value: function onConsume(consumer, gameServer) {
            var client = consumer.owner;
            var maxSplits = Math.floor(consumer.mass / 16) - 1;
            var numSplits = gameServer.config.playerMaxCells - client.cells.length;
            numSplits = Math.min(numSplits, maxSplits);
            var splitMass = Math.min(consumer.mass / (numSplits + 1), 36);
            consumer.addMass(this.mass);
            if (numSplits <= 0) {
                return;
            }
            var bigSplits = 0;
            var endMass = consumer.mass - numSplits * splitMass;
            if (endMass > 300 && numSplits > 0) {
                bigSplits++;
                numSplits--;
            }
            if (endMass > 1200 && numSplits > 0) {
                bigSplits++;
                numSplits--;
            }
            if (endMass > 3000 && numSplits > 0) {
                bigSplits++;
                numSplits--;
            }
            var angle = 0;
            for (var k = 0; k < numSplits; k++) {
                angle += 6 / numSplits;
                gameServer.newCellVirused(client, consumer, angle, splitMass, 150);
                consumer.mass -= splitMass;
            }
            for (var k = 0; k < bigSplits; k++) {
                angle = Math.random() * 6.28;
                splitMass = consumer.mass / 4;
                gameServer.newCellVirused(client, consumer, angle, splitMass, 20);
                consumer.mass -= splitMass;
            }
            consumer.calcMergeTime(gameServer.config.playerRecombineTime);
        }
    }, {
        key: "onAdd",
        value: function onAdd(gameServer) {
            gameServer.nodesVirus.push(this);
        }
    }, {
        key: "onRemove",
        value: function onRemove(gameServer) {
            var index = gameServer.nodesVirus.indexOf(this);
            if (index != -1) {
                gameServer.nodesVirus.splice(index, 1);
            } else {
                console.log("[Warning] Tried to remove a non existing virus!");
            }
        }
    }]);

    return Virus;
})(_Cell3["default"]);

exports["default"] = Virus;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS9WaXJ1cy50cyJdLCJuYW1lcyI6WyJWaXJ1cyIsIlZpcnVzLmNvbnN0cnVjdG9yIiwiVmlydXMuY2FsY01vdmUiLCJWaXJ1cy5mZWVkIiwiVmlydXMuZ2V0RWF0aW5nUmFuZ2UiLCJWaXJ1cy5vbkNvbnN1bWUiLCJWaXJ1cy5vbkFkZCIsIlZpcnVzLm9uUmVtb3ZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0lBRXpCLEtBQUE7Y0FBQSxLQUFBOztBQUlFQSxhQUpGLEtBQUEsQ0FJY0EsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUEsVUFBVUEsRUFBQUE7OEJBSnZELEtBQUE7O0FBS0lDLG1DQUxKLEtBQUEsNkNBS1VBLE1BQU1BLEVBQUVBLEtBQUtBLEVBQUVBLFFBQVFBLEVBQUVBLElBQUlBLEVBQUVBLFVBQVVBLEVBQUVBO0FBQ2pEQSxZQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNsQkEsWUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDaEJBLFlBQUlBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO0tBQ2RBOztpQkFUSCxLQUFBOztlQVdVRCxvQkFBQUEsRUFFUEU7OztlQUVHRixjQUFDQSxNQUFNQSxFQUFDQSxVQUFVQSxFQUFBQTtBQUVwQkcsZ0JBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLENBQUNBO0FBQ2pDQSxnQkFBSUEsQ0FBQ0EsSUFBSUEsSUFBSUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7QUFDekJBLGdCQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUNYQSxzQkFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7QUFHOUJBLGdCQUFJQSxJQUFJQSxDQUFDQSxHQUFHQSxJQUFJQSxVQUFVQSxDQUFDQSxNQUFNQSxD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S0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7QUFDN0JBLHlCQUFTQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUM5QkEsMEJBQVVBLENBQUNBLGNBQWNBLENBQUNBLE1BQU1BLEVBQUVBLFFBQVFBLEVBQUVBLEtBQUtBLEVBQUVBLFNBQVNBLEVBQUNBLEVBQUVBLENBQUNBLENBQUNBO0FBQ2pFQSx3QkFBUUEsQ0FBQ0EsSUFBSUEsSUFBSUEsU0FBU0EsQ0FBQ0E7YUFDNUJBO0FBR0RBLG9CQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBO1NBQy9EQTs7O2VBRUlMLGVBQUNBLFVBQVVBLEVBQUFBO0FBQ2RNLHNCQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtTQUNsQ0E7OztlQUVPTixrQkFBQ0EsVUFBVUEsRUFBQUE7QUFDakJPLGdCQUFJQSxLQUFLQSxHQUFHQSxVQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUNoREEsZ0JBQUlBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBO0FBQ2ZBLDBCQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTthQUN4Q0EsTUFBTUE7QUFDTEEsdUJBQU9BLENBQUNBLEdBQUdBLENBQUNBLGlEQUFpREEsQ0FBQ0EsQ0FBQ0E7YUFDaEVBO1NBQ0ZBOzs7V0F0R0gsS0FBQTs7O3FCQUFBLEtBQUEiLCJmaWxlIjoiZW50aXR5L1ZpcnVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENlbGwgZnJvbSAnLi9DZWxsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlydXMgZXh0ZW5kcyBDZWxse1xuICBzcGlrZWQ6IG51bWJlcjtcbiAgZmVkOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Iobm9kZUlkLCBvd25lciwgcG9zaXRpb24sIG1hc3MsIGdhbWVTZXJ2ZXIpe1xuICAgIHN1cGVyKG5vZGVJZCwgb3duZXIsIHBvc2l0aW9uLCBtYXNzLCBnYW1lU2VydmVyKTtcbiAgICB0aGlzLmNlbGxUeXBlID0gMjtcbiAgICB0aGlzLnNwaWtlZCA9IDE7XG4gICAgdGhpcy5mZWQgPSAwO1xuICB9XG5cbiAgY2FsY01vdmUoKXtcbiAgICAvLyBuby1vcCBPbmx5IGZvciBwbGF5ZXIgY29udHJvbGxlZCBtb3ZlbWVudFxuICB9XG5cbiAgZmVlZChmZWVkZXIsZ2FtZVNlcnZlcikge1xuICAgIC8vIFNldCBkaXJlY3Rpb24gaWYgdGhlIHZpcnVzIGV4cGxvZGVzXG4gICAgdGhpcy5zZXRBbmdsZShmZWVkZXIuZ2V0QW5nbGUoKSk7XG4gICAgdGhpcy5tYXNzICs9IGZlZWRlci5tYXNzO1xuICAgIHRoaXMuZmVkKys7IC8vIEluY3JlYXNlIGZlZWQgY291bnRcbiAgICBnYW1lU2VydmVyLnJlbW92ZU5vZGUoZmVlZGVyKTtcblxuICAgIC8vIENoZWNrIGlmIHRoZSB2aXJ1cyBpcyBnb2luZyB0byBleHBsb2RlXG4gICAgaWYgKHRoaXMuZmVkID49IGdhbWVTZXJ2ZXIuY29uZmlnLnZpcnVzRmVlZEFtb3VudCkge1xuICAgICAgdGhpcy5tYXNzID0gZ2FtZVNlcnZlci5jb25maWcudmlydXNTdGFydE1hc3M7IC8vIFJlc2V0IG1hc3NcbiAgICAgIHRoaXMuZmVkID0gMDtcbiAgICAgIGdhbWVTZXJ2ZXIuc2hvb3RWaXJ1cyh0aGlzKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vIE1haW4gRnVuY3Rpb25zXG5cbiAgZ2V0RWF0aW5nUmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2l6ZSgpICogLjQ7IC8vIDAgZm9yIGVqZWN0ZWQgY2VsbHNcbiAgfVxuXG4gIG9uQ29uc3VtZShjb25zdW1lcixnYW1lU2VydmVyKSB7XG4gICAgdmFyIGNsaWVudCA9IGNvbnN1bWVyLm93bmVyO1xuXG4gICAgLy8gTWF4aW11bSBhbW91bnQgb2Ygc3BsaXRzXG4gICAgdmFyIG1heFNwbGl0cyA9IE1hdGguZmxvb3IoY29uc3VtZXIubWFzcy8xNikgLSAxO1xuICAgIC8vIEdldCBudW1iZXIgb2Ygc3BsaXRzXG4gICAgdmFyIG51bVNwbGl0cyA9IGdhbWVTZXJ2ZXIuY29uZmlnLnBsYXllck1heENlbGxzIC0gY2xpZW50LmNlbGxzLmxlbmd0aDtcbiAgICBudW1TcGxpdHMgPSBNYXRoLm1pbihudW1TcGxpdHMsIG1heFNwbGl0cyk7XG4gICAgLy8gTWF4aW11bSBzaXplIG9mIG5ldyBzcGxpdHNcbiAgICB2YXIgc3BsaXRNYXNzID0gTWF0aC5taW4oY29uc3VtZXIubWFzcy8obnVtU3BsaXRzICsgMSksIDM2KTtcblxuICAgIC8vIENlbGwgY29uc3VtZXMgbWFzcyBiZWZvcmUgc3BsaXR0aW5nXG4gICAgY29uc3VtZXIuYWRkTWFzcyh0aGlzLm1hc3MpO1xuXG4gICAgLy8gQ2VsbCBjYW5ub3Qgc3BsaXQgYW55IGZ1cnRoZXJcbiAgICBpZiAobnVtU3BsaXRzIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBCaWcgY2VsbHMgd2lsbCBzcGxpdCBpbnRvIGNlbGxzIGxhcmdlciB0aGFuIDM2IG1hc3MgKDEvNCBvZiB0aGVpciBtYXNzKVxuICAgIHZhciBiaWdTcGxpdHMgPSAwO1xuICAgIHZhciBlbmRNYXNzID0gY29uc3VtZXIubWFzcyAtIChudW1TcGxpdHMgKiBzcGxpdE1hc3MpO1xuICAgIGlmICgoZW5kTWFzcyA+IDMwMCkgJiYgKG51bVNwbGl0cyA+IDApKSB7XG4gICAgICBiaWdTcGxpdHMrKztcbiAgICAgIG51bVNwbGl0cy0tO1xuICAgIH1cbiAgICBpZiAoKGVuZE1hc3MgPiAxMjAwKSAmJiAobnVtU3BsaXRzID4gMCkpIHtcbiAgICAgIGJpZ1NwbGl0cysrO1xuICAgICAgbnVtU3BsaXRzLS07XG4gICAgfVxuICAgIGlmICgoZW5kTWFzcyA+IDMwMDApICYmIChudW1TcGxpdHMgPiAwKSkge1xuICAgICAgYmlnU3BsaXRzKys7XG4gICAgICBudW1TcGxpdHMtLTtcbiAgICB9XG5cbiAgICAvLyBTcGxpdHRpbmdcbiAgICB2YXIgYW5nbGUgPSAwOyAvLyBTdGFydGluZyBhbmdsZVxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbnVtU3BsaXRzOyBrKyspIHtcbiAgICAgIGFuZ2xlICs9IDYvbnVtU3BsaXRzOyAvLyBHZXQgZGlyZWN0aW9ucyBvZiBzcGxpdHRpbmcgY2VsbHNcbiAgICAgIGdhbWVTZXJ2ZXIubmV3Q2VsbFZpcnVzZWQoY2xpZW50LCBjb25zdW1lciwgYW5nbGUsIHNwbGl0TWFzcywxNTApO1xuICAgICAgY29uc3VtZXIubWFzcyAtPSBzcGxpdE1hc3M7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBiaWdTcGxpdHM7IGsrKykge1xuICAgICAgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogNi4yODsgLy8gUmFuZG9tIGRpcmVjdGlvbnNcbiAgICAgIHNwbGl0TWFzcyA9IGNvbnN1bWVyLm1hc3MgLyA0O1xuICAgICAgZ2FtZVNlcnZlci5uZXdDZWxsVmlydXNlZChjbGllbnQsIGNvbnN1bWVyLCBhbmdsZSwgc3BsaXRNYXNzLDIwKTtcbiAgICAgIGNvbnN1bWVyLm1hc3MgLT0gc3BsaXRNYXNzO1xuICAgIH1cblxuICAgIC8vIFByZXZlbnQgY29uc3VtZXIgY2VsbCBmcm9tIG1lcmdpbmcgd2l0aCBvdGhlciBjZWxsc1xuICAgIGNvbnN1bWVyLmNhbGNNZXJnZVRpbWUoZ2FtZVNlcnZlci5jb25maWcucGxheWVyUmVjb21iaW5lVGltZSk7XG4gIH1cblxuICBvbkFkZChnYW1lU2VydmVyKSB7XG4gICAgZ2FtZVNlcnZlci5ub2Rlc1ZpcnVzLnB1c2godGhpcyk7XG4gIH1cblxuICBvblJlbW92ZShnYW1lU2VydmVyKSB7XG4gICAgdmFyIGluZGV4ID0gZ2FtZVNlcnZlci5ub2Rlc1ZpcnVzLmluZGV4T2YodGhpcyk7XG4gICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICBnYW1lU2VydmVyLm5vZGVzVmlydXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJbV2FybmluZ10gVHJpZWQgdG8gcmVtb3ZlIGEgbm9uIGV4aXN0aW5nIHZpcnVzIVwiKTtcbiAgICB9XG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9