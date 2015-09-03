"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UpdatePosition = (function () {
    function UpdatePosition(x, y, size) {
        _classCallCheck(this, UpdatePosition);

        this.x = x;
        this.y = y;
        this.size = size;
    }

    _createClass(UpdatePosition, [{
        key: "build",
        value: function build() {
            var buf = new ArrayBuffer(13);
            var view = new DataView(buf);
            view.setUint8(0, 17);
            view.setFloat32(1, this.x, true);
            view.setFloat32(5, this.y, true);
            view.setFloat32(9, this.size, true);
            return buf;
        }
    }]);

    return UpdatePosition;
})();

exports["default"] = UpdatePosition;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2tldC9VcGRhdGVQb3NpdGlvbi50cyJdLCJuYW1lcyI6WyJVcGRhdGVQb3NpdGlvbiIsIlVwZGF0ZVBvc2l0aW9uLmNvbnN0cnVjdG9yIiwiVXBkYXRlUG9zaXRpb24uYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSxjQUFBO0FBS0VBLGFBTEYsY0FBQSxDQUtjQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFBQTs4QkFMeEIsY0FBQTs7QUFNSUMsWUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDWEEsWUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDWEEsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7S0FDbEJBOztpQkFUSCxjQUFBOztlQVdPRCxpQkFBQUE7QUFDSEUsZ0JBQUlBLEdBQUdBLEdBQUdBLElBQUlBLFdBQVdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO0FBQzlCQSxnQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFFN0JBLGdCQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtBQUNyQkEsZ0JBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBQ2pDQSxnQkFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDakNBLGdCQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUVwQ0EsbUJBQU9BLEdBQUdBLENBQUNBO1NBQ1pBOzs7V0FyQkgsY0FBQTs7O3FCQUFBLGNBQUEiLCJmaWxlIjoicGFja2V0L1VwZGF0ZVBvc2l0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBkYXRlUG9zaXRpb257XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBzaXplOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoeCwgeSwgc2l6ZSl7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gIH1cblxuICBidWlsZCgpIHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDEzKTtcbiAgICB2YXIgdmlldyA9IG5ldyBEYXRhVmlldyhidWYpO1xuXG4gICAgdmlldy5zZXRVaW50OCgwLCAxNyk7XG4gICAgdmlldy5zZXRGbG9hdDMyKDEsIHRoaXMueCwgdHJ1ZSk7XG4gICAgdmlldy5zZXRGbG9hdDMyKDUsIHRoaXMueSwgdHJ1ZSk7XG4gICAgdmlldy5zZXRGbG9hdDMyKDksIHRoaXMuc2l6ZSwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==