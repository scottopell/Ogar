"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function Config() {
    _classCallCheck(this, Config);

    this.serverGamemode = 0;
    this.serverMaxConnections = 64;
    this.serverPort = 443;
    this.serverGamemode = 0;
    this.serverBots = 0;
    this.serverViewBaseX = 1024;
    this.serverViewBaseY = 592;
    this.serverStatsPort = 88;
    this.serverStatsUpdate = 60;
    this.serverLogLevel = 1;
    this.borderLeft = 0;
    this.borderRight = 6000;
    this.borderTop = 0;
    this.borderBottom = 6000;
    this.spawnInterval = 20;
    this.foodSpawnAmount = 10;
    this.foodStartAmount = 100;
    this.foodMaxAmount = 500;
    this.foodMass = 1;
    this.virusMinAmount = 10;
    this.virusMaxAmount = 50;
    this.virusStartMass = 100;
    this.virusFeedAmount = 7;
    this.ejectMass = 12;
    this.ejectMassLoss = 16;
    this.ejectSpeed = 160;
    this.ejectSpawnPlayer = 50;
    this.playerStartMass = 10;
    this.playerMaxMass = 22500;
    this.playerMinMassEject = 32;
    this.playerMinMassSplit = 36;
    this.playerMaxCells = 16;
    this.playerRecombineTime = 30;
    this.playerMassDecayRate = 0.02, this.playerMinMassDecay = 9;
    this.playerMaxNickLength = 15;
    this.playerDisconnectTime = 60;
    this.tourneyMaxPlayers = 12;
    this.tourneyPrepTime = 10;
    this.tourneyEndTime = 30;
    this.tourneyTimeLimit = 20;
    this.tourneyAutoFill = 0;
    this.tourneyAutoFillPlayers = 1;
};

exports["default"] = Config;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmZpZy50cyJdLCJuYW1lcyI6WyJDb25maWciLCJDb25maWcuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQUEsTUFBQSxHQTZGRUEsU0E3RkYsTUFBQSxHQTZGRUE7MEJBN0ZGLE1BQUE7O0FBTUVDLFFBQUFBLENBQUFBLGNBQWNBLEdBQUdBLENBQUNBLENBQUNBO0FBd0ZqQkEsUUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUMvQkEsUUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsR0FBR0EsQ0FBQ0E7QUFDdEJBLFFBQUlBLENBQUNBLGNBQWNBLEdBQUdBLENBQUNBLENBQUNBO0FBQ3hCQSxRQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNwQkEsUUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0E7QUFDNUJBLFFBQUlBLENBQUNBLGVBQWVBLEdBQUdBLEdBQUdBLENBQUNBO0FBQzNCQSxRQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUMxQkEsUUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUM1QkEsUUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDeEJBLFFBQUlBLENBQUNBLFVBQVVBLEdBQUdBLENBQUNBLENBQUNBO0FBQ3BCQSxRQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQTtBQUN4QkEsUUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDbkJBLFFBQUlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBO0FBQ3pCQSxRQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUN4QkEsUUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDMUJBLFFBQUlBLENBQUNBLGVBQWVBLEdBQUdBLEdBQUdBLENBQUNBO0FBQzNCQSxRQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxHQUFHQSxDQUFDQTtBQUN6QkEsUUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDbEJBLFFBQUlBLENBQUNBLGNBQWNBLEdBQUdBLEVBQUVBLENBQUNBO0FBQ3pCQSxRQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUN6QkEsUUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsR0FBR0EsQ0FBQ0E7QUFDMUJBLFFBQUlBLENBQUNBLGVBQWVBLEdBQUdBLENBQUNBLENBQUNBO0FBQ3pCQSxRQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUNwQkEsUUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDeEJBLFFBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEdBQUdBLENBQUNBO0FBQ3RCQSxRQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLEVBQUVBLENBQUNBO0FBQzNCQSxRQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUMxQkEsUUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7QUFDM0JBLFFBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDN0JBLFFBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDN0JBLFFBQUlBLENBQUNBLGNBQWNBLEdBQUdBLEVBQUVBLENBQUNBO0FBQ3pCQSxRQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLEVBQUVBLENBQUNBO0FBQzlCQSxRQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLEVBQy9CQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLENBQUNBLENBQUNBO0FBQzVCQSxRQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLEVBQUVBLENBQUNBO0FBQzlCQSxRQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLEVBQUVBLENBQUNBO0FBQy9CQSxRQUFJQSxDQUFDQSxpQkFBaUJBLEdBQUdBLEVBQUVBLENBQUNBO0FBQzVCQSxRQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUMxQkEsUUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDekJBLFFBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDM0JBLFFBQUlBLENBQUNBLGVBQWVBLEdBQUdBLENBQUNBLENBQUNBO0FBQ3pCQSxRQUFJQSxDQUFDQSxzQkFBc0JBLEdBQUdBLENBQUNBLENBQUNBO0NBQ2pDQTs7cUJBeElILE1BQUEiLCJmaWxlIjoiQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlnIHtcbiAgLy8gTWF4aW11bSBhbW91bnQgb2YgY29ubmVjdGlvbnMgdG8gdGhlIHNlcnZlci5cbiAgc2VydmVyTWF4Q29ubmVjdGlvbnM6IG51bWJlcjtcbiAgLy8gU2VydmVyIHBvcnRcbiAgc2VydmVyUG9ydDogbnVtYmVyO1xuICAvLyBHYW1lbW9kZSwgMCA9IEZGQSwgMSA9IFRlYW1zXG4gIHNlcnZlckdhbWVtb2RlID0gMDtcbiAgLy8gQW1vdW50IG9mIHBsYXllciBib3RzIHRvIHNwYXduXG4gIHNlcnZlckJvdHM6IG51bWJlcjtcbiAgLy8gQmFzZSB2aWV3IGRpc3RhbmNlIG9mIHBsYXllcnMuIFdhcm5pbmc6IGhpZ2ggdmFsdWVzIG1heSBjYXVzZSBsYWdcbiAgc2VydmVyVmlld0Jhc2VYOiBudW1iZXI7XG4gIHNlcnZlclZpZXdCYXNlWTogbnVtYmVyO1xuICAvLyBQb3J0IGZvciBzdGF0cyBzZXJ2ZXIuIEhhdmluZyBhIG5lZ2F0aXZlIG51bWJlciB3aWxsIGRpc2FibGUgdGhlIHN0YXRzXG4gIC8vIHNlcnZlci5cbiAgc2VydmVyU3RhdHNQb3J0OiBudW1iZXI7XG4gIC8vIEFtb3VudCBvZiBzZWNvbmRzIHBlciB1cGRhdGUgZm9yIHRoZSBzZXJ2ZXIgc3RhdHNcbiAgc2VydmVyU3RhdHNVcGRhdGU6IG51bWJlcjtcbiAgLy8gTG9nZ2luZyBsZXZlbCBvZiB0aGUgc2VydmVyLlxuICAvLyAwID0gTm8gbG9nc1xuICAvLyAxID0gTG9ncyB0aGUgY29uc29sZVxuICAvLyAyID0gTG9ncyBjb25zb2xlIGFuZCBpcCBjb25uZWN0aW9uc1xuICBzZXJ2ZXJMb2dMZXZlbDogbnVtYmVyO1xuICAvLyBMZWZ0IGJvcmRlciBvZiBtYXAgKFZhbmlsbGEgdmFsdWU6IDApXG4gIGJvcmRlckxlZnQ6IG51bWJlcjtcbiAgLy8gUmlnaHQgYm9yZGVyIG9mIG1hcCAoVmFuaWxsYSB2YWx1ZTogMTExODAuMzM5ODg3NSlcbiAgYm9yZGVyUmlnaHQ6IG51bWJlcjtcbiAgLy8gVG9wIGJvcmRlciBvZiBtYXAgKFZhbmlsbGEgdmFsdWU6IDApXG4gIGJvcmRlclRvcDogbnVtYmVyO1xuICAvLyBCb3R0b20gYm9yZGVyIG9mIG1hcCAoVmFuaWxsYSB2YWx1ZTogMTExODAuMzM5ODg3NSlcbiAgYm9yZGVyQm90dG9tOiBudW1iZXI7XG4gIC8vIFRoZSBpbnRlcnZhbCBiZXR3ZWVuIGVhY2ggZm9vZCBjZWxsIHNwYXduIGluIHRpY2tzICgxIHRpY2sgPSA1MCBtcylcbiAgc3Bhd25JbnRlcnZhbDogbnVtYmVyO1xuICAvLyBUaGUgYW1vdW50IG9mIGZvb2QgdG8gc3Bhd24gcGVyIGludGVydmFsXG4gIGZvb2RTcGF3bkFtb3VudDogbnVtYmVyO1xuICAvLyBUaGUgc3RhcnRpbmcgYW1vdW50IG9mIGZvb2QgaW4gdGhlIG1hcFxuICBmb29kU3RhcnRBbW91bnQ6IG51bWJlcjtcbiAgLy8gTWF4aW11bSBmb29kIGNlbGxzIG9uIHRoZSBtYXBcbiAgZm9vZE1heEFtb3VudDogbnVtYmVyO1xuICAvLyBTdGFydGluZyBmb29kIHNpemUgKEluIG1hc3MpXG4gIGZvb2RNYXNzOiBudW1iZXI7XG4gIC8vIE1pbmltdW0gYW1vdW50IG9mIHZpcnVzZXMgb24gdGhlIG1hcC5cbiAgdmlydXNNaW5BbW91bnQ6IG51bWJlcjtcbiAgLy8gTWF4aW11bSBhbW91bnQgb2YgdmlydXNlcyBvbiB0aGUgbWFwLlxuICAvLyBJZiB0aGlzIGFtb3VudCBpcyByZWFjaGVkLCB0aGVuIGVqZWN0ZWQgY2VsbHMgd2lsbCBwYXNzIHRocm91Z2ggdmlydXNlcy5cbiAgdmlydXNNYXhBbW91bnQ6IG51bWJlcjtcbiAgLy8gU3RhcnRpbmcgdmlydXMgc2l6ZSAoSW4gbWFzcylcbiAgdmlydXNTdGFydE1hc3M6IG51bWJlcjtcbiAgLy8gQW1vdW50IG9mIHRpbWVzIHlvdSBuZWVkIHRvIGZlZWQgYSB2aXJ1cyB0byBzaG9vdCBpdFxuICB2aXJ1c0ZlZWRBbW91bnQ6IG51bWJlcjtcbiAgLy8gTWFzcyBvZiBlamVjdGVkIGNlbGxzXG4gIGVqZWN0TWFzczogbnVtYmVyO1xuICAvLyBNYXNzIGxvc3Qgd2hlbiBlamVjdGluZyBjZWxsc1xuICBlamVjdE1hc3NMb3NzOiBudW1iZXI7XG4gIC8vIEJhc2Ugc3BlZWQgb2YgZWplY3RlZCBjZWxsc1xuICBlamVjdFNwZWVkOiBudW1iZXI7XG4gIC8vIENoYW5jZSBmb3IgYSBwbGF5ZXIgdG8gc3Bhd24gZnJvbSBlamVjdGVkIG1hc3NcbiAgZWplY3RTcGF3blBsYXllcjogbnVtYmVyO1xuICAvLyBTdGFydGluZyBtYXNzIG9mIHRoZSBwbGF5ZXIgY2VsbC5cbiAgcGxheWVyU3RhcnRNYXNzOiBudW1iZXI7XG4gIC8vIE1heGltdW0gbWFzcyBhIHBsYXllciBjYW4gaGF2ZVxuICBwbGF5ZXJNYXhNYXNzOiBudW1iZXI7XG4gIC8vIE1hc3MgcmVxdWlyZWQgdG8gZWplY3QgYSBjZWxsXG4gIHBsYXllck1pbk1hc3NFamVjdDogbnVtYmVyO1xuICAvLyBNYXNzIHJlcXVpcmVkIHRvIHNwbGl0XG4gIHBsYXllck1pbk1hc3NTcGxpdDogbnVtYmVyO1xuICAvLyBNYXggY2VsbHMgdGhlIHBsYXllciBpcyBhbGxvd2VkIHRvIGhhdmVcbiAgcGxheWVyTWF4Q2VsbHM6IG51bWJlcjtcbiAgLy8gQmFzZSBhbW91bnQgb2Ygc2Vjb25kcyBiZWZvcmUgYSBjZWxsIGlzIGFsbG93ZWQgdG8gcmVjb21iaW5lXG4gIHBsYXllclJlY29tYmluZVRpbWU6IG51bWJlcjtcbiAgLy8gQW1vdW50IG9mIG1hc3MgbG9zdCBwZXIgc2Vjb25kXG4gIHBsYXllck1hc3NEZWNheVJhdGU6IG51bWJlcjtcbiAgLy8gTWluaW11bSBtYXNzIGZvciBkZWNheSB0byBvY2N1clxuICBwbGF5ZXJNaW5NYXNzRGVjYXk6IG51bWJlcjtcbiAgLy8gTWF4aW11bSBuaWNrIGxlbmd0aFxuICBwbGF5ZXJNYXhOaWNrTGVuZ3RoOiBudW1iZXI7XG4gIC8vIFRoZSBhbW91bnQgb2Ygc2Vjb25kcyBpdCB0YWtlcyBmb3IgYSBwbGF5ZXIgY2VsbCB0byBiZSByZW1vdmVkIGFmdGVyXG4gIC8vIGRpc2Nvbm5lY3Rpb24gKElmIHNldCB0byAtMSwgY2VsbHMgYXJlIG5ldmVyIHJlbW92ZWQpXG4gIHBsYXllckRpc2Nvbm5lY3RUaW1lOiBudW1iZXI7XG4gIC8vIE1heGltdW0gYW1vdW50IG9mIHBhcnRpY2lwYW50cyBmb3IgdG91cm5hbWVudCBzdHlsZSBnYW1lIG1vZGVzXG4gIHRvdXJuZXlNYXhQbGF5ZXJzOiBudW1iZXI7XG4gIC8vIEFtb3VudCBvZiB0aWNrcyB0byB3YWl0IGFmdGVyIGFsbCBwbGF5ZXJzIGFyZSByZWFkeSAoMSB0aWNrID0gMTAwMCBtcylcbiAgdG91cm5leVByZXBUaW1lOiBudW1iZXI7XG4gIC8vIEFtb3VudCBvZiB0aWNrcyB0byB3YWl0IGFmdGVyIGEgcGxheWVyIHdpbnMgKDEgdGljayA9IDEwMDAgbXMpXG4gIHRvdXJuZXlFbmRUaW1lOiBudW1iZXI7XG4gIC8vIFRpbWUgbGltaXQgb2YgdGhlIGdhbWUsIGluIG1pbnV0ZXMuXG4gIHRvdXJuZXlUaW1lTGltaXQ6IG51bWJlcjtcbiAgLy8gSWYgc2V0IHRvIGEgdmFsdWUgaGlnaGVyIHRoYW4gMCwgdGhlIHRvdXJuYW1lbnQgbWF0Y2ggd2lsbCBhdXRvbWF0aWNhbGx5XG4gIC8vIGZpbGwgdXAgd2l0aCBib3RzIGFmdGVyIHRoaXMgYW1vdW50IG9mIHNlY29uZHNcbiAgdG91cm5leUF1dG9GaWxsOiBudW1iZXI7XG4gIC8vIFRoZSB0aW1lciBmb3IgZmlsbGluZyB0aGUgc2VydmVyIHdpdGggYm90cyB3aWxsIG5vdCBjb3VudCBkb3duIHVubGVzc1xuICAvLyB0aGVyZSBpcyB0aGlzIGFtb3VudCBvZiByZWFsIHBsYXllcnNcbiAgdG91cm5leUF1dG9GaWxsUGxheWVyczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VydmVyTWF4Q29ubmVjdGlvbnMgPSA2NDtcbiAgICB0aGlzLnNlcnZlclBvcnQgPSA0NDM7XG4gICAgdGhpcy5zZXJ2ZXJHYW1lbW9kZSA9IDA7XG4gICAgdGhpcy5zZXJ2ZXJCb3RzID0gMDtcbiAgICB0aGlzLnNlcnZlclZpZXdCYXNlWCA9IDEwMjQ7XG4gICAgdGhpcy5zZXJ2ZXJWaWV3QmFzZVkgPSA1OTI7XG4gICAgdGhpcy5zZXJ2ZXJTdGF0c1BvcnQgPSA4ODtcbiAgICB0aGlzLnNlcnZlclN0YXRzVXBkYXRlID0gNjA7XG4gICAgdGhpcy5zZXJ2ZXJMb2dMZXZlbCA9IDE7XG4gICAgdGhpcy5ib3JkZXJMZWZ0ID0gMDtcbiAgICB0aGlzLmJvcmRlclJpZ2h0ID0gNjAwMDtcbiAgICB0aGlzLmJvcmRlclRvcCA9IDA7XG4gICAgdGhpcy5ib3JkZXJCb3R0b20gPSA2MDAwO1xuICAgIHRoaXMuc3Bhd25JbnRlcnZhbCA9IDIwO1xuICAgIHRoaXMuZm9vZFNwYXduQW1vdW50ID0gMTA7XG4gICAgdGhpcy5mb29kU3RhcnRBbW91bnQgPSAxMDA7XG4gICAgdGhpcy5mb29kTWF4QW1vdW50ID0gNTAwO1xuICAgIHRoaXMuZm9vZE1hc3MgPSAxO1xuICAgIHRoaXMudmlydXNNaW5BbW91bnQgPSAxMDtcbiAgICB0aGlzLnZpcnVzTWF4QW1vdW50ID0gNTA7XG4gICAgdGhpcy52aXJ1c1N0YXJ0TWFzcyA9IDEwMDtcbiAgICB0aGlzLnZpcnVzRmVlZEFtb3VudCA9IDc7XG4gICAgdGhpcy5lamVjdE1hc3MgPSAxMjtcbiAgICB0aGlzLmVqZWN0TWFzc0xvc3MgPSAxNjtcbiAgICB0aGlzLmVqZWN0U3BlZWQgPSAxNjA7XG4gICAgdGhpcy5lamVjdFNwYXduUGxheWVyID0gNTA7XG4gICAgdGhpcy5wbGF5ZXJTdGFydE1hc3MgPSAxMDtcbiAgICB0aGlzLnBsYXllck1heE1hc3MgPSAyMjUwMDtcbiAgICB0aGlzLnBsYXllck1pbk1hc3NFamVjdCA9IDMyO1xuICAgIHRoaXMucGxheWVyTWluTWFzc1NwbGl0ID0gMzY7XG4gICAgdGhpcy5wbGF5ZXJNYXhDZWxscyA9IDE2O1xuICAgIHRoaXMucGxheWVyUmVjb21iaW5lVGltZSA9IDMwO1xuICAgIHRoaXMucGxheWVyTWFzc0RlY2F5UmF0ZSA9IDAuMDIsXG4gICAgdGhpcy5wbGF5ZXJNaW5NYXNzRGVjYXkgPSA5O1xuICAgIHRoaXMucGxheWVyTWF4Tmlja0xlbmd0aCA9IDE1O1xuICAgIHRoaXMucGxheWVyRGlzY29ubmVjdFRpbWUgPSA2MDtcbiAgICB0aGlzLnRvdXJuZXlNYXhQbGF5ZXJzID0gMTI7XG4gICAgdGhpcy50b3VybmV5UHJlcFRpbWUgPSAxMDtcbiAgICB0aGlzLnRvdXJuZXlFbmRUaW1lID0gMzA7XG4gICAgdGhpcy50b3VybmV5VGltZUxpbWl0ID0gMjA7XG4gICAgdGhpcy50b3VybmV5QXV0b0ZpbGwgPSAwO1xuICAgIHRoaXMudG91cm5leUF1dG9GaWxsUGxheWVycyA9IDE7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==