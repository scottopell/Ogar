"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mode = (function () {
    function Mode() {
        _classCallCheck(this, Mode);

        this.ID = -1;
        this.name = "Blank";
        this.decayMod = 1.0;
        this.packetLB = 49;
        this.haveTeams = false;
        this.specByLeaderboard = false;
    }

    _createClass(Mode, [{
        key: "onServerInit",
        value: function onServerInit(gameServer) {
            gameServer.run = true;
        }
    }, {
        key: "onTick",
        value: function onTick(gameServer) {}
    }, {
        key: "onChange",
        value: function onChange(gameServer) {}
    }, {
        key: "onPlayerInit",
        value: function onPlayerInit(player) {}
    }, {
        key: "onPlayerSpawn",
        value: function onPlayerSpawn(gameServer, player) {
            player.color = gameServer.getRandomColor();
            gameServer.spawnPlayer(player, null, null);
        }
    }, {
        key: "pressQ",
        value: function pressQ(gameServer, player) {
            if (player.spectate) {
                gameServer.switchSpectator(player);
            }
        }
    }, {
        key: "pressW",
        value: function pressW(gameServer, player) {
            gameServer.ejectMass(player);
        }
    }, {
        key: "pressSpace",
        value: function pressSpace(gameServer, player) {
            gameServer.splitCells(player);
        }
    }, {
        key: "onCellAdd",
        value: function onCellAdd(cell) {}
    }, {
        key: "onCellRemove",
        value: function onCellRemove(cell) {}
    }, {
        key: "onCellMove",
        value: function onCellMove(x1, y1, cell) {}
    }, {
        key: "updateLB",
        value: function updateLB(gameServer) {}
    }]);

    return Mode;
})();

exports["default"] = Mode;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9Nb2RlLnRzIl0sIm5hbWVzIjpbIk1vZGUiLCJNb2RlLmNvbnN0cnVjdG9yIiwiTW9kZS5vblNlcnZlckluaXQiLCJNb2RlLm9uVGljayIsIk1vZGUub25DaGFuZ2UiLCJNb2RlLm9uUGxheWVySW5pdCIsIk1vZGUub25QbGF5ZXJTcGF3biIsIk1vZGUucHJlc3NRIiwiTW9kZS5wcmVzc1ciLCJNb2RlLnByZXNzU3BhY2UiLCJNb2RlLm9uQ2VsbEFkZCIsIk1vZGUub25DZWxsUmVtb3ZlIiwiTW9kZS5vbkNlbGxNb3ZlIiwiTW9kZS51cGRhdGVMQiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUdBLElBQUE7QUFjRUEsYUFkRixJQUFBLEdBY0VBOzhCQWRGLElBQUE7O0FBZUlDLFlBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO0FBQ2JBLFlBQUlBLENBQUNBLElBQUlBLEdBQUdBLE9BQU9BLENBQUNBO0FBQ3BCQSxZQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQTtBQUNwQkEsWUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDbkJBLFlBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO0FBQ3ZCQSxZQUFJQSxDQUFDQSxpQkFBaUJBLEdBQUdBLEtBQUtBLENBQUNBO0tBQ2hDQTs7aUJBckJILElBQUE7O2VBdUJjRCxzQkFBQ0EsVUFBc0JBLEVBQUFBO0FBRWpDRSxzQkFBVUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0E7U0FDdkJBOzs7ZUFFS0YsZ0JBQUNBLFVBQXNCQSxFQUFBQSxFQUU1Qkc7OztlQUVPSCxrQkFBQ0EsVUFBc0JBLEVBQUFBLEVBRTlCSTs7O2VBRVdKLHNCQUFDQSxNQUFxQkEsRUFBQUEsRUFFakNLOzs7ZUFFWUwsdUJBQUNBLFVBQXNCQSxFQUFFQSxNQUFxQkEsRUFBQUE7QUFFdkRNLGtCQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxVQUFVQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtBQUMzQ0Esc0JBQVVBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1NBQzlDQTs7O2VBRUtOLGdCQUFDQSxVQUFzQkEsRUFBRUEsTUFBcUJBLEVBQUFBO0FBRWhETyxnQkFBSUEsTUFBTUEsQ0FBQ0EsUUFBUUEsRUFBRUE7QUFDakJBLDBCQUFVQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTthQUN0Q0E7U0FDSkE7OztlQUVLUCxnQkFBQ0EsVUFBc0JBLEVBQUVBLE1BQXFCQSxFQUFBQTtBQUVoRFEsc0JBQVVBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1NBQ2hDQTs7O2VBRVNSLG9CQUFDQSxVQUFzQkEsRUFBRUEsTUFBcUJBLEVBQUFBO0FBRXBEUyxzQkFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7U0FDakNBOzs7ZUFFUVQsbUJBQUNBLElBQW1CQSxFQUFBQSxFQUU1QlU7OztlQUVXVixzQkFBQ0EsSUFBbUJBLEVBQUFBLEVBRS9CVzs7O2VBRVNYLG9CQUFDQSxFQUFVQSxFQUFFQSxFQUFVQSxFQUFFQSxJQUFtQkEsRUFBQUEsRUFFckRZOzs7ZUFFT1osa0JBQUNBLFVBQXNCQSxFQUFBQSxFQUU5QmE7OztXQTdFSCxJQUFBOzs7cUJBQUEsSUFBQSIsImZpbGUiOiJnYW1lbW9kZXMvTW9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHYW1lU2VydmVyIGZyb20gJy4uL0dhbWVTZXJ2ZXInXG5pbXBvcnQgUGxheWVyVHJhY2tlciBmcm9tICcuLi9QbGF5ZXJUcmFja2VyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RlIHtcbiAgSUQ6IG51bWJlcjtcbiAgbmFtZTogc3RyaW5nO1xuICAvLyBNb2RpZmllciBmb3IgZGVjYXkgcmF0ZSAobXVsdGlwbGllcilcbiAgZGVjYXlNb2Q6IG51bWJlcjtcbiAgLy8gUGFja2V0IGlkIGZvciBsZWFkZXJib2FyZCBwYWNrZXQgKDQ4ID0gVGV4dCBMaXN0LCA0OSA9IExpc3QsIDUwID0gUGllIGNoYXJ0KVxuICBwYWNrZXRMQjogbnVtYmVyO1xuICAvLyBUcnVlID0gZ2FtZW1vZGUgdXNlcyB0ZWFtcywgZmFsc2UgPSBnYW1lbW9kZSBkb2VzbnQgdXNlIHRlYW1zXG4gIGhhdmVUZWFtczogYm9vbGVhbjtcbiAgLy8gZmFsc2UgPSBzcGVjdGF0ZSBmcm9tIHBsYXllciBsaXN0IGluc3RlYWQgb2YgbGVhZGVyYm9hcmRcbiAgc3BlY0J5TGVhZGVyYm9hcmQ6IGJvb2xlYW47XG5cbiAgcmFua09uZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5JRCA9IC0xO1xuICAgIHRoaXMubmFtZSA9IFwiQmxhbmtcIjtcbiAgICB0aGlzLmRlY2F5TW9kID0gMS4wO1xuICAgIHRoaXMucGFja2V0TEIgPSA0OTtcbiAgICB0aGlzLmhhdmVUZWFtcyA9IGZhbHNlO1xuICAgIHRoaXMuc3BlY0J5TGVhZGVyYm9hcmQgPSBmYWxzZTtcbiAgfVxuXG4gIG9uU2VydmVySW5pdChnYW1lU2VydmVyOiBHYW1lU2VydmVyKXtcbiAgICAvLyBDYWxsZWQgd2hlbiB0aGUgc2VydmVyIHN0YXJ0c1xuICAgIGdhbWVTZXJ2ZXIucnVuID0gdHJ1ZTtcbiAgfVxuXG4gIG9uVGljayhnYW1lU2VydmVyOiBHYW1lU2VydmVyKSB7XG4gICAgICAvLyBDYWxsZWQgb24gZXZlcnkgZ2FtZSB0aWNrIFxuICB9XG5cbiAgb25DaGFuZ2UoZ2FtZVNlcnZlcjogR2FtZVNlcnZlcikge1xuICAgICAgLy8gQ2FsbGVkIHdoZW4gc29tZW9uZSBjaGFuZ2VzIHRoZSBnYW1lbW9kZSB2aWEgY29uc29sZSBjb21tYW5kc1xuICB9XG5cbiAgb25QbGF5ZXJJbml0KHBsYXllcjogUGxheWVyVHJhY2tlcikge1xuICAgICAgLy8gQ2FsbGVkIGFmdGVyIGEgcGxheWVyIG9iamVjdCBpcyBjb25zdHJ1Y3RlZFxuICB9XG5cbiAgb25QbGF5ZXJTcGF3bihnYW1lU2VydmVyOiBHYW1lU2VydmVyLCBwbGF5ZXI6IFBsYXllclRyYWNrZXIpIHtcbiAgICAgIC8vIENhbGxlZCB3aGVuIGEgcGxheWVyIGlzIHNwYXduZWRcbiAgICAgIHBsYXllci5jb2xvciA9IGdhbWVTZXJ2ZXIuZ2V0UmFuZG9tQ29sb3IoKTsgLy8gUmFuZG9tIGNvbG9yXG4gICAgICBnYW1lU2VydmVyLnNwYXduUGxheWVyKHBsYXllciwgbnVsbCwgbnVsbCk7XG4gIH1cblxuICBwcmVzc1EoZ2FtZVNlcnZlcjogR2FtZVNlcnZlciwgcGxheWVyOiBQbGF5ZXJUcmFja2VyKSB7XG4gICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgUSBrZXkgaXMgcHJlc3NlZFxuICAgICAgaWYgKHBsYXllci5zcGVjdGF0ZSkge1xuICAgICAgICAgIGdhbWVTZXJ2ZXIuc3dpdGNoU3BlY3RhdG9yKHBsYXllcik7XG4gICAgICB9XG4gIH1cblxuICBwcmVzc1coZ2FtZVNlcnZlcjogR2FtZVNlcnZlciwgcGxheWVyOiBQbGF5ZXJUcmFja2VyKSB7XG4gICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgVyBrZXkgaXMgcHJlc3NlZFxuICAgICAgZ2FtZVNlcnZlci5lamVjdE1hc3MocGxheWVyKTtcbiAgfVxuXG4gIHByZXNzU3BhY2UoZ2FtZVNlcnZlcjogR2FtZVNlcnZlciwgcGxheWVyOiBQbGF5ZXJUcmFja2VyKSB7XG4gICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgU3BhY2UgYmFyIGlzIHByZXNzZWRcbiAgICAgIGdhbWVTZXJ2ZXIuc3BsaXRDZWxscyhwbGF5ZXIpO1xuICB9XG5cbiAgb25DZWxsQWRkKGNlbGw6IFBsYXllclRyYWNrZXIpIHtcbiAgICAgIC8vIENhbGxlZCB3aGVuIGEgcGxheWVyIGNlbGwgaXMgYWRkZWRcbiAgfVxuXG4gIG9uQ2VsbFJlbW92ZShjZWxsOiBQbGF5ZXJUcmFja2VyKSB7XG4gICAgICAvLyBDYWxsZWQgd2hlbiBhIHBsYXllciBjZWxsIGlzIHJlbW92ZWRcbiAgfVxuXG4gIG9uQ2VsbE1vdmUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgY2VsbDogUGxheWVyVHJhY2tlcikge1xuICAgIC8vIENhbGxlZCB3aGVuIGEgcGxheWVyIGNlbGwgaXMgbW92ZWRcbiAgfVxuXG4gIHVwZGF0ZUxCKGdhbWVTZXJ2ZXI6IEdhbWVTZXJ2ZXIpIHtcbiAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSBsZWFkZXJib2FyZCB1cGRhdGUgZnVuY3Rpb24gaXMgY2FsbGVkXG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==