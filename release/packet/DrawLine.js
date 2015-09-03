"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DrawLine = (function () {
    function DrawLine(x, y) {
        _classCallCheck(this, DrawLine);

        this.x = x;
        this.y = y;
    }

    _createClass(DrawLine, [{
        key: "build",
        value: function build() {
            var buf = new ArrayBuffer(5);
            var view = new DataView(buf);
            view.setUint8(0, 21);
            view.setUint16(1, this.x, true);
            view.setUint16(3, this.y, true);
            return buf;
        }
    }]);

    return DrawLine;
})();

exports["default"] = DrawLine;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2tldC9EcmF3TGluZS50cyJdLCJuYW1lcyI6WyJEcmF3TGluZSIsIkRyYXdMaW5lLmNvbnN0cnVjdG9yIiwiRHJhd0xpbmUuYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSxRQUFBO0FBSUVBLGFBSkYsUUFBQSxDQUljQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFBQTs4QkFKbEIsUUFBQTs7QUFLSUMsWUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDWEEsWUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7S0FDWkE7O2lCQVBILFFBQUE7O2VBU09ELGlCQUFBQTtBQUNIRSxnQkFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDN0JBLGdCQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUU3QkEsZ0JBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0FBQ3JCQSxnQkFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDaENBLGdCQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUVoQ0EsbUJBQU9BLEdBQUdBLENBQUNBO1NBQ1pBOzs7V0FsQkgsUUFBQTs7O3FCQUFBLFFBQUEiLCJmaWxlIjoicGFja2V0L0RyYXdMaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhd0xpbmV7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHgsIHkpe1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIGJ1aWxkKCl7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcig1KTtcbiAgICB2YXIgdmlldyA9IG5ldyBEYXRhVmlldyhidWYpO1xuXG4gICAgdmlldy5zZXRVaW50OCgwLCAyMSk7XG4gICAgdmlldy5zZXRVaW50MTYoMSwgdGhpcy54LCB0cnVlKTtcbiAgICB2aWV3LnNldFVpbnQxNigzLCB0aGlzLnksIHRydWUpO1xuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9