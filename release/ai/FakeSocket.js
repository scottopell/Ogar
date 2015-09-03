"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FakeSocket = (function () {
    function FakeSocket(gameServer) {
        _classCallCheck(this, FakeSocket);

        this.server = gameServer;
    }

    _createClass(FakeSocket, [{
        key: "sendPacket",
        value: function sendPacket(packet) {
            return;
        }
    }, {
        key: "close",
        value: function close(error) {
            var len = this.playerTracker.cells.length;
            for (var i = 0; i < len; i++) {
                var cell = this.playerTracker.cells[0];
                if (!cell) {
                    continue;
                }
                this.server.removeNode(cell);
            }
            var index = this.server.clients.indexOf(this);
            if (index != -1) {
                this.server.clients.splice(index, 1);
            }
        }
    }]);

    return FakeSocket;
})();

exports["default"] = FakeSocket;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFpL0Zha2VTb2NrZXQudHMiXSwibmFtZXMiOlsiRmFrZVNvY2tldCIsIkZha2VTb2NrZXQuY29uc3RydWN0b3IiLCJGYWtlU29ja2V0LnNlbmRQYWNrZXQiLCJGYWtlU29ja2V0LmNsb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBS0EsVUFBQTtBQUtFQSxhQUxGLFVBQUEsQ0FLY0EsVUFBVUEsRUFBQUE7OEJBTHhCLFVBQUE7O0FBTUlDLFlBQUlBLENBQUNBLE1BQU1BLEdBQUdBLFVBQVVBLENBQUNBO0tBQzFCQTs7aUJBUEgsVUFBQTs7ZUFVWUQsb0JBQUNBLE1BQU1BLEVBQUFBO0FBRWZFLG1CQUFPQTtTQUNSQTs7O2VBRUlGLGVBQUNBLEtBQUtBLEVBQUFBO0FBRVRHLGdCQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQTtBQUMxQ0EsaUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBO0FBQzVCQSxvQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFdkNBLG9CQUFJQSxDQUFDQSxJQUFJQSxFQUFFQTtBQUNUQSw2QkFBU0E7aUJBQ1ZBO0FBRURBLG9CQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTthQUM5QkE7QUFFREEsZ0JBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBQzlDQSxnQkFBSUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUE7QUFDZkEsb0JBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2FBQ3RDQTtTQUNGQTs7O1dBaENILFVBQUE7OztxQkFBQSxVQUFBIiwiZmlsZSI6ImFpL0Zha2VTb2NrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZVNlcnZlciBmcm9tICcuLi9HYW1lU2VydmVyJztcbmltcG9ydCBQbGF5ZXJUcmFja2VyIGZyb20gJy4uL1BsYXllclRyYWNrZXInO1xuaW1wb3J0IFBhY2tldEhhbmRsZXIgZnJvbSAnLi4vUGFja2V0SGFuZGxlcic7XG5cbi8vIEEgZmFrZSBzb2NrZXQgZm9yIGJvdCBwbGF5ZXJzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYWtlU29ja2V0IHtcbiAgc2VydmVyOiBHYW1lU2VydmVyO1xuICBwbGF5ZXJUcmFja2VyOiBQbGF5ZXJUcmFja2VyO1xuICBwYWNrZXRIYW5kbGVyOiBQYWNrZXRIYW5kbGVyO1xuXG4gIGNvbnN0cnVjdG9yKGdhbWVTZXJ2ZXIpe1xuICAgIHRoaXMuc2VydmVyID0gZ2FtZVNlcnZlcjtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlXG4gIHNlbmRQYWNrZXQocGFja2V0KSB7XG4gICAgLy8gRmFrZXMgc2VuZGluZyBhIHBhY2tldFxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNsb3NlKGVycm9yKSB7XG4gICAgLy8gUmVtb3ZlcyB0aGUgYm90XG4gICAgdmFyIGxlbiA9IHRoaXMucGxheWVyVHJhY2tlci5jZWxscy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGNlbGwgPSB0aGlzLnBsYXllclRyYWNrZXIuY2VsbHNbMF07XG5cbiAgICAgIGlmICghY2VsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXJ2ZXIucmVtb3ZlTm9kZShjZWxsKTtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXggPSB0aGlzLnNlcnZlci5jbGllbnRzLmluZGV4T2YodGhpcyk7XG4gICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICB0aGlzLnNlcnZlci5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=