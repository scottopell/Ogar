"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClearNodes = function ClearNodes() {
    _classCallCheck(this, ClearNodes);

    this.build = function () {
        var buf = new ArrayBuffer(1);
        var view = new DataView(buf);
        view.setUint8(0, 20);
        return buf;
    };
};

exports["default"] = ClearNodes;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2tldC9DbGVhck5vZGVzLnRzIl0sIm5hbWVzIjpbIkNsZWFyTm9kZXMiLCJDbGVhck5vZGVzLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFBLFVBQUEsR0FDRUEsU0FERixVQUFBLEdBQ0VBOzBCQURGLFVBQUE7O0FBSUVDLFFBQUFBLENBQUFBLEtBQUtBLEdBQUdBLFlBQUFBO0FBQ04sWUFBSSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsWUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFLN0IsWUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFckIsZUFBTyxHQUFHLENBQUM7S0FDWixDQUFBQTtDQVpBQTs7cUJBRkgsVUFBQSIsImZpbGUiOiJwYWNrZXQvQ2xlYXJOb2Rlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIENsZWFyTm9kZXN7XG4gIGNvbnN0cnVjdG9yKCl7XG4gIH1cblxuICBidWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmKTtcblxuICAgIC8vIFRPRE8gZG9jdW1lbnQgd2hhdCB0aGVzZSBhcmVcbiAgICAvLyBhbmQgd2h5IGB0cnVlYCB3YXMgaW4gdGhlcmUgYXMgdGhpcmQgcGFyYW0uLi5cbiAgICAvL3ZpZXcuc2V0VWludDgoMCwgMjAsIHRydWUpO1xuICAgIHZpZXcuc2V0VWludDgoMCwgMjApO1xuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9