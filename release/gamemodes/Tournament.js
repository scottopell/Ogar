"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Mode2 = require('./Mode');

var _Mode3 = _interopRequireDefault(_Mode2);

var Tournament = (function (_Mode) {
    _inherits(Tournament, _Mode);

    function Tournament() {
        _classCallCheck(this, Tournament);

        _get(Object.getPrototypeOf(Tournament.prototype), "constructor", this).call(this);
        this.ID = 10;
        this.name = "Tournament";
        this.packetLB = 48;
        this.prepTime = 5;
        this.endTime = 15;
        this.autoFill = false;
        this.autoFillPlayers = 1;
        this.dcTime = 0;
        this.gamePhase = 0;
        this.contenders = [];
        this.maxContenders = 12;
        this.winner;
        this.timer;
        this.timeLimit = 3600;
    }

    _createClass(Tournament, [{
        key: "startGamePrep",
        value: function startGamePrep(gameServer) {
            this.gamePhase = 1;
            this.timer = this.prepTime;
        }
    }, {
        key: "startGame",
        value: function startGame(gameServer) {
            gameServer.run = true;
            this.gamePhase = 2;
            this.getSpectate();
            gameServer.config.playerDisconnectTime = this.dcTime;
        }
    }, {
        key: "endGame",
        value: function endGame(gameServer) {
            this.winner = this.contenders[0];
            this.gamePhase = 3;
            this.timer = this.endTime;
        }
    }, {
        key: "endGameTimeout",
        value: function endGameTimeout(gameServer) {
            gameServer.run = false;
            this.gamePhase = 4;
            this.timer = this.endTime;
        }
    }, {
        key: "fillBots",
        value: function fillBots(gameServer) {
            var fill = this.maxContenders - this.contenders.length;
            for (var i = 0; i < fill; i++) {
                gameServer.bots.addBot();
            }
        }
    }, {
        key: "getSpectate",
        value: function getSpectate() {
            var index = Math.floor(Math.random() * this.contenders.length);
            this.rankOne = this.contenders[index];
        }
    }, {
        key: "prepare",
        value: function prepare(gameServer) {
            var len = gameServer.nodes.length;
            for (var i = 0; i < len; i++) {
                var node = gameServer.nodes[0];
                if (!node) {
                    continue;
                }
                gameServer.removeNode(node);
            }
            gameServer.bots.loadNames();
            gameServer.run = false;
            this.gamePhase = 0;
            if (gameServer.config.tourneyAutoFill > 0) {
                this.timer = gameServer.config.tourneyAutoFill;
                this.autoFill = true;
                this.autoFillPlayers = gameServer.config.tourneyAutoFillPlayers;
            }
            this.dcTime = gameServer.config.playerDisconnectTime;
            gameServer.config.playerDisconnectTime = 0;
            gameServer.config.minMassDecay = gameServer.config.playerStartMass;
            this.prepTime = gameServer.config.tourneyPrepTime;
            this.endTime = gameServer.config.tourneyEndTime;
            this.maxContenders = gameServer.config.tourneyMaxPlayers;
            this.timeLimit = gameServer.config.tourneyTimeLimit * 60;
        }
    }, {
        key: "onPlayerDeath",
        value: function onPlayerDeath(gameServer) {}
    }, {
        key: "formatTime",
        value: function formatTime(time) {
            if (time < 0) {
                return "0:00";
            }
            var min = Math.floor(this.timeLimit / 60);
            var sec = this.timeLimit % 60;
            var strSec = sec > 9 ? sec : "0" + sec.toString();
            return min + ":" + strSec;
        }
    }, {
        key: "onServerInit",
        value: function onServerInit(gameServer) {
            this.prepare(gameServer);
        }
    }, {
        key: "onPlayerSpawn",
        value: function onPlayerSpawn(gameServer, player) {
            if (this.gamePhase == 0 && this.contenders.length < this.maxContenders) {
                player.color = gameServer.getRandomColor();
                this.contenders.push(player);
                gameServer.spawnPlayer(player);
                if (this.contenders.length == this.maxContenders) {
                    this.startGamePrep(gameServer);
                }
            }
        }
    }, {
        key: "onCellRemove",
        value: function onCellRemove(cell) {
            var owner = cell.owner,
                human_just_died = false;
            if (owner.cells.length <= 0) {
                var index = this.contenders.indexOf(owner);
                if (index != -1) {
                    if ('_socket' in this.contenders[index].socket) {
                        human_just_died = true;
                    }
                    this.contenders.splice(index, 1);
                }
                var humans = 0;
                for (var i = 0; i < this.contenders.length; i++) {
                    if ('_socket' in this.contenders[i].socket) {
                        humans++;
                    }
                }
                if ((this.contenders.length == 1 || humans == 0 || humans == 1 && human_just_died) && this.gamePhase == 2) {
                    this.endGame(cell.owner.gameServer);
                } else {
                    this.onPlayerDeath(cell.owner.gameServer);
                }
            }
        }
    }, {
        key: "updateLB",
        value: function updateLB(gameServer) {
            var lb = gameServer.leaderboard;
            switch (this.gamePhase) {
                case 0:
                    lb[0] = "Waiting for";
                    lb[1] = "players: ";
                    lb[2] = this.contenders.length + "/" + this.maxContenders;
                    if (this.autoFill) {
                        if (this.timer <= 0) {
                            this.fillBots(gameServer);
                        } else if (this.contenders.length >= this.autoFillPlayers) {
                            this.timer--;
                        }
                    }
                    break;
                case 1:
                    lb[0] = "Game starting in";
                    lb[1] = this.timer.toString();
                    lb[2] = "Good luck!";
                    if (this.timer <= 0) {
                        this.startGame(gameServer);
                    } else {
                        this.timer--;
                    }
                    break;
                case 2:
                    lb[0] = "Players Remaining";
                    lb[1] = this.contenders.length + "/" + this.maxContenders;
                    lb[2] = "Time Limit:";
                    lb[3] = this.formatTime(this.timeLimit);
                    if (this.timeLimit < 0) {
                        this.endGameTimeout(gameServer);
                    } else {
                        this.timeLimit--;
                    }
                    break;
                case 3:
                    lb[0] = "Congratulations";
                    lb[1] = this.winner.getName();
                    lb[2] = "for winning!";
                    if (this.timer <= 0) {
                        this.onServerInit(gameServer);
                        gameServer.startingFood();
                    } else {
                        lb[3] = "Game restarting in";
                        lb[4] = this.timer.toString();
                        this.timer--;
                    }
                    break;
                case 4:
                    lb[0] = "Time Limit";
                    lb[1] = "Reached!";
                    if (this.timer <= 0) {
                        this.onServerInit(gameServer);
                        gameServer.startingFood();
                    } else {
                        lb[2] = "Game restarting in";
                        lb[3] = this.timer.toString();
                        this.timer--;
                    }
                default:
                    break;
            }
        }
    }]);

    return Tournament;
})(_Mode3["default"]);

exports["default"] = Tournament;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVtb2Rlcy9Ub3VybmFtZW50LnRzIl0sIm5hbWVzIjpbIlRvdXJuYW1lbnQiLCJUb3VybmFtZW50LmNvbnN0cnVjdG9yIiwiVG91cm5hbWVudC5zdGFydEdhbWVQcmVwIiwiVG91cm5hbWVudC5zdGFydEdhbWUiLCJUb3VybmFtZW50LmVuZEdhbWUiLCJUb3VybmFtZW50LmVuZEdhbWVUaW1lb3V0IiwiVG91cm5hbWVudC5maWxsQm90cyIsIlRvdXJuYW1lbnQuZ2V0U3BlY3RhdGUiLCJUb3VybmFtZW50LnByZXBhcmUiLCJUb3VybmFtZW50Lm9uUGxheWVyRGVhdGgiLCJUb3VybmFtZW50LmZvcm1hdFRpbWUiLCJUb3VybmFtZW50Lm9uU2VydmVySW5pdCIsIlRvdXJuYW1lbnQub25QbGF5ZXJTcGF3biIsIlRvdXJuYW1lbnQub25DZWxsUmVtb3ZlIiwiVG91cm5hbWVudC51cGRhdGVMQiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztJQUV6QixVQUFBO2NBQUEsVUFBQTs7QUFjRUEsYUFkRixVQUFBLEdBY0VBOzhCQWRGLFVBQUE7O0FBZUlDLG1DQWZKLFVBQUEsNkNBZVlBO0FBRVJBLFlBQUlBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO0FBQ2JBLFlBQUlBLENBQUNBLElBQUlBLEdBQUdBLFlBQVlBLENBQUNBO0FBQ3pCQSxZQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUduQkEsWUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDbEJBLFlBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBO0FBQ2xCQSxZQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtBQUN0QkEsWUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDekJBLFlBQUlBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO0FBR2hCQSxZQUFJQSxDQUFD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QUNsQkE7QUFDREEsMEJBQU1BO0FBQUFBLEFBQ1JBLHFCQUFLQSxDQUFDQTtBQUNKQSxzQkFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsaUJBQWlCQSxDQUFDQTtBQUMxQkEsc0JBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO0FBQzlCQSxzQkFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsY0FBY0EsQ0FBQ0E7QUFDdkJBLHdCQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxFQUFFQTtBQUVuQkEsNEJBQUlBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO0FBRTlCQSxrQ0FBVUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7cUJBQzNCQSxNQUFNQTtBQUNMQSwwQkFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0Esb0JBQW9CQSxDQUFDQTtBQUM3QkEsMEJBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO0FBQzlCQSw0QkFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7cUJBQ2RBO0FBQ0RBLDBCQUFNQTtBQUFBQSxBQUNSQSxxQkFBS0EsQ0FBQ0E7QUFDSkEsc0JBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBO0FBQ3JCQSxzQkFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsVUFBVUEsQ0FBQ0E7QUFDbkJBLHdCQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxFQUFFQTtBQUVuQkEsNEJBQUlBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO0FBRTlCQSxrQ0FBVUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7cUJBQzNCQSxNQUFNQTtBQUNMQSwwQkFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0Esb0JBQW9CQSxDQUFDQTtBQUM3QkEsMEJBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO0FBQzlCQSw0QkFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7cUJBQ2RBO0FBQUFBLEFBQ0hBO0FBQ0VBLDBCQUFNQTtBQUFBQSxhQUNUQTtTQUNGQTs7O1dBaFFILFVBQUE7OztxQkFBQSxVQUFBIiwiZmlsZSI6ImdhbWVtb2Rlcy9Ub3VybmFtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZGUgZnJvbSAnLi9Nb2RlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG91cm5hbWVudCBleHRlbmRzIE1vZGV7XG4gIHByZXBUaW1lOiBudW1iZXI7XG4gIGVuZFRpbWU6IG51bWJlcjtcbiAgYXV0b0ZpbGw6IGJvb2xlYW47XG4gIGF1dG9GaWxsUGxheWVyczogbnVtYmVyO1xuICBkY1RpbWU6IG51bWJlcjtcbiAgZ2FtZVBoYXNlOiBudW1iZXI7XG4gIGNvbnRlbmRlcnM6IGFueVtdO1xuICBtYXhDb250ZW5kZXJzOiBudW1iZXI7XG5cbiAgd2lubmVyOiBhbnk7XG4gIHRpbWVyOiBhbnk7XG4gIHRpbWVMaW1pdDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuSUQgPSAxMDtcbiAgICB0aGlzLm5hbWUgPSBcIlRvdXJuYW1lbnRcIjtcbiAgICB0aGlzLnBhY2tldExCID0gNDg7XG5cbiAgICAvLyBDb25maWcgKDEgdGljayA9IDEwMDAgbXMpXG4gICAgdGhpcy5wcmVwVGltZSA9IDU7IC8vIEFtb3VudCBvZiB0aWNrcyBhZnRlciB0aGUgc2VydmVyIGZpbGxzIHVwIHRvIHdhaXQgdW50aWwgc3RhcnRpbmcgdGhlIGdhbWVcbiAgICB0aGlzLmVuZFRpbWUgPSAxNTsgLy8gQW1vdW50IG9mIHRpY2tzIGFmdGVyIHNvbWVvbmUgd2lucyB0byByZXN0YXJ0IHRoZSBnYW1lXG4gICAgdGhpcy5hdXRvRmlsbCA9IGZhbHNlO1xuICAgIHRoaXMuYXV0b0ZpbGxQbGF5ZXJzID0gMTtcbiAgICB0aGlzLmRjVGltZSA9IDA7XG5cbiAgICAvLyBHYW1lbW9kZSBTcGVjaWZpYyBWYXJpYWJsZXNcbiAgICB0aGlzLmdhbWVQaGFzZSA9IDA7IC8vIDAgPSBXYWl0aW5nIGZvciBwbGF5ZXJzLCAxID0gUHJlcGFyZSB0byBzdGFydCwgMiA9IEdhbWUgaW4gcHJvZ3Jlc3MsIDMgPSBFbmRcbiAgICB0aGlzLmNvbnRlbmRlcnMgPSBbXTtcbiAgICB0aGlzLm1heENvbnRlbmRlcnMgPSAxMjtcblxuICAgIHRoaXMud2lubmVyO1xuICAgIHRoaXMudGltZXI7XG4gICAgdGhpcy50aW1lTGltaXQgPSAzNjAwOyAvLyBpbiBzZWNvbmRzXG4gIH1cblxuICAvLyBHYW1lbW9kZSBTcGVjaWZpYyBGdW5jdGlvbnNcblxuICBzdGFydEdhbWVQcmVwKGdhbWVTZXJ2ZXIpIHtcbiAgICB0aGlzLmdhbWVQaGFzZSA9IDE7XG4gICAgdGhpcy50aW1lciA9IHRoaXMucHJlcFRpbWU7IC8vIDEwIHNlY29uZHNcbiAgfVxuXG4gIHN0YXJ0R2FtZShnYW1lU2VydmVyKSB7XG4gICAgZ2FtZVNlcnZlci5ydW4gPSB0cnVlO1xuICAgIHRoaXMuZ2FtZVBoYXNlID0gMjtcbiAgICB0aGlzLmdldFNwZWN0YXRlKCk7IC8vIEdldHMgYSByYW5kb20gcGVyc29uIHRvIHNwZWN0YXRlXG4gICAgZ2FtZVNlcnZlci5jb25maWcucGxheWVyRGlzY29ubmVjdFRpbWUgPSB0aGlzLmRjVGltZTsgLy8gUmVzZXQgY29uZmlnXG4gIH1cblxuICBlbmRHYW1lKGdhbWVTZXJ2ZXIpIHtcbiAgICB0aGlzLndpbm5lciA9IHRoaXMuY29udGVuZGVyc1swXTtcbiAgICB0aGlzLmdhbWVQaGFzZSA9IDM7XG4gICAgdGhpcy50aW1lciA9IHRoaXMuZW5kVGltZTsgLy8gMzAgU2Vjb25kc1xuICB9XG5cbiAgZW5kR2FtZVRpbWVvdXQoZ2FtZVNlcnZlcikge1xuICAgIGdhbWVTZXJ2ZXIucnVuID0gZmFsc2U7XG4gICAgdGhpcy5nYW1lUGhhc2UgPSA0O1xuICAgIHRoaXMudGltZXIgPSB0aGlzLmVuZFRpbWU7IC8vIDMwIFNlY29uZHNcbiAgfVxuXG4gIGZpbGxCb3RzKGdhbWVTZXJ2ZXIpIHtcbiAgICAvLyBGaWxscyB0aGUgc2VydmVyIHdpdGggYm90cyBpZiB0aGVyZSBhcmVudCBlbm91Z2ggcGxheWVyc1xuICAgIHZhciBmaWxsID0gdGhpcy5tYXhDb250ZW5kZXJzIC0gdGhpcy5jb250ZW5kZXJzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDtpIDwgZmlsbDtpKyspIHtcbiAgICAgIGdhbWVTZXJ2ZXIuYm90cy5hZGRCb3QoKTtcbiAgICB9XG4gIH1cblxuICBnZXRTcGVjdGF0ZSgpIHtcbiAgICAvLyBGaW5kcyBhIHJhbmRvbSBwZXJzb24gdG8gc3BlY3RhdGVcbiAgICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbnRlbmRlcnMubGVuZ3RoKTtcbiAgICB0aGlzLnJhbmtPbmUgPSB0aGlzLmNvbnRlbmRlcnNbaW5kZXhdO1xuICB9XG5cbiAgcHJlcGFyZShnYW1lU2VydmVyKSB7XG4gICAgLy8gUmVtb3ZlIGFsbCBjZWxsc1xuICAgIHZhciBsZW4gPSBnYW1lU2VydmVyLm5vZGVzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IGdhbWVTZXJ2ZXIubm9kZXNbMF07XG5cbiAgICAgIGlmICghbm9kZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZ2FtZVNlcnZlci5yZW1vdmVOb2RlKG5vZGUpO1xuICAgIH1cblxuICAgIGdhbWVTZXJ2ZXIuYm90cy5sb2FkTmFtZXMoKTtcblxuICAgIC8vIFBhdXNlcyB0aGUgc2VydmVyXG4gICAgZ2FtZVNlcnZlci5ydW4gPSBmYWxzZTtcbiAgICB0aGlzLmdhbWVQaGFzZSA9IDA7XG5cbiAgICAvLyBHZXQgY29uZmlnIHZhbHVlc1xuICAgIGlmIChnYW1lU2VydmVyLmNvbmZpZy50b3VybmV5QXV0b0ZpbGwgPiAwKSB7XG4gICAgICB0aGlzLnRpbWVyID0gZ2FtZVNlcnZlci5jb25maWcudG91cm5leUF1dG9GaWxsO1xuICAgICAgdGhpcy5hdXRvRmlsbCA9IHRydWU7XG4gICAgICB0aGlzLmF1dG9GaWxsUGxheWVycyA9IGdhbWVTZXJ2ZXIuY29uZmlnLnRvdXJuZXlBdXRvRmlsbFBsYXllcnM7XG4gICAgfVxuICAgIC8vIEhhbmRsZXMgZGlzY29ubmVjdGlvbnNcbiAgICB0aGlzLmRjVGltZSA9IGdhbWVTZXJ2ZXIuY29uZmlnLnBsYXllckRpc2Nvbm5lY3RUaW1lO1xuICAgIGdhbWVTZXJ2ZXIuY29uZmlnLnBsYXllckRpc2Nvbm5lY3RUaW1lID0gMDtcbiAgICBnYW1lU2VydmVyLmNvbmZpZy5taW5NYXNzRGVjYXkgPSBnYW1lU2VydmVyLmNvbmZpZy5wbGF5ZXJTdGFydE1hc3M7XG5cbiAgICB0aGlzLnByZXBUaW1lID0gZ2FtZVNlcnZlci5jb25maWcudG91cm5leVByZXBUaW1lO1xuICAgIHRoaXMuZW5kVGltZSA9IGdhbWVTZXJ2ZXIuY29uZmlnLnRvdXJuZXlFbmRUaW1lO1xuICAgIHRoaXMubWF4Q29udGVuZGVycyA9IGdhbWVTZXJ2ZXIuY29uZmlnLnRvdXJuZXlNYXhQbGF5ZXJzO1xuXG4gICAgLy8gVGltZSBsaW1pdFxuICAgIHRoaXMudGltZUxpbWl0ID0gZ2FtZVNlcnZlci5jb25maWcudG91cm5leVRpbWVMaW1pdCAqIDYwOyAvLyBpbiBzZWNvbmRzXG4gIH1cblxuICBvblBsYXllckRlYXRoKGdhbWVTZXJ2ZXIpIHtcbiAgICAvLyBOb3RoaW5nXG4gIH1cblxuICBmb3JtYXRUaW1lKHRpbWUpIHtcbiAgICBpZiAodGltZSA8IDApIHtcbiAgICAgIHJldHVybiBcIjA6MDBcIjtcbiAgICB9XG4gICAgLy8gRm9ybWF0XG4gICAgdmFyIG1pbiA9IE1hdGguZmxvb3IodGhpcy50aW1lTGltaXQgLyA2MCk7XG4gICAgdmFyIHNlYyA9IHRoaXMudGltZUxpbWl0ICUgNjA7XG4gICAgdmFyIHN0clNlYyA9IChzZWMgPiA5KSA/IHNlYyA6IFwiMFwiICsgc2VjLnRvU3RyaW5nKCkgO1xuICAgIHJldHVybiBtaW4rXCI6XCIrc3RyU2VjO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGVcblxuICBvblNlcnZlckluaXQoZ2FtZVNlcnZlcikge1xuICAgIHRoaXMucHJlcGFyZShnYW1lU2VydmVyKTtcbiAgfVxuXG4gIG9uUGxheWVyU3Bhd24oZ2FtZVNlcnZlcixwbGF5ZXIpIHtcbiAgICAvLyBPbmx5IHNwYXduIHBsYXllcnMgaWYgdGhlIGdhbWUgaGFzbnQgc3RhcnRlZCB5ZXRcbiAgICBpZiAoKHRoaXMuZ2FtZVBoYXNlID09IDApICYmICh0aGlzLmNvbnRlbmRlcnMubGVuZ3RoIDwgdGhpcy5tYXhDb250ZW5kZXJzKSkge1xuICAgICAgcGxheWVyLmNvbG9yID0gZ2FtZVNlcnZlci5nZXRSYW5kb21Db2xvcigpOyAvLyBSYW5kb20gY29sb3JcbiAgICAgIHRoaXMuY29udGVuZGVycy5wdXNoKHBsYXllcik7IC8vIEFkZCB0byBjb250ZW5kZXJzIGxpc3RcbiAgICAgIGdhbWVTZXJ2ZXIuc3Bhd25QbGF5ZXIocGxheWVyKTtcblxuICAgICAgaWYgKHRoaXMuY29udGVuZGVycy5sZW5ndGggPT0gdGhpcy5tYXhDb250ZW5kZXJzKSB7XG4gICAgICAgIC8vIFN0YXJ0IHRoZSBnYW1lIG9uY2UgdGhlcmUgaXMgZW5vdWdoIHBsYXllcnNcbiAgICAgICAgdGhpcy5zdGFydEdhbWVQcmVwKGdhbWVTZXJ2ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2VsbFJlbW92ZShjZWxsKSB7XG4gICAgdmFyIG93bmVyID0gY2VsbC5vd25lcixcbiAgICBodW1hbl9qdXN0X2RpZWQgPSBmYWxzZTtcblxuICAgIGlmIChvd25lci5jZWxscy5sZW5ndGggPD0gMCkge1xuICAgICAgLy8gUmVtb3ZlIGZyb20gY29udGVuZGVycyBsaXN0XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmNvbnRlbmRlcnMuaW5kZXhPZihvd25lcik7XG4gICAgICBpZiAoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgaWYgKCdfc29ja2V0JyBpbiB0aGlzLmNvbnRlbmRlcnNbaW5kZXhdLnNvY2tldCkge1xuICAgICAgICAgIGh1bWFuX2p1c3RfZGllZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZW5kZXJzLnNwbGljZShpbmRleCwxKTtcbiAgICAgIH1cblxuICAgICAgLy8gVmljdG9yeSBjb25kaXRpb25zXG4gICAgICB2YXIgaHVtYW5zID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb250ZW5kZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgnX3NvY2tldCcgaW4gdGhpcy5jb250ZW5kZXJzW2ldLnNvY2tldCkge1xuICAgICAgICAgIGh1bWFucysrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRoZSBnYW1lIGlzIG92ZXIgaWY6XG4gICAgICAvLyAxKSB0aGVyZSBpcyBvbmx5IDEgcGxheWVyIGxlZnQsIE9SXG4gICAgICAvLyAyKSBhbGwgdGhlIGh1bWFucyBhcmUgZGVhZCwgT1JcbiAgICAgIC8vIDMpIHRoZSBsYXN0LWJ1dC1vbmUgaHVtYW4ganVzdCBkaWVkXG4gICAgICBpZiAoKHRoaXMuY29udGVuZGVycy5sZW5ndGggPT0gMSB8fCBodW1hbnMgPT0gMCB8fCAoaHVtYW5zID09IDEgJiYgaHVtYW5fanVzdF9kaWVkKSkgJiYgdGhpcy5nYW1lUGhhc2UgPT0gMikge1xuICAgICAgICB0aGlzLmVuZEdhbWUoY2VsbC5vd25lci5nYW1lU2VydmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERvIHN0dWZmXG4gICAgICAgIHRoaXMub25QbGF5ZXJEZWF0aChjZWxsLm93bmVyLmdhbWVTZXJ2ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUxCKGdhbWVTZXJ2ZXIpIHtcbiAgICB2YXIgbGIgPSBnYW1lU2VydmVyLmxlYWRlcmJvYXJkO1xuXG4gICAgc3dpdGNoICh0aGlzLmdhbWVQaGFzZSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBsYlswXSA9IFwiV2FpdGluZyBmb3JcIjtcbiAgICAgICAgbGJbMV0gPSBcInBsYXllcnM6IFwiO1xuICAgICAgICBsYlsyXSA9IHRoaXMuY29udGVuZGVycy5sZW5ndGgrXCIvXCIrdGhpcy5tYXhDb250ZW5kZXJzO1xuICAgICAgICBpZiAodGhpcy5hdXRvRmlsbCkge1xuICAgICAgICAgIGlmICh0aGlzLnRpbWVyIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuZmlsbEJvdHMoZ2FtZVNlcnZlcik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRlbmRlcnMubGVuZ3RoID49IHRoaXMuYXV0b0ZpbGxQbGF5ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsYlswXSA9IFwiR2FtZSBzdGFydGluZyBpblwiO1xuICAgICAgICBsYlsxXSA9IHRoaXMudGltZXIudG9TdHJpbmcoKTtcbiAgICAgICAgbGJbMl0gPSBcIkdvb2QgbHVjayFcIjtcbiAgICAgICAgaWYgKHRoaXMudGltZXIgPD0gMCkge1xuICAgICAgICAgIC8vIFJlc2V0IHRoZSBnYW1lXG4gICAgICAgICAgdGhpcy5zdGFydEdhbWUoZ2FtZVNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aW1lci0tO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsYlswXSA9IFwiUGxheWVycyBSZW1haW5pbmdcIjtcbiAgICAgICAgbGJbMV0gPSB0aGlzLmNvbnRlbmRlcnMubGVuZ3RoK1wiL1wiK3RoaXMubWF4Q29udGVuZGVycztcbiAgICAgICAgbGJbMl0gPSBcIlRpbWUgTGltaXQ6XCI7XG4gICAgICAgIGxiWzNdID0gdGhpcy5mb3JtYXRUaW1lKHRoaXMudGltZUxpbWl0KTtcbiAgICAgICAgaWYgKHRoaXMudGltZUxpbWl0IDwgMCkge1xuICAgICAgICAgIC8vIFRpbWVkIG91dFxuICAgICAgICAgIHRoaXMuZW5kR2FtZVRpbWVvdXQoZ2FtZVNlcnZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aW1lTGltaXQtLTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgbGJbMF0gPSBcIkNvbmdyYXR1bGF0aW9uc1wiO1xuICAgICAgICBsYlsxXSA9IHRoaXMud2lubmVyLmdldE5hbWUoKTtcbiAgICAgICAgbGJbMl0gPSBcImZvciB3aW5uaW5nIVwiO1xuICAgICAgICBpZiAodGhpcy50aW1lciA8PSAwKSB7XG4gICAgICAgICAgLy8gUmVzZXQgdGhlIGdhbWVcbiAgICAgICAgICB0aGlzLm9uU2VydmVySW5pdChnYW1lU2VydmVyKTtcbiAgICAgICAgICAvLyBSZXNwYXduIHN0YXJ0aW5nIGZvb2RcbiAgICAgICAgICBnYW1lU2VydmVyLnN0YXJ0aW5nRm9vZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxiWzNdID0gXCJHYW1lIHJlc3RhcnRpbmcgaW5cIjtcbiAgICAgICAgICBsYls0XSA9IHRoaXMudGltZXIudG9TdHJpbmcoKTtcbiAgICAgICAgICB0aGlzLnRpbWVyLS07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIGxiWzBdID0gXCJUaW1lIExpbWl0XCI7IFxuICAgICAgICBsYlsxXSA9IFwiUmVhY2hlZCFcIjtcbiAgICAgICAgaWYgKHRoaXMudGltZXIgPD0gMCkge1xuICAgICAgICAgIC8vIFJlc2V0IHRoZSBnYW1lXG4gICAgICAgICAgdGhpcy5vblNlcnZlckluaXQoZ2FtZVNlcnZlcik7XG4gICAgICAgICAgLy8gUmVzcGF3biBzdGFydGluZyBmb29kXG4gICAgICAgICAgZ2FtZVNlcnZlci5zdGFydGluZ0Zvb2QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYlsyXSA9IFwiR2FtZSByZXN0YXJ0aW5nIGluXCI7XG4gICAgICAgICAgbGJbM10gPSB0aGlzLnRpbWVyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgdGhpcy50aW1lci0tO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==