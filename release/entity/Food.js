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

var Food = (function (_Cell) {
    _inherits(Food, _Cell);

    function Food(nodeId, owner, position, mass, gameServer) {
        _classCallCheck(this, Food);

        _get(Object.getPrototypeOf(Food.prototype), 'constructor', this).call(this, nodeId, owner, position, mass, gameServer);
        this.cellType = 1;
        this.size = Math.ceil(Math.sqrt(100 * this.mass));
        this.squareSize = 100 * this.mass >> 0;
    }

    _createClass(Food, [{
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
        key: 'calcMove',
        value: function calcMove() {}
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
            gameServer.currentFood--;
        }
    }, {
        key: 'onConsume',
        value: function onConsume(consumer, gameServer) {
            consumer.addMass(this.mass);
        }
    }]);

    return Food;
})(_Cell3['default']);

exports['default'] = Food;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS9Gb29kLnRzIl0sIm5hbWVzIjpbIkZvb2QiLCJGb29kLmNvbnN0cnVjdG9yIiwiRm9vZC5nZXRTaXplIiwiRm9vZC5nZXRTcXVhcmVTaXplIiwiRm9vZC5jYWxjTW92ZSIsIkZvb2Quc2VuZFVwZGF0ZSIsIkZvb2Qub25SZW1vdmUiLCJGb29kLm9uQ29uc3VtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztJQUV6QixJQUFBO2NBQUEsSUFBQTs7QUFJRUEsYUFKRixJQUFBLENBSWNBLE1BQU1BLEVBQUVBLEtBQUtBLEVBQUVBLFFBQVFBLEVBQUVBLElBQUlBLEVBQUVBLFVBQVVBLEVBQUFBOzhCQUp2RCxJQUFBOztBQUtJQyxtQ0FMSixJQUFBLDZDQUtVQSxNQUFNQSxFQUFFQSxLQUFLQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxFQUFFQSxVQUFVQSxFQUFFQTtBQUVqREEsWUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDbEJBLFlBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO0FBRWxEQSxZQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxBQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxJQUFLQSxDQUFDQSxDQUFDQTtLQUMxQ0E7O2lCQVhILElBQUE7O2VBYVNELG1CQUFBQTtBQUNMRSxtQkFBT0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7U0FDbEJBOzs7ZUFFWUYseUJBQUFBO0FBQ1hHLG1CQUFPQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtTQUN4QkE7OztlQUVPSCxvQkFBQUEsRUFFUEk7OztlQUVTSixzQkFBQUE7QUFFUkssZ0JBQUlBLElBQUlBLENBQUNBLGVBQWVBLElBQUlBLENBQUNBLEVBQUVBO0FBQzdCQSx1QkFBT0EsS0FBS0EsQ0FBQ0E7YUFDZEE7QUFDREEsbUJBQU9BLElBQUlBLENBQUNBO1NBQ2JBOzs7ZUFFT0wsa0JBQUNBLFVBQVVBLEVBQUFBO0FBQ2pCTSxzQkFBVUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7U0FDMUJBOzs7ZUFFUU4sbUJBQUNBLFFBQVFBLEVBQUNBLFVBQVVBLEVBQUFBO0FBQzNCTyxvQkFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7U0FDN0JBOzs7V0F2Q0gsSUFBQTs7O3FCQUFBLElBQUEiLCJmaWxlIjoiZW50aXR5L0Zvb2QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2VsbCBmcm9tICcuL0NlbGwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb29kIGV4dGVuZHMgQ2VsbHtcbiAgc2l6ZTogbnVtYmVyO1xuICBzcXVhcmVTaXplOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Iobm9kZUlkLCBvd25lciwgcG9zaXRpb24sIG1hc3MsIGdhbWVTZXJ2ZXIpe1xuICAgIHN1cGVyKG5vZGVJZCwgb3duZXIsIHBvc2l0aW9uLCBtYXNzLCBnYW1lU2VydmVyKTtcblxuICAgIHRoaXMuY2VsbFR5cGUgPSAxO1xuICAgIHRoaXMuc2l6ZSA9IE1hdGguY2VpbChNYXRoLnNxcnQoMTAwICogdGhpcy5tYXNzKSk7XG4gICAgLy8gbm90IGJlaW5nIGRlY2F5ZWQgLT4gY2FsY3VsYXRlIG9uZSB0aW1lXG4gICAgdGhpcy5zcXVhcmVTaXplID0gKDEwMCAqIHRoaXMubWFzcykgPj4gMDtcbiAgfVxuXG4gIGdldFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgfVxuXG4gIGdldFNxdWFyZVNpemUgKCkge1xuICAgIHJldHVybiB0aGlzLnNxdWFyZVNpemU7XG4gIH1cblxuICBjYWxjTW92ZSgpe1xuICAgIC8vbm8tb3AgRm9vZCBoYXMgbm8gbmVlZCB0byBtb3ZlXG4gIH1cblxuICBzZW5kVXBkYXRlKCkge1xuICAgIC8vIFdoZXRoZXIgb3Igbm90IHRvIGluY2x1ZGUgdGhpcyBjZWxsIGluIHRoZSB1cGRhdGUgcGFja2V0XG4gICAgaWYgKHRoaXMubW92ZUVuZ2luZVRpY2tzID09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBvblJlbW92ZShnYW1lU2VydmVyKSB7XG4gICAgZ2FtZVNlcnZlci5jdXJyZW50Rm9vZC0tO1xuICB9XG5cbiAgb25Db25zdW1lKGNvbnN1bWVyLGdhbWVTZXJ2ZXIpIHtcbiAgICBjb25zdW1lci5hZGRNYXNzKHRoaXMubWFzcyk7XG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9