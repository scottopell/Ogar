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

var EjectedMass = (function (_Cell) {
    _inherits(EjectedMass, _Cell);

    function EjectedMass(nodeId, owner, position, mass, gameServer) {
        _classCallCheck(this, EjectedMass);

        _get(Object.getPrototypeOf(EjectedMass.prototype), 'constructor', this).call(this, nodeId, owner, position, mass, gameServer);
        this.calcMove = function () {};
        this.cellType = 3;
        this.size = Math.ceil(Math.sqrt(100 * this.mass));
        this.squareSize = 100 * this.mass >> 0;
    }

    _createClass(EjectedMass, [{
        key: 'getSize',
        value: function getSize() {
            return this.size;
        }
    }, {
        key: 'getSquareSize',
        value: function getSquareSize() {
            return this.squareSize;
        }
    }, {
        key: 'sendUpdate',
        value: function sendUpdate() {
            if (this.moveEngineTicks == 0) {
                return false;
            }
            return true;
        }
    }, {
        key: 'onRemove',
        value: function onRemove(gameServer) {
            var index = gameServer.nodesEjected.indexOf(this);
            if (index != -1) {
                gameServer.nodesEjected.splice(index, 1);
            }
        }
    }, {
        key: 'onConsume',
        value: function onConsume(consumer, gameServer) {
            consumer.addMass(this.mass);
        }
    }, {
        key: 'onAutoMove',
        value: function onAutoMove(gameServer) {
            if (gameServer.nodesVirus.length < gameServer.config.virusMaxAmount) {
                var v = gameServer.getNearestVirus(this);
                if (v) {
                    v.feed(this, gameServer);
                    return true;
                }
            }
        }
    }, {
        key: 'moveDone',
        value: function moveDone(gameServer) {
            if (!this.onAutoMove(gameServer)) {
                gameServer.nodesEjected.push(this);
            }
        }
    }]);

    return EjectedMass;
})(_Cell3['default']);

exports['default'] = EjectedMass;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS9FamVjdGVkTWFzcy50cyJdLCJuYW1lcyI6WyJFamVjdGVkTWFzcyIsIkVqZWN0ZWRNYXNzLmNvbnN0cnVjdG9yIiwiRWplY3RlZE1hc3MuZ2V0U2l6ZSIsIkVqZWN0ZWRNYXNzLmdldFNxdWFyZVNpemUiLCJFamVjdGVkTWFzcy5zZW5kVXBkYXRlIiwiRWplY3RlZE1hc3Mub25SZW1vdmUiLCJFamVjdGVkTWFzcy5vbkNvbnN1bWUiLCJFamVjdGVkTWFzcy5vbkF1dG9Nb3ZlIiwiRWplY3RlZE1hc3MubW92ZURvbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWlCLFFBQVE7Ozs7SUFFekIsV0FBQTtjQUFBLFdBQUE7O0FBSUVBLGFBSkYsV0FBQSxDQUljQSxNQUFNQSxFQUFFQSxLQUFLQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxFQUFFQSxVQUFVQSxFQUFBQTs4QkFKdkQsV0FBQTs7QUFLSUMsbUNBTEosV0FBQSw2Q0FLVUEsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUEsVUFBVUEsRUFBRUE7QUFnQm5EQSxZQUFBQSxDQUFBQSxRQUFRQSxHQUFHQSxZQUFBQSxFQUVWLENBQUFBO0FBaEJDQSxZQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNsQkEsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFbERBLFlBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEFBQUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLElBQUtBLENBQUNBLENBQUNBO0tBQzFDQTs7aUJBWEgsV0FBQTs7ZUFhU0QsbUJBQUFBO0FBQ0xFLG1CQUFPQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtTQUNsQkE7OztlQUVZRix5QkFBQUE7QUFDWEcsbUJBQU9BLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1NBQ3hCQTs7O2VBU1NILHNCQUFBQTtBQUVSSSxnQkFBSUEsSUFBSUEsQ0FBQ0EsZUFBZUEsSUFBSUEsQ0FBQ0EsRUFBRUE7QUFDN0JBLHVCQUFPQSxLQUFLQSxDQUFDQTthQUNkQTtBQUNEQSxtQkFBT0EsSUFBSUEsQ0FBQ0E7U0FDYkE7OztlQUVPSixrQkFBQ0EsVUFBVUEsRUFBQUE7QUFFakJLLGdCQUFJQSxLQUFLQSxHQUFHQSxVQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUNsREEsZ0JBQUlBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBO0FBQ2ZBLDBCQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxFQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTthQUN6Q0E7U0FDRkE7OztlQUVRTCxtQkFBQ0EsUUFBUUEsRUFBQ0EsVUFBVUEsRUFBQUE7QUFFM0JNLG9CQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtTQUM3QkE7OztlQUVTTixvQkFBQ0EsVUFBVUEsRUFBQUE7QUFDbkJPLGdCQUFJQSxVQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxHQUFHQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxFQUFFQTtBQUVuRUEsb0JBQUlBLENBQUNBLEdBQUdBLFVBQVVBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBQ3pDQSxvQkFBSUEsQ0FBQ0EsRUFBRUE7QUFDTEEscUJBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUNBLFVBQVVBLENBQUNBLENBQUNBO0FBQ3hCQSwyQkFBT0EsSUFBSUEsQ0FBQ0E7aUJBQ2JBO2FBQ0ZBO1NBQ0ZBOzs7ZUFFT1Asa0JBQUNBLFVBQVVBLEVBQUFBO0FBQ2pCUSxnQkFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUE7QUFDaENBLDBCQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTthQUNwQ0E7U0FDRkE7OztXQWhFSCxXQUFBOzs7cUJBQUEsV0FBQSIsImZpbGUiOiJlbnRpdHkvRWplY3RlZE1hc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2VsbCBmcm9tICcuL0NlbGwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFamVjdGVkTWFzcyBleHRlbmRzIENlbGwge1xuICBzaXplOiBudW1iZXI7XG4gIHNxdWFyZVNpemU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihub2RlSWQsIG93bmVyLCBwb3NpdGlvbiwgbWFzcywgZ2FtZVNlcnZlcil7XG4gICAgc3VwZXIobm9kZUlkLCBvd25lciwgcG9zaXRpb24sIG1hc3MsIGdhbWVTZXJ2ZXIpO1xuXG4gICAgdGhpcy5jZWxsVHlwZSA9IDM7XG4gICAgdGhpcy5zaXplID0gTWF0aC5jZWlsKE1hdGguc3FydCgxMDAgKiB0aGlzLm1hc3MpKTtcbiAgICAvLyBub3QgYmVpbmcgZGVjYXllZCAtPiBjYWxjdWxhdGUgb25lIHRpbWVcbiAgICB0aGlzLnNxdWFyZVNpemUgPSAoMTAwICogdGhpcy5tYXNzKSA+PiAwO1xuICB9XG5cbiAgZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaXplO1xuICB9XG5cbiAgZ2V0U3F1YXJlU2l6ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3F1YXJlU2l6ZTtcbiAgfVxuXG4gIGNhbGNNb3ZlID0gZnVuY3Rpb24oKXtcbiAgICAvL25vLW9wXG4gIH1cblxuXG4gIC8vIE1haW4gRnVuY3Rpb25zXG5cbiAgc2VuZFVwZGF0ZSgpIHtcbiAgICAvLyBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIHRoaXMgY2VsbCBpbiB0aGUgdXBkYXRlIHBhY2tldFxuICAgIGlmICh0aGlzLm1vdmVFbmdpbmVUaWNrcyA9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgb25SZW1vdmUoZ2FtZVNlcnZlcikge1xuICAgIC8vIFJlbW92ZSBmcm9tIGxpc3Qgb2YgZWplY3RlZCBtYXNzXG4gICAgdmFyIGluZGV4ID0gZ2FtZVNlcnZlci5ub2Rlc0VqZWN0ZWQuaW5kZXhPZih0aGlzKTtcbiAgICBpZiAoaW5kZXggIT0gLTEpIHtcbiAgICAgIGdhbWVTZXJ2ZXIubm9kZXNFamVjdGVkLnNwbGljZShpbmRleCwxKTtcbiAgICB9XG4gIH1cblxuICBvbkNvbnN1bWUoY29uc3VtZXIsZ2FtZVNlcnZlcikge1xuICAgIC8vIEFkZHMgbWFzcyB0byBjb25zdW1lclxuICAgIGNvbnN1bWVyLmFkZE1hc3ModGhpcy5tYXNzKTtcbiAgfVxuXG4gIG9uQXV0b01vdmUoZ2FtZVNlcnZlcikge1xuICAgIGlmIChnYW1lU2VydmVyLm5vZGVzVmlydXMubGVuZ3RoIDwgZ2FtZVNlcnZlci5jb25maWcudmlydXNNYXhBbW91bnQpIHtcbiAgICAgIC8vIENoZWNrIGZvciB2aXJ1c2VzXG4gICAgICB2YXIgdiA9IGdhbWVTZXJ2ZXIuZ2V0TmVhcmVzdFZpcnVzKHRoaXMpO1xuICAgICAgaWYgKHYpIHsgLy8gRmVlZHMgdGhlIHZpcnVzIGlmIGl0IGV4aXN0c1xuICAgICAgICB2LmZlZWQodGhpcyxnYW1lU2VydmVyKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbW92ZURvbmUoZ2FtZVNlcnZlcikge1xuICAgIGlmICghdGhpcy5vbkF1dG9Nb3ZlKGdhbWVTZXJ2ZXIpKSB7XG4gICAgICBnYW1lU2VydmVyLm5vZGVzRWplY3RlZC5wdXNoKHRoaXMpO1xuICAgIH1cbiAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=