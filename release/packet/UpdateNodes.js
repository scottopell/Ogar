"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UpdateNodes = (function () {
    function UpdateNodes(destroyQueue, nodes, nonVisibleNodes) {
        _classCallCheck(this, UpdateNodes);

        this.destroyQueue = destroyQueue;
        this.nodes = nodes;
        this.nonVisibleNodes = nonVisibleNodes;
    }

    _createClass(UpdateNodes, [{
        key: "build",
        value: function build() {
            var nodesLength = 0;
            for (var i = 0; i < this.nodes.length; i++) {
                var node = this.nodes[i];
                if (typeof node == "undefined") {
                    continue;
                }
                nodesLength = nodesLength + 20 + node.getName().length * 2;
            }
            var buf = new ArrayBuffer(3 + this.destroyQueue.length * 12 + this.nonVisibleNodes.length * 4 + nodesLength + 8);
            var view = new DataView(buf);
            view.setUint8(0, 16);
            view.setUint16(1, this.destroyQueue.length, true);
            var offset = 3;
            for (var i = 0; i < this.destroyQueue.length; i++) {
                var node = this.destroyQueue[i];
                if (!node) {
                    continue;
                }
                var killer = 0;
                if (node.getKiller()) {
                    killer = node.getKiller().nodeId;
                }
                view.setUint32(offset, killer, true);
                view.setUint32(offset + 4, node.nodeId, true);
                offset += 8;
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var node = this.nodes[i];
                if (typeof node == "undefined") {
                    continue;
                }
                view.setUint32(offset, node.nodeId, true);
                view.setInt32(offset + 4, node.position.x, true);
                view.setInt32(offset + 8, node.position.y, true);
                view.setUint16(offset + 12, node.getSize(), true);
                view.setUint8(offset + 14, node.color.r);
                view.setUint8(offset + 15, node.color.g);
                view.setUint8(offset + 16, node.color.b);
                view.setUint8(offset + 17, node.spiked);
                offset += 18;
                var name = node.getName();
                if (name) {
                    for (var j = 0; j < name.length; j++) {
                        var c = name.charCodeAt(j);
                        if (c) {
                            view.setUint16(offset, c, true);
                        }
                        offset += 2;
                    }
                }
                view.setUint16(offset, 0, true);
                offset += 2;
            }
            var len = this.nonVisibleNodes.length + this.destroyQueue.length;
            view.setUint32(offset, 0, true);
            view.setUint32(offset + 4, len, true);
            offset += 8;
            for (var i = 0; i < this.destroyQueue.length; i++) {
                var node = this.destroyQueue[i];
                if (!node) {
                    continue;
                }
                view.setUint32(offset, node.nodeId, true);
                offset += 4;
            }
            for (var i = 0; i < this.nonVisibleNodes.length; i++) {
                var node = this.nonVisibleNodes[i];
                if (!node) {
                    continue;
                }
                view.setUint32(offset, node.nodeId, true);
                offset += 4;
            }
            return buf;
        }
    }]);

    return UpdateNodes;
})();

exports["default"] = UpdateNodes;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2tldC9VcGRhdGVOb2Rlcy50cyJdLCJuYW1lcyI6WyJVcGRhdGVOb2RlcyIsIlVwZGF0ZU5vZGVzLmNvbnN0cnVjdG9yIiwiVXBkYXRlTm9kZXMuYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSxXQUFBO0FBS0VBLGFBTEYsV0FBQSxDQUtjQSxZQUFZQSxFQUFFQSxLQUFLQSxFQUFFQSxlQUFlQSxFQUFBQTs4QkFMbEQsV0FBQTs7QUFNSUMsWUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0E7QUFDakNBLFlBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO0FBQ25CQSxZQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxlQUFlQSxDQUFDQTtLQUN4Q0E7O2lCQVRILFdBQUE7O2VBV09ELGlCQUFBQTtBQUVIRSxnQkFBSUEsV0FBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDcEJBLGlCQUFLQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQTtBQUMxQ0Esb0JBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBRXpCQSxvQkFBSUEsT0FBT0EsSUFBSUEsSUFBSUEsV0FBV0EsRUFBRUE7QUFDOUJBLDZCQUFTQTtpQkFDVkE7QUFFREEsMkJBQVdBLEdBQUdBLFdBQVdBLEdBQUdBLEVBQUVBLEdBQUlBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEFBQUNBLENBQUNBO2FBQzlEQTtBQUVEQSxnQkFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBSUEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsQUFBQ0EsR0FBSUEsSUFBSUEsQ0FBQ0EsZUFBZUEs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dCBjbGFzcyBVcGRhdGVOb2Rlc3tcbiAgZGVzdHJveVF1ZXVlOiBhbnk7XG4gIG5vZGVzOiBhbnk7XG4gIG5vblZpc2libGVOb2RlczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGRlc3Ryb3lRdWV1ZSwgbm9kZXMsIG5vblZpc2libGVOb2Rlcykge1xuICAgIHRoaXMuZGVzdHJveVF1ZXVlID0gZGVzdHJveVF1ZXVlO1xuICAgIHRoaXMubm9kZXMgPSBub2RlcztcbiAgICB0aGlzLm5vblZpc2libGVOb2RlcyA9IG5vblZpc2libGVOb2RlcztcbiAgfVxuXG4gIGJ1aWxkKCkge1xuICAgIC8vIENhbGN1bGF0ZSBub2RlcyBzdWIgcGFja2V0IHNpemUgYmVmb3JlIG1ha2luZyB0aGUgZGF0YSB2aWV3XG4gICAgdmFyIG5vZGVzTGVuZ3RoID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2Rlc1tpXTtcblxuICAgICAgaWYgKHR5cGVvZiBub2RlID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG5vZGVzTGVuZ3RoID0gbm9kZXNMZW5ndGggKyAyMCArIChub2RlLmdldE5hbWUoKS5sZW5ndGggKiAyKTtcbiAgICB9XG5cbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDMgKyAodGhpcy5kZXN0cm95UXVldWUubGVuZ3RoICogMTIpICsgKHRoaXMubm9uVmlzaWJsZU5vZGVzLmxlbmd0aCAqIDQpICsgbm9kZXNMZW5ndGggKyA4KTtcbiAgICB2YXIgdmlldyA9IG5ldyBEYXRhVmlldyhidWYpO1xuXG4gICAgdmlldy5zZXRVaW50OCgwLCAxNik7IC8vIFBhY2tldCBJRFxuICAgIHZpZXcuc2V0VWludDE2KDEsIHRoaXMuZGVzdHJveVF1ZXVlLmxlbmd0aCwgdHJ1ZSk7IC8vIE5vZGVzIHRvIGJlIGRlc3Ryb3llZFxuXG4gICAgdmFyIG9mZnNldCA9IDM7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRlc3Ryb3lRdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLmRlc3Ryb3lRdWV1ZVtpXTtcblxuICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIga2lsbGVyID0gMDtcbiAgICAgIGlmIChub2RlLmdldEtpbGxlcigpKSB7XG4gICAgICAgIGtpbGxlciA9IG5vZGUuZ2V0S2lsbGVyKCkubm9kZUlkO1xuICAgICAgfVxuXG4gICAgICB2aWV3LnNldFVpbnQzMihvZmZzZXQsIGtpbGxlciwgdHJ1ZSk7IC8vIEtpbGxlciBJRFxuICAgICAgdmlldy5zZXRVaW50MzIob2Zmc2V0ICsgNCwgbm9kZS5ub2RlSWQsIHRydWUpOyAvLyBOb2RlIElEXG5cbiAgICAgIG9mZnNldCArPSA4O1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xuXG4gICAgICBpZiAodHlwZW9mIG5vZGUgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmlldy5zZXRVaW50MzIob2Zmc2V0LCBub2RlLm5vZGVJZCwgdHJ1ZSk7IC8vIE5vZGUgSURcbiAgICAgIHZpZXcuc2V0SW50MzIob2Zmc2V0ICsgNCwgbm9kZS5wb3NpdGlvbi54LCB0cnVlKTsgLy8gWCBwb3NpdGlvblxuICAgICAgdmlldy5zZXRJbnQzMihvZmZzZXQgKyA4LCBub2RlLnBvc2l0aW9uLnksIHRydWUpOyAvLyBZIHBvc2l0aW9uXG4gICAgICB2aWV3LnNldFVpbnQxNihvZmZzZXQgKyAxMiwgbm9kZS5nZXRTaXplKCksIHRydWUpOyAvLyBNYXNzIGZvcm11bGE6IFJhZGl1cyAoc2l6ZSkgPSAobWFzcyAqIG1hc3MpIC8gMTAwXG4gICAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCArIDE0LCBub2RlLmNvbG9yLnIpOyAvLyBDb2xvciAoUilcbiAgICAgIHZpZXcuc2V0VWludDgob2Zmc2V0ICsgMTUsIG5vZGUuY29sb3IuZyk7IC8vIENvbG9yIChHKVxuICAgICAgdmlldy5zZXRVaW50OChvZmZzZXQgKyAxNiwgbm9kZS5jb2xvci5iKTsgLy8gQ29sb3IgKEIpXG4gICAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCArIDE3LCBub2RlLnNwaWtlZCk7IC8vIEZsYWdzXG4gICAgICBvZmZzZXQgKz0gMTg7XG5cbiAgICAgIHZhciBuYW1lID0gbm9kZS5nZXROYW1lKCk7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5hbWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgYyA9IG5hbWUuY2hhckNvZGVBdChqKTtcbiAgICAgICAgICBpZiAoYyl7XG4gICAgICAgICAgICB2aWV3LnNldFVpbnQxNihvZmZzZXQsIGMsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvZmZzZXQgKz0gMjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2aWV3LnNldFVpbnQxNihvZmZzZXQsIDAsIHRydWUpOyAvLyBFbmQgb2Ygc3RyaW5nXG4gICAgICBvZmZzZXQgKz0gMjtcbiAgICB9XG5cbiAgICB2YXIgbGVuID0gdGhpcy5ub25WaXNpYmxlTm9kZXMubGVuZ3RoICsgdGhpcy5kZXN0cm95UXVldWUubGVuZ3RoO1xuICAgIHZpZXcuc2V0VWludDMyKG9mZnNldCwgMCwgdHJ1ZSk7IC8vIEVuZFxuICAgIHZpZXcuc2V0VWludDMyKG9mZnNldCArIDQsIGxlbiwgdHJ1ZSk7IC8vICMgb2Ygbm9uLXZpc2libGUgbm9kZXMgdG8gZGVzdHJveVxuXG4gICAgb2Zmc2V0ICs9IDg7XG5cbiAgICAvLyBEZXN0cm95IHF1ZXVlICsgbm9udmlzaWJsZSBub2Rlc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kZXN0cm95UXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5kZXN0cm95UXVldWVbaV07XG5cbiAgICAgIGlmICghbm9kZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmlldy5zZXRVaW50MzIob2Zmc2V0LCBub2RlLm5vZGVJZCwgdHJ1ZSk7XG4gICAgICBvZmZzZXQgKz0gNDtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vblZpc2libGVOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vblZpc2libGVOb2Rlc1tpXTtcblxuICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2aWV3LnNldFVpbnQzMihvZmZzZXQsIG5vZGUubm9kZUlkLCB0cnVlKTtcbiAgICAgIG9mZnNldCArPSA0O1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH07XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==