'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get = get;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Mode = require('./Mode');

var _Mode2 = _interopRequireDefault(_Mode);

var _FFA = require('./FFA');

var _FFA2 = _interopRequireDefault(_FFA);

var _Teams = require('./Teams');

var _Teams2 = _interopRequireDefault(_Teams);

var _Experimental = require('./Experimental');

var _Experimental2 = _interopRequireDefault(_Experimental);

var _Tournament = require('./Tournament');

var _Tournament2 = _interopRequireDefault(_Tournament);

var _HungerGames = require('./HungerGames');

var _HungerGames2 = _interopRequireDefault(_HungerGames);

var _Rainbow = require('./Rainbow');

var _Rainbow2 = _interopRequireDefault(_Rainbow);

var _Debug = require('./Debug');

var _Debug2 = _interopRequireDefault(_Debug);

var _Zombie = require('./Zombie');

var _Zombie2 = _interopRequireDefault(_Zombie);

exports.Mode = _Mode2['default'];
exports.FFA = _FFA2['default'];
exports.Teams = _Teams2['default'];
exports.Experimental = _Experimental2['default'];
exports.Tournament = _Tournament2['default'];
exports.HungerGames = _HungerGames2['default'];
exports.Rainbow = _Rainbow2['default'];
exports.Debug = _Debug2['default'];
exports.Zombie = _Zombie2['default'];

function get(id) {
    var mode;
    switch (id) {
        case 1:
            mode = new _Teams2['default']();
            break;
        case 2:
            mode = new _Experimental2['default']();
            break;
        case 10:
            mode = new _Tournament2['default']();
            break;
        case 11:
            mode = new _HungerGames2['default']();
            break;
        case 12:
            mode = new _Zombie2['default']();
            break;
        case 13:
            break;
        case 14:
            break;
        case 20:
            mode = new _Rainbow2['default']();
            break;
        case 21:
            mode = new _Debug2['default']();
            break;
        default:
            mode = new _FFA2['default']();
            break;
    }
    return mode;
}

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9pbmRleC50cyJdLCJuYW1lcyI6WyJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztvQkFBeUIsUUFBUTs7OzttQkFDUixPQUFPOzs7O3FCQUNQLFNBQVM7Ozs7NEJBQ1QsZ0JBQWdCOzs7OzBCQUNoQixjQUFjOzs7OzJCQUNkLGVBQWU7Ozs7dUJBQ2YsV0FBVzs7OztxQkFDWCxTQUFTOzs7O3NCQUNULFVBQVU7Ozs7UUFJMUIsSUFBSTtRQUFFLEdBQUc7UUFBRSxLQUFLO1FBQUUsWUFBWTtRQUFFLFVBQVU7UUFBRSxXQUFXO1FBQUUsT0FBTztRQUFFLEtBQUs7UUFBRSxNQUFNOztBQUV4RixTQUFBLEdBQUEsQ0FBb0IsRUFBVSxFQUFBO0FBQzFCQSxRQUFJQSxJQUFJQSxDQUFDQTtBQUNUQSxZQUFRQSxFQUFFQTtBQUNOQSxhQUFLQSxDQUFDQTtBQUNGQSxnQkFBSUEsR0FBR0Esd0JBQVdBLENBQUNBO0FBQ25CQSxrQkFBTUE7QUFBQUEsQUFDVkEsYUFBS0EsQ0FBQ0E7QUFDRkEsZ0JBQUlBLEdBQUdBLCtCQUFrQkEsQ0FBQ0E7QUFDMUJBLGtCQUFNQTtBQUFBQSxBQUNWQSxhQUFLQSxFQUFFQTtBQUNIQSxnQkFBSUEsR0FBR0EsNkJBQWdCQSxDQUFDQTtBQUN4QkEsa0JBQU1BO0FBQUFBLEFBQ1ZBLGFBQUtBLEVBQUVBO0FBQ0hBLGdCQUFJQSxHQUFHQSw4QkFBaUJBLENBQUNBO0FBQ3pCQSxrQkFBTUE7QUFBQUEsQUFDVkEsYUFBS0EsRUFBRUE7QUFDSEEsZ0JBQUlBLEdBQUdBLHlCQUFZQSxDQUFDQTtBQUNwQkEsa0JBQU1BO0FBQUFBLEFBQ1ZBLGFBQUtBLEVBQUVBO0FBRUhBLGtCQUFNQTtBQUFBQSxBQUNWQSxhQUFLQSxFQUFFQTtBQUVIQSxrQkFBTUE7QUFBQUEsQUFDVkEsYUFBS0EsRUFBRUE7QUFDSEEsZ0JBQUlBLEdBQUdBLDBCQUFhQSxDQUFDQTtBQUNyQkEsa0JBQU1BO0FBQUFBLEFBQ1ZBLGFBQUtBLEVBQUVBO0FBQ0hBLGdCQUFJQSxHQUFHQSx3QkFBV0EsQ0FBQ0E7QUFDbkJBLGtCQUFNQTtBQUFBQSxBQUNWQTtBQUNJQSxnQkFBSUEsR0FBR0Esc0JBQVNBLENBQUNBO0FBQ2pCQSxrQkFBTUE7QUFBQUEsS0FDYkE7QUFDREEsV0FBT0EsSUFBSUEsQ0FBQ0E7Q0FDZkE7O0FBQUEsQ0FBQyIsImZpbGUiOiJnYW1lbW9kZXMvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kZSAgICAgICAgIGZyb20gJy4vTW9kZSc7XG5pbXBvcnQgRkZBICAgICAgICAgIGZyb20gJy4vRkZBJztcbmltcG9ydCBUZWFtcyAgICAgICAgZnJvbSAnLi9UZWFtcyc7XG5pbXBvcnQgRXhwZXJpbWVudGFsIGZyb20gJy4vRXhwZXJpbWVudGFsJztcbmltcG9ydCBUb3VybmFtZW50ICAgZnJvbSAnLi9Ub3VybmFtZW50JztcbmltcG9ydCBIdW5nZXJHYW1lcyAgZnJvbSAnLi9IdW5nZXJHYW1lcyc7XG5pbXBvcnQgUmFpbmJvdyAgICAgIGZyb20gJy4vUmFpbmJvdyc7XG5pbXBvcnQgRGVidWcgICAgICAgIGZyb20gJy4vRGVidWcnO1xuaW1wb3J0IFpvbWJpZSAgICAgICBmcm9tICcuL1pvbWJpZSc7XG4vL2ltcG9ydCBUZWFtWiAgICAgICAgZnJvbSAnLi9UZWFtWic7XG4vL2ltcG9ydCBUZWFtWCAgICAgICAgZnJvbSAnLi9UZWFtWCc7XG5cbmV4cG9ydCB7IE1vZGUsIEZGQSwgVGVhbXMsIEV4cGVyaW1lbnRhbCwgVG91cm5hbWVudCwgSHVuZ2VyR2FtZXMsIFJhaW5ib3csIERlYnVnLCBab21iaWV9Oy8vLCBUZWFtWiwgVGVhbVggfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldChpZDogbnVtYmVyKSB7XG4gICAgdmFyIG1vZGU7XG4gICAgc3dpdGNoIChpZCkge1xuICAgICAgICBjYXNlIDE6IC8vIFRlYW1zXG4gICAgICAgICAgICBtb2RlID0gbmV3IFRlYW1zKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOiAvLyBFeHBlcmltZW50YWxcbiAgICAgICAgICAgIG1vZGUgPSBuZXcgRXhwZXJpbWVudGFsKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMDogLy8gVG91cm5hbWVudFxuICAgICAgICAgICAgbW9kZSA9IG5ldyBUb3VybmFtZW50KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMTogLy8gSHVuZ2VyIEdhbWVzXG4gICAgICAgICAgICBtb2RlID0gbmV3IEh1bmdlckdhbWVzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMjogLy8gWm9tYmllXG4gICAgICAgICAgICBtb2RlID0gbmV3IFpvbWJpZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTM6IC8vIFpvbWJpZSBUZWFtXG4gICAgICAgICAgICAvL21vZGUgPSBuZXcgVGVhbVooKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE0OiAvLyBFeHBlcmltZW50YWwgVGVhbVxuICAgICAgICAgICAgLy9tb2RlID0gbmV3IFRlYW1YKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyMDogLy8gUmFpbmJvd1xuICAgICAgICAgICAgbW9kZSA9IG5ldyBSYWluYm93KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyMTogLy8gRGVidWdcbiAgICAgICAgICAgIG1vZGUgPSBuZXcgRGVidWcoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiAvLyBGRkEgaXMgZGVmYXVsdFxuICAgICAgICAgICAgbW9kZSA9IG5ldyBGRkEoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbW9kZTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=