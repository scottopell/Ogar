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

var FoodUp = require('../entity/Food').prototype.sendUpdate;

var Rainbow = (function (_FFA) {
    _inherits(Rainbow, _FFA);

    function Rainbow() {
        _classCallCheck(this, Rainbow);

        _get(Object.getPrototypeOf(Rainbow.prototype), 'constructor', this).call(this);
        this.ID = 20;
        this.name = "Rainbow FFA";
        this.specByLeaderboard = true;
        this.colors = [{ 'r': 255, 'g': 0, 'b': 0 }, { 'r': 255, 'g': 32, 'b': 0 }, { 'r': 255, 'g': 64, 'b': 0 }, { 'r': 255, 'g': 96, 'b': 0 }, { 'r': 255, 'g': 128, 'b': 0 }, { 'r': 255, 'g': 160, 'b': 0 }, { 'r': 255, 'g': 192, 'b': 0 }, { 'r': 255, 'g': 224, 'b': 0 }, { 'r': 255, 'g': 255, 'b': 0 }, { 'r': 192, 'g': 255, 'b': 0 }, { 'r': 128, 'g': 255, 'b': 0 }, { 'r': 64, 'g': 255, 'b': 0 }, { 'r': 0, 'g': 255, 'b': 0 }, { 'r': 0, 'g': 192, 'b': 64 }, { 'r': 0, 'g': 128, 'b': 128 }, { 'r': 0, 'g': 64, 'b': 192 }, { 'r': 0, 'g': 0, 'b': 255 }, { 'r': 18, 'g': 0, 'b': 192 }, { 'r': 37, 'g': 0, 'b': 128 }, { 'r': 56, 'g': 0, 'b': 64 }, { 'r': 75, 'g': 0, 'b': 130 }, { 'r': 92, 'g': 0, 'b': 161 }, { 'r': 109, 'g': 0, 'b': 192 }, { 'r': 126, 'g': 0, 'b': 223 }, { 'r': 143, 'g': 0, 'b': 255 }, { 'r': 171, 'g': 0, 'b': 192 }, { 'r': 199, 'g': 0, 'b': 128 }, { 'r': 227, 'g': 0, 'b': 64 }];
        this.colorsLength = this.colors.length - 1;
        this.speed = 1;
    }

    _createClass(Rainbow, [{
        key: 'changeColor',
        value: function changeColor(node) {
            if (typeof node.rainbow == 'undefined') {
                node.rainbow = Math.floor(Math.random() * this.colors.length);
            }
            if (node.rainbow >= this.colorsLength) {
                node.rainbow = 0;
            }
            node.color = this.colors[node.rainbow];
            node.rainbow += this.speed;
        }
    }, {
        key: 'onServerInit',
        value: function onServerInit() {
            _entityIndex.Food.prototype.sendUpdate = function () {
                return true;
            };
        }
    }, {
        key: 'onChange',
        value: function onChange() {
            _entityIndex.Food.prototype.sendUpdate = FoodUp;
        }
    }, {
        key: 'onTick',
        value: function onTick(gameServer) {
            var color, node;
            for (var i in gameServer.nodes) {
                node = gameServer.nodes[i];
                if (!node) {
                    continue;
                }
                this.changeColor(node);
            }
        }
    }]);

    return Rainbow;
})(_FFA3['default']);

exports['default'] = Rainbow;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9SYWluYm93LnRzIl0sIm5hbWVzIjpbIlJhaW5ib3ciLCJSYWluYm93LmNvbnN0cnVjdG9yIiwiUmFpbmJvdy5jaGFuZ2VDb2xvciIsIlJhaW5ib3cub25TZXJ2ZXJJbml0IiwiUmFpbmJvdy5vbkNoYW5nZSIsIlJhaW5ib3cub25UaWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUFnQixPQUFPOzs7OzJCQUNKLGlCQUFpQjs7QUFFcEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzs7SUFFNUQsT0FBQTtjQUFBLE9BQUE7O0FBS0VBLGFBTEYsT0FBQSxHQUtFQTs4QkFMRixPQUFBOztBQU1JQyxtQ0FOSixPQUFBLDZDQU1ZQTtBQUVSQSxZQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUNiQSxZQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxhQUFhQSxDQUFDQTtBQUMxQkEsWUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxJQUFJQSxDQUFDQTtBQUU5QkEsWUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FDZEEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsRUFBRUEsRUFBQ0EsQ0FDMUJBLENBQUNBO0FBQ0ZBLFlBQUlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUVBLENBQUNBLENBQUNBO0FBQzFDQSxZQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQTtLQUVoQkE7O2lCQTdDSCxPQUFBOztlQWlEYUQscUJBQUNBLElBQUlBLEVBQUFBO0FBQ2RFLGdCQUFJQSxPQUFPQSxJQUFJQSxDQUFDQSxPQUFPQSxJQUFJQSxXQUFXQSxFQUFFQTtBQUN0Q0Esb0JBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2FBQy9EQTtBQUVEQSxnQkFBSUEsSUFBSUEsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUE7QUFDckNBLG9CQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQTthQUNsQkE7QUFFREEsZ0JBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO0FBQ3ZDQSxnQkFBSUEsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7U0FDNUJBOzs7ZUFJV0Ysd0JBQUFBO0FBRVZHLDhCQUFLQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxZQUFBQTtBQUFZLHVCQUFPLElBQUksQ0FBQzthQUFDLENBQUNBO1NBQ3ZEQTs7O2VBRU9ILG9CQUFBQTtBQUVOSSw4QkFBS0EsU0FBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsTUFBTUEsQ0FBQ0E7U0FDcENBOzs7ZUFFS0osZ0JBQUNBLFVBQVVBLEVBQUFBO0FBQ2ZLLGdCQUFJQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQTtBQUVoQkEsaUJBQUtBLElBQUlBLENBQUNBLElBQUlBLFVBQVVBLENBQUNBLEtBQUtBLEVBQUVBO0FBQzlCQSxvQkFBSUEsR0FBR0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFM0JBLG9CQUFJQSxDQUFDQSxJQUFJQSxFQUFFQTtBQUNUQSw2QkFBU0E7aUJBQ1ZBO0FBRURBLG9CQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTthQUN4QkE7U0FDRkE7OztXQXRGSCxPQUFBOzs7cUJBQUEsT0FBQSIsImZpbGUiOiJnYW1lbW9kZXMvUmFpbmJvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBGRkEgZnJvbSAnLi9GRkEnO1xuaW1wb3J0IHtGb29kfSBmcm9tICcuLi9lbnRpdHkvaW5kZXgnO1xuaW1wb3J0IHtDb2xvcn0gZnJvbSAnLi4vSGVscGVyRGVmcy9pbmRleCc7XG52YXIgRm9vZFVwID0gcmVxdWlyZSgnLi4vZW50aXR5L0Zvb2QnKS5wcm90b3R5cGUuc2VuZFVwZGF0ZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFpbmJvdyBleHRlbmRzIEZGQXtcbiAgY29sb3JzOiBDb2xvcltdO1xuICBjb2xvcnNMZW5ndGg6IG51bWJlcjtcbiAgc3BlZWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLklEID0gMjA7XG4gICAgdGhpcy5uYW1lID0gXCJSYWluYm93IEZGQVwiO1xuICAgIHRoaXMuc3BlY0J5TGVhZGVyYm9hcmQgPSB0cnVlO1xuXG4gICAgdGhpcy5jb2xvcnMgPSBbXG4gICAgeydyJzoyNTUsICdnJzogIDAsICdiJzogIDB9LCAvLyBSZWRcbiAgICB7J3InOjI1NSwgJ2cnOiAzMiwgJ2InOiAgMH0sXG4gICAgeydyJzoyNTUsICdnJzogNjQsICdiJzogIDB9LFxuICAgIHsncic6MjU1LCAnZyc6IDk2LCAnYic6ICAwfSxcbiAgICB7J3InOjI1NSwgJ2cnOjEyOCwgJ2InOiAgMH0sIC8vIE9yYW5nZVxuICAgIHsncic6MjU1LCAnZyc6MTYwLCAnYic6ICAwfSxcbiAgICB7J3InOjI1NSwgJ2cnOjE5MiwgJ2InOiAgMH0sXG4gICAgeydyJzoyNTUsICdnJzoyMjQsICdiJzogIDB9LFxuICAgIHsncic6MjU1LCAnZyc6MjU1LCAnYic6ICAwfSwgLy8gWWVsbG93XG4gICAgeydyJzoxOTIsICdnJzoyNTUsICdiJzogIDB9LFxuICAgIHsncic6MTI4LCAnZyc6MjU1LCAnYic6ICAwfSxcbiAgICB7J3InOiA2NCwgJ2cnOjI1NSwgJ2InOiAgMH0sXG4gICAgeydyJzogIDAsICdnJzoyNTUsICdiJzogIDB9LCAvLyBHcmVlblxuICAgIHsncic6ICAwLCAnZyc6MTkyLCAnYic6IDY0fSxcbiAgICB7J3InOiAgMCwgJ2cnOjEyOCwgJ2InOjEyOH0sXG4gICAgeydyJzogIDAsICdnJzogNjQsICdiJzoxOTJ9LFxuICAgIHsncic6ICAwLCAnZyc6ICAwLCAnYic6MjU1fSwgLy8gQmx1ZVxuICAgIHsncic6IDE4LCAnZyc6ICAwLCAnYic6MTkyfSxcbiAgICB7J3InOiAzNywgJ2cnOiAgMCwgJ2InOjEyOH0sXG4gICAgeydyJzogNTYsICdnJzogIDAsICdiJzogNjR9LFxuICAgIHsncic6IDc1LCAnZyc6ICAwLCAnYic6MTMwfSwgLy8gSW5kaWdvXG4gICAgeydyJzogOTIsICdnJzogIDAsICdiJzoxNjF9LFxuICAgIHsncic6MTA5LCAnZyc6ICAwLCAnYic6MTkyfSxcbiAgICB7J3InOjEyNiwgJ2cnOiAgMCwgJ2InOjIyM30sXG4gICAgeydyJzoxNDMsICdnJzogIDAsICdiJzoyNTV9LCAvLyBQdXJwbGVcbiAgICB7J3InOjE3MSwgJ2cnOiAgMCwgJ2InOjE5Mn0sXG4gICAgeydyJzoxOTksICdnJzogIDAsICdiJzoxMjh9LFxuICAgIHsncic6MjI3LCAnZyc6ICAwLCAnYic6IDY0fSxcbiAgICBdO1xuICAgIHRoaXMuY29sb3JzTGVuZ3RoID0gdGhpcy5jb2xvcnMubGVuZ3RoIC0xO1xuICAgIHRoaXMuc3BlZWQgPSAxOyAvLyBTcGVlZCBvZiBjb2xvciBjaGFuZ2VcblxuICB9XG5cbiAgLy8gR2FtZW1vZGUgU3BlY2lmaWMgRnVuY3Rpb25zXG5cbiAgY2hhbmdlQ29sb3Iobm9kZSkge1xuICAgIGlmICh0eXBlb2Ygbm9kZS5yYWluYm93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICBub2RlLnJhaW5ib3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbG9ycy5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChub2RlLnJhaW5ib3cgPj0gdGhpcy5jb2xvcnNMZW5ndGgpIHtcbiAgICAgIG5vZGUucmFpbmJvdyA9IDA7XG4gICAgfVxuXG4gICAgbm9kZS5jb2xvciA9IHRoaXMuY29sb3JzW25vZGUucmFpbmJvd107XG4gICAgbm9kZS5yYWluYm93ICs9IHRoaXMuc3BlZWQ7XG4gIH1cblxuICAvLyBPdmVycmlkZVxuXG4gIG9uU2VydmVySW5pdCgpIHtcbiAgICAvLyBPdmVycmlkZXMgdGhlIHVwZGF0ZSBmdW5jdGlvblxuICAgIEZvb2QucHJvdG90eXBlLnNlbmRVcGRhdGUgPSBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9O1xuICB9XG5cbiAgb25DaGFuZ2UoKSB7XG4gICAgLy8gUmVzZXRcbiAgICBGb29kLnByb3RvdHlwZS5zZW5kVXBkYXRlID0gRm9vZFVwO1xuICB9XG5cbiAgb25UaWNrKGdhbWVTZXJ2ZXIpIHtcbiAgICB2YXIgY29sb3IsIG5vZGU7XG4gICAgLy8gQ2hhbmdlIGNvbG9yXG4gICAgZm9yICh2YXIgaSBpbiBnYW1lU2VydmVyLm5vZGVzKSB7XG4gICAgICBub2RlID0gZ2FtZVNlcnZlci5ub2Rlc1tpXTtcblxuICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNoYW5nZUNvbG9yKG5vZGUpO1xuICAgIH1cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9