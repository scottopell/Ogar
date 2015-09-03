"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddNode = (function () {
    function AddNode(item) {
        _classCallCheck(this, AddNode);

        this.item = item;
    }

    _createClass(AddNode, [{
        key: "build",
        value: function build() {
            var buf = new ArrayBuffer(5);
            var view = new DataView(buf);
            view.setUint8(0, 32);
            view.setUint32(1, this.item.nodeId, true);
            return buf;
        }
    }]);

    return AddNode;
})();

exports["default"] = AddNode;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2tldC9BZGROb2RlLnRzIl0sIm5hbWVzIjpbIkFkZE5vZGUiLCJBZGROb2RlLmNvbnN0cnVjdG9yIiwiQWRkTm9kZS5idWlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQUE7QUFFRUEsYUFGRixPQUFBLENBRWNBLElBQUlBLEVBQUFBOzhCQUZsQixPQUFBOztBQUdJQyxZQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtLQUNsQkE7O2lCQUpILE9BQUE7O2VBTU9ELGlCQUFBQTtBQUVIRSxnQkFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDN0JBLGdCQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUU3QkEsZ0JBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0FBQ3JCQSxnQkFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFFMUNBLG1CQUFPQSxHQUFHQSxDQUFDQTtTQUNaQTs7O1dBZkgsT0FBQTs7O3FCQUFBLE9BQUEiLCJmaWxlIjoicGFja2V0L0FkZE5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBZGROb2Rle1xuICBpdGVtOiBhbnk7XG4gIGNvbnN0cnVjdG9yKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW0gPSBpdGVtO1xuICB9XG5cbiAgYnVpbGQoKXtcbiAgICAvLyBPbmx5IGFkZCBwbGF5ZXIgY29udHJvbGxlZCBjZWxscyB3aXRoIHRoaXMgcGFja2V0IG9yIGl0IHdpbGwgYnVnIHRoZSBjYW1lcmFcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDUpO1xuICAgIHZhciB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1Zik7XG5cbiAgICB2aWV3LnNldFVpbnQ4KDAsIDMyKTtcbiAgICB2aWV3LnNldFVpbnQzMigxLCB0aGlzLml0ZW0ubm9kZUlkLCB0cnVlKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==