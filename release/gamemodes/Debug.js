'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _FFA2 = require('./FFA');

var _FFA3 = _interopRequireDefault(_FFA2);

var _packetIndex = require('../packet/index');

var Packet = _interopRequireWildcard(_packetIndex);

var Debug = (function (_FFA) {
    _inherits(Debug, _FFA);

    function Debug() {
        _classCallCheck(this, Debug);

        _get(Object.getPrototypeOf(Debug.prototype), 'constructor', this).call(this);
        this.ID = 21;
        this.name = "Debug Mode";
        this.specByLeaderboard = false;
    }

    _createClass(Debug, [{
        key: 'testPath',
        value: function testPath(gameServer, player) {
            var cell = player.cells[0];
            var check = gameServer.nodesVirus[0];
            var v1 = Math.atan2(cell.position.x - player.mouse.x, cell.position.y - player.mouse.y);
            var v2 = this.getAngle(cell, check);
            var dist = this.getDist(cell, check);
            console.log(v1);
            console.log(v2);
            var inRange = Math.atan(2 * cell.getSize() / dist);
            console.log(inRange);
            if (v1 <= v2 + inRange && v1 >= v2 - inRange) {
                console.log("Collided!");
            }
        }
    }, {
        key: 'getAngle',
        value: function getAngle(c1, c2) {
            var deltaY = c1.position.y - c2.position.y;
            var deltaX = c1.position.x - c2.position.x;
            return Math.atan2(deltaX, deltaY);
        }
    }, {
        key: 'getDist',
        value: function getDist(cell, check) {
            var xd = check.position.x - cell.position.x;
            xd = xd < 0 ? xd * -1 : xd;
            var yd = check.position.y - cell.position.y;
            yd = yd < 0 ? yd * -1 : yd;
            return xd + yd;
        }
    }, {
        key: 'pressW',
        value: function pressW(gameServer, player) {
            console.log("Test:");
            this.testPath(gameServer, player);
            player.socket.sendPacket(new Packet.DrawLine(player.mouse.x, player.mouse.y));
        }
    }]);

    return Debug;
})(_FFA3['default']);

exports['default'] = Debug;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9EZWJ1Zy50cyJdLCJuYW1lcyI6WyJEZWJ1ZyIsIkRlYnVnLmNvbnN0cnVjdG9yIiwiRGVidWcudGVzdFBhdGgiLCJEZWJ1Zy5nZXRBbmdsZSIsIkRlYnVnLmdldERpc3QiLCJEZWJ1Zy5wcmVzc1ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFBZ0IsT0FBTzs7OzsyQkFDQyxpQkFBaUI7O0lBQTdCLE1BQU07O0lBRWxCLEtBQUE7Y0FBQSxLQUFBOztBQUVFQSxhQUZGLEtBQUEsR0FFRUE7OEJBRkYsS0FBQTs7QUFHSUMsbUNBSEosS0FBQSw2Q0FHWUE7QUFFUkEsWUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDYkEsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsWUFBWUEsQ0FBQ0E7QUFDekJBLFlBQUlBLENBQUNBLGlCQUFpQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7S0FDaENBOztpQkFSSCxLQUFBOztlQWFVRCxrQkFBQ0EsVUFBVUEsRUFBQ0EsTUFBTUEsRUFBQUE7QUFDeEJFLGdCQUFJQSxJQUFJQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUMzQkEsZ0JBQUlBLEtBQUtBLEdBQUdBLFVBQVVBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBRXJDQSxnQkFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFHdkZBLGdCQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxFQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtBQUNuQ0EsZ0JBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLEVBQUNBLEtBQUtBLENBQUNBLENBQUNBO0FBQ3BDQSxtQkFBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7QUFDaEJBLG1CQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtBQUVoQkEsZ0JBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEFBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLEdBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBQ25EQSxtQkFBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7QUFDckJBLGdCQUFJQSxBQUFDQSxFQUFFQSxJQUFLQSxFQUFFQSxHQUFHQSxPQUFPQSxBQUFDQSxJQUFNQSxFQUFFQSxJQUFLQSxFQUFFQSxHQUFHQSxPQUFPQSxBQUFDQSxBQUFDQSxFQUFFQTtBQUNwREEsdUJBQU9BLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO2FBQzFCQTtTQUNGQTs7O2VBRU9GLGtCQUFDQSxFQUFFQSxFQUFDQSxFQUFFQSxFQUFBQTtBQUNaRyxnQkFBSUEsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDM0NBLGdCQUFJQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUMzQ0EsbUJBQU9BLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUNBLE1BQU1BLENBQUNBLENBQUNBO1NBQ2xDQTs7O2VBRU1ILGlCQUFDQSxJQUFJQSxFQUFDQSxLQUFLQSxFQUFBQTtBQUVoQkksZ0JBQUlBLEVBQUVBLEdBQUlBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEFBQUNBLENBQUNBO0FBQzlDQSxjQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUUzQkEsZ0JBQUlBLEVBQUVBLEdBQUlBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEFBQUNBLENBQUNBO0FBQzlDQSxjQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUUzQkEsbUJBQVFBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUVBO1NBQ2xCQTs7O2VBSUtKLGdCQUFDQSxVQUFVQSxFQUFDQSxNQUFNQSxFQUFBQTtBQUV0QkssbUJBQU9BLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO0FBQ3JCQSxnQkFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsRUFBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7QUFDakNBLGtCQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUM5RUE7OztXQXhESCxLQUFBOzs7cUJBQUEsS0FBQSIsImZpbGUiOiJnYW1lbW9kZXMvRGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRkZBIGZyb20gJy4vRkZBJztcbmltcG9ydCAqIGFzIFBhY2tldCBmcm9tICcuLi9wYWNrZXQvaW5kZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1ZyBleHRlbmRzIEZGQXtcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLklEID0gMjE7XG4gICAgdGhpcy5uYW1lID0gXCJEZWJ1ZyBNb2RlXCI7XG4gICAgdGhpcy5zcGVjQnlMZWFkZXJib2FyZCA9IGZhbHNlO1xuICB9XG5cblxuICAvLyBHYW1lbW9kZSBTcGVjaWZpYyBGdW5jdGlvbnNcblxuICB0ZXN0UGF0aChnYW1lU2VydmVyLHBsYXllcikge1xuICAgIHZhciBjZWxsID0gcGxheWVyLmNlbGxzWzBdO1xuICAgIHZhciBjaGVjayA9IGdhbWVTZXJ2ZXIubm9kZXNWaXJ1c1swXTtcblxuICAgIHZhciB2MSA9IE1hdGguYXRhbjIoY2VsbC5wb3NpdGlvbi54IC0gcGxheWVyLm1vdXNlLngsY2VsbC5wb3NpdGlvbi55IC0gcGxheWVyLm1vdXNlLnkpO1xuXG4gICAgLy8gR2V0IGFuZ2xlIG9mIHZlY3RvciAoY2VsbCAtPiB2aXJ1cylcbiAgICB2YXIgdjIgPSB0aGlzLmdldEFuZ2xlKGNlbGwsY2hlY2spO1xuICAgIHZhciBkaXN0ID0gdGhpcy5nZXREaXN0KGNlbGwsY2hlY2spO1xuICAgIGNvbnNvbGUubG9nKHYxKTtcbiAgICBjb25zb2xlLmxvZyh2Mik7XG5cbiAgICB2YXIgaW5SYW5nZSA9IE1hdGguYXRhbigoMiAqIGNlbGwuZ2V0U2l6ZSgpKS9kaXN0KTsgLy8gT3Bwb3NpdGUvYWRqYWNlbnRcbiAgICBjb25zb2xlLmxvZyhpblJhbmdlKTtcbiAgICBpZiAoKHYxIDw9ICh2MiArIGluUmFuZ2UpKSAmJiAodjEgPj0gKHYyIC0gaW5SYW5nZSkpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNvbGxpZGVkIVwiKTtcbiAgICB9IFxuICB9XG5cbiAgZ2V0QW5nbGUoYzEsYzIpIHtcbiAgICB2YXIgZGVsdGFZID0gYzEucG9zaXRpb24ueSAtIGMyLnBvc2l0aW9uLnk7XG4gICAgdmFyIGRlbHRhWCA9IGMxLnBvc2l0aW9uLnggLSBjMi5wb3NpdGlvbi54O1xuICAgIHJldHVybiBNYXRoLmF0YW4yKGRlbHRhWCxkZWx0YVkpO1xuICB9XG5cbiAgZ2V0RGlzdChjZWxsLGNoZWNrKSB7XG4gICAgLy8gRmFzdGVzdCBkaXN0YW5jZSAtIEkgaGF2ZSBhIGNyYXBweSBjb21wdXRlciB0byB0ZXN0IHdpdGggOihcbiAgICB2YXIgeGQgPSAoY2hlY2sucG9zaXRpb24ueCAtIGNlbGwucG9zaXRpb24ueCk7XG4gICAgeGQgPSB4ZCA8IDAgPyB4ZCAqIC0xIDogeGQ7IC8vIE1hdGguYWJzIGlzIHNsb3dcblxuICAgIHZhciB5ZCA9IChjaGVjay5wb3NpdGlvbi55IC0gY2VsbC5wb3NpdGlvbi55KTtcbiAgICB5ZCA9IHlkIDwgMCA/IHlkICogLTEgOiB5ZDsgLy8gTWF0aC5hYnMgaXMgc2xvd1xuXG4gICAgcmV0dXJuICh4ZCArIHlkKTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlXG5cbiAgcHJlc3NXKGdhbWVTZXJ2ZXIscGxheWVyKSB7XG4gICAgLy8gQ2FsbGVkIHdoZW4gdGhlIFEga2V5IGlzIHByZXNzZWRcbiAgICBjb25zb2xlLmxvZyhcIlRlc3Q6XCIpO1xuICAgIHRoaXMudGVzdFBhdGgoZ2FtZVNlcnZlcixwbGF5ZXIpO1xuICAgIHBsYXllci5zb2NrZXQuc2VuZFBhY2tldChuZXcgUGFja2V0LkRyYXdMaW5lKHBsYXllci5tb3VzZS54LHBsYXllci5tb3VzZS55KSk7XG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9