'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ws = require('ws');

var WebSocket = _interopRequireWildcard(_ws);

var _http = require('http');

var http = _interopRequireWildcard(_http);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _modulesIni = require('./modules/ini');

var ini = _interopRequireWildcard(_modulesIni);

var _packetIndex = require('./packet/index');

var Packet = _interopRequireWildcard(_packetIndex);

var _gamemodesIndex = require('./gamemodes/index');

var Gamemode = _interopRequireWildcard(_gamemodesIndex);

var _entityIndex = require('./entity/index');

var _PlayerTracker = require('./PlayerTracker');

var _PlayerTracker2 = _interopRequireDefault(_PlayerTracker);

var _PacketHandler = require('./PacketHandler');

var _PacketHandler2 = _interopRequireDefault(_PacketHandler);

var _aiBotLoader = require('./ai/BotLoader');

var _aiBotLoader2 = _interopRequireDefault(_aiBotLoader);

var _modulesLog = require('./modules/log');

var _modulesLog2 = _interopRequireDefault(_modulesLog);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var GameServer = (function () {
    function GameServer() {
        _classCallCheck(this, GameServer);

        this.run = true;
        this.lastNodeId = 1;
        this.lastPlayerId = 1;
        this.clients = [];
        this.nodes = [];
        this.nodesVirus = [];
        this.nodesEjected = [];
        this.nodesPlayer = [];
        this.currentFood = 0;
        this.movingNodes = [];
        this.leaderboard = [];
        this.lb_packet = new ArrayBuffer(0);
        this.bots = new _aiBotLoader2['default'](this);
        this.log = new _modulesLog2['default']();
        this.commands;
        this.time = +new Date();
        this.startTime = this.time;
        this.tick = 0;
        this.tickMain = 0;
        this.tickSpawn = 0;
        this.config = new _config2['default']();
        this.loadConfig();
        this.gameMode = Gamemode.get(this.config.serverGamemode);
        this.colors = [{ 'r': 235, 'g': 75, 'b': 0 }, { 'r': 225, 'g': 125, 'b': 255 }, { 'r': 180, 'g': 7, 'b': 20 }, { 'r': 80, 'g': 170, 'b': 240 }, { 'r': 180, 'g': 90, 'b': 135 }, { 'r': 195, 'g': 240, 'b': 0 }, { 'r': 150, 'g': 18, 'b': 255 }, { 'r': 80, 'g': 245, 'b': 0 }, { 'r': 165, 'g': 25, 'b': 0 }, { 'r': 80, 'g': 145, 'b': 0 }, { 'r': 80, 'g': 170, 'b': 240 }, { 'r': 55, 'g': 92, 'b': 255 }];
    }

    _createClass(GameServer, [{
        key: 'start',
        value: function start() {
            this.log.setup(this);
            this.gameMode.onServerInit(this);
            var serverCallback = function serverCallback() {
                this.startingFood();
                setInterval(this.mainLoop.bind(this), 1);
                console.log("[Game] Listening on port " + this.config.serverPort);
                console.log("[Game] Current game mode is " + this.gameMode.name);
                if (this.config.serverBots > 0) {
                    for (var i = 0; i < this.config.serverBots; i++) {
                        this.bots.addBot();
                    }
                    console.log("[Game] Loaded " + this.config.serverBots + " player bots");
                }
            };
            this.socketServer = new WebSocket.Server({ port: this.config.serverPort, perMessageDeflate: false }, serverCallback.bind(this));
            this.socketServer.on('connection', connectionEstablished.bind(this));
            this.socketServer.on('error', function err(e) {
                switch (e.name) {
                    case "EADDRINUSE":
                        console.log("[Error] EADDRINUSE. Server could not bind to port!");
                        break;
                    case "EACCES":
                        console.log("[Error] EACCES. Tips:\nUse ports above 1000");
                        break;
                    default:
                        console.log('[Error] Unhandled error code: ' + e.name);
                        break;
                }
                process.exit(1);
            });
            function connectionEstablished(ws) {
                if (this.clients.length >= this.config.serverMaxConnections) {
                    ws.close();
                    return;
                }
                var origin = ws.upgradeReq.headers.origin;
                if (origin != 'http://agar.io' && origin != 'https://agar.io' && origin != 'http://localhost' && origin != 'https://localhost' && origin != 'http://127.0.0.1' && origin != 'https://127.0.0.1') {
                    ws.close();
                    return;
                }
                function close(error) {
                    this.server.log.onDisconnect(this.socket.remoteAddress);
                    var client = this.socket.playerTracker;
                    var len = this.socket.playerTracker.cells.length;
                    for (var i = 0; i < len; i++) {
                        var cell = this.socket.playerTracker.cells[i];
                        if (!cell) {
                            continue;
                        }
                        cell.calcMove = function () {
                            return;
                        };
                    }
                    client.disconnect = this.server.config.playerDisconnectTime * 20;
                    this.socket.sendPacket = function () {
                        return;
                    };
                }
                ws.remoteAddress = ws._socket.remoteAddress;
                ws.remotePort = ws._socket.remotePort;
                this.log.onConnect(ws.remoteAddress);
                ws.playerTracker = new _PlayerTracker2['default'](this, ws);
                ws.packetHandler = new _PacketHandler2['default'](this, ws);
                ws.on('message', ws.packetHandler.handleMessage.bind(ws.packetHandler));
                var bindObject = { server: this, socket: ws };
                ws.on('error', close.bind(bindObject));
                ws.on('close', close.bind(bindObject));
                this.clients.push(ws);
            }
            this.startStatsServer(this.config.serverStatsPort);
        }
    }, {
        key: 'getMode',
        value: function getMode() {
            return this.gameMode;
        }
    }, {
        key: 'getNextNodeId',
        value: function getNextNodeId() {
            if (this.lastNodeId > 2147483647) {
                this.lastNodeId = 1;
            }
            return this.lastNodeId++;
        }
    }, {
        key: 'getNewPlayerID',
        value: function getNewPlayerID() {
            if (this.lastPlayerId > 2147483647) {
                this.lastPlayerId = 1;
            }
            return this.lastPlayerId++;
        }
    }, {
        key: 'getRandomPosition',
        value: function getRandomPosition() {
            return {
                x: Math.floor(Math.random() * (this.config.borderRight - this.config.borderLeft)) + this.config.borderLeft,
                y: Math.floor(Math.random() * (this.config.borderBottom - this.config.borderTop)) + this.config.borderTop
            };
        }
    }, {
        key: 'getRandomSpawn',
        value: function getRandomSpawn() {
            var pos;
            if (this.currentFood > 0) {
                var node;
                for (var i = this.nodes.length - 1; i > -1; i--) {
                    node = this.nodes[i];
                    if (!node || node.inRange) {
                        continue;
                    }
                    if (node.getType() == 1) {
                        pos = { x: node.position.x, y: node.position.y };
                        this.removeNode(node);
                        break;
                    }
                }
            }
            if (!pos) {
                pos = this.getRandomPosition();
            }
            return pos;
        }
    }, {
        key: 'getRandomColor',
        value: function getRandomColor() {
            var index = Math.floor(Math.random() * this.colors.length);
            var color = this.colors[index];
            return {
                r: color.r,
                b: color.b,
                g: color.g
            };
        }
    }, {
        key: 'addNode',
        value: function addNode(node) {
            this.nodes.push(node);
            if (node.owner) {
                node.setColor(node.owner.color);
                node.owner.cells.push(node);
                node.owner.socket.sendPacket(new Packet.AddNode(node));
            }
            node.onAdd(this);
            for (var i = 0; i < this.clients.length; i++) {
                var client = this.clients[i].playerTracker;
                if (!client) {
                    continue;
                }
                if ('_socket' in client.socket && node.visibleCheck(client.viewBox, client.centerPos)) {
                    client.nodeAdditionQueue.push(node);
                }
            }
        }
    }, {
        key: 'removeNode',
        value: function removeNode(node) {
            var index = this.nodes.indexOf(node);
            if (index != -1) {
                this.nodes.splice(index, 1);
            }
            index = this.movingNodes.indexOf(node);
            if (index != -1) {
                this.movingNodes.splice(index, 1);
            }
            node.onRemove(this);
            for (var i = 0; i < this.clients.length; i++) {
                var client = this.clients[i].playerTracker;
                if (!client) {
                    continue;
                }
                client.nodeDestroyQueue.push(node);
            }
        }
    }, {
        key: 'cellTick',
        value: function cellTick() {
            this.updateMoveEngine();
        }
    }, {
        key: 'spawnTick',
        value: function spawnTick() {
            this.tickSpawn++;
            if (this.tickSpawn >= this.config.spawnInterval) {
                this.updateFood();
                this.virusCheck();
                this.tickSpawn = 0;
            }
        }
    }, {
        key: 'gamemodeTick',
        value: function gamemodeTick() {
            this.gameMode.onTick(this);
        }
    }, {
        key: 'cellUpdateTick',
        value: function cellUpdateTick() {
            this.updateCells();
        }
    }, {
        key: 'mainLoop',
        value: function mainLoop() {
            var local = new Date();
            this.tick += +local - this.time;
            this.time = +local;
            if (this.tick >= 50) {
                if (this.run) {
                    setTimeout(this.cellTick(), 0);
                    setTimeout(this.spawnTick(), 0);
                    setTimeout(this.gamemodeTick(), 0);
                }
                this.updateClients();
                this.tickMain++;
                if (this.tickMain >= 20) {
                    setTimeout(this.cellUpdateTick(), 0);
                    this.leaderboard = [];
                    this.gameMode.updateLB(this);
                    var lbPack = new Packet.UpdateLeaderboard(this.leaderboard, this.gameMode.packetLB);
                    this.lb_packet = lbPack.build();
                    this.tickMain = 0;
                }
                this.tick = 0;
            }
        }
    }, {
        key: 'updateClients',
        value: function updateClients() {
            for (var i = 0; i < this.clients.length; i++) {
                if (typeof this.clients[i] == "undefined") {
                    continue;
                }
                this.clients[i].playerTracker.update();
            }
        }
    }, {
        key: 'startingFood',
        value: function startingFood() {
            for (var i = 0; i < this.config.foodStartAmount; i++) {
                this.spawnFood();
            }
        }
    }, {
        key: 'updateFood',
        value: function updateFood() {
            var toSpawn = Math.min(this.config.foodSpawnAmount, this.config.foodMaxAmount - this.currentFood);
            for (var i = 0; i < toSpawn; i++) {
                this.spawnFood();
            }
        }
    }, {
        key: 'spawnFood',
        value: function spawnFood() {
            var f = new _entityIndex.Food(this.getNextNodeId(), null, this.getRandomPosition(), this.config.foodMass, null);
            f.setColor(this.getRandomColor());
            this.addNode(f);
            this.currentFood++;
        }
    }, {
        key: 'spawnPlayer',
        value: function spawnPlayer(player, pos, mass) {
            if (pos == null) {
                pos = this.getRandomSpawn();
            }
            if (mass == null) {
                mass = this.config.playerStartMass;
            }
            var cell = new _entityIndex.PlayerCell(this.getNextNodeId(), player, pos, mass, null);
            this.addNode(cell);
            player.mouse = { x: pos.x, y: pos.y };
        }
    }, {
        key: 'virusCheck',
        value: function virusCheck() {
            if (this.nodesVirus.length < this.config.virusMinAmount) {
                var pos = this.getRandomPosition();
                var virusSquareSize = this.config.virusStartMass * 100 >> 0;
                for (var i = 0; i < this.nodesPlayer.length; i++) {
                    var check = this.nodesPlayer[i];
                    if (check.mass < this.config.virusStartMass) {
                        continue;
                    }
                    var squareR = check.getSquareSize();
                    var dx = check.position.x - pos.x;
                    var dy = check.position.y - pos.y;
                    if (dx * dx + dy * dy + virusSquareSize <= squareR) return;
                }
                var v = new _entityIndex.Virus(this.getNextNodeId(), null, pos, this.config.virusStartMass, null);
                this.addNode(v);
            }
        }
    }, {
        key: 'updateMoveEngine',
        value: function updateMoveEngine() {
            var len = this.nodesPlayer.length;
            for (var i = 0; i < len; i++) {
                var cell = this.nodesPlayer[i];
                if (!cell) {
                    continue;
                }
                var client = cell.owner;
                cell.calcMove(client.mouse.x, client.mouse.y, this);
                var list = this.getCellsInRange(cell);
                for (var j = 0; j < list.length; j++) {
                    var check = list[j];
                    if (check.cellType == 0) {
                        len--;
                        if (check.nodeId < cell.nodeId) {
                            i--;
                        }
                    }
                    check.onConsume(cell, this);
                    check.setKiller(cell);
                    this.removeNode(check);
                }
            }
            len = this.movingNodes.length;
            for (var i = 0; i < len; i++) {
                var check = this.movingNodes[i];
                while (typeof check == "undefined" && i < this.movingNodes.length) {
                    this.movingNodes.splice(i, 1);
                    check = this.movingNodes[i];
                }
                if (i >= this.movingNodes.length) {
                    continue;
                }
                if (check.moveEngineTicks > 0) {
                    check.onAutoMove(this);
                    check.calcMovePhys(this.config);
                } else {
                    check.moveDone(this);
                    var index = this.movingNodes.indexOf(check);
                    if (index != -1) {
                        this.movingNodes.splice(index, 1);
                    }
                }
            }
        }
    }, {
        key: 'setAsMovingNode',
        value: function setAsMovingNode(node) {
            this.movingNodes.push(node);
        }
    }, {
        key: 'splitCells',
        value: function splitCells(client) {
            var len = client.cells.length;
            for (var i = 0; i < len; i++) {
                if (client.cells.length >= this.config.playerMaxCells) {
                    continue;
                }
                var cell = client.cells[i];
                if (!cell) {
                    continue;
                }
                if (cell.mass < this.config.playerMinMassSplit) {
                    continue;
                }
                var deltaY = client.mouse.y - cell.position.y;
                var deltaX = client.mouse.x - cell.position.x;
                var angle = Math.atan2(deltaX, deltaY);
                var size = cell.getSize() / 2;
                var startPos = {
                    x: cell.position.x + size * Math.sin(angle),
                    y: cell.position.y + size * Math.cos(angle)
                };
                var splitSpeed = cell.getSpeed() * 6;
                var newMass = cell.mass / 2;
                cell.mass = newMass;
                var split = new _entityIndex.PlayerCell(this.getNextNodeId(), client, startPos, newMass, null);
                split.setAngle(angle);
                split.setMoveEngineData(splitSpeed, 32, 0.85);
                split.calcMergeTime(this.config.playerRecombineTime);
                this.setAsMovingNode(split);
                this.addNode(split);
            }
        }
    }, {
        key: 'ejectMass',
        value: function ejectMass(client) {
            for (var i = 0; i < client.cells.length; i++) {
                var cell = client.cells[i];
                if (!cell) {
                    continue;
                }
                if (cell.mass < this.config.playerMinMassEject) {
                    continue;
                }
                var deltaY = client.mouse.y - cell.position.y;
                var deltaX = client.mouse.x - cell.position.x;
                var angle = Math.atan2(deltaX, deltaY);
                var size = cell.getSize() + 5;
                var startPos = {
                    x: cell.position.x + (size + this.config.ejectMass) * Math.sin(angle),
                    y: cell.position.y + (size + this.config.ejectMass) * Math.cos(angle)
                };
                cell.mass -= this.config.ejectMassLoss;
                angle += Math.random() * .4 - .2;
                var ejected = new _entityIndex.EjectedMass(this.getNextNodeId(), null, startPos, this.config.ejectMass, null);
                ejected.setAngle(angle);
                ejected.setMoveEngineData(this.config.ejectSpeed, 20, null);
                ejected.setColor(cell.getColor());
                this.addNode(ejected);
                this.setAsMovingNode(ejected);
            }
        }
    }, {
        key: 'newCellVirused',
        value: function newCellVirused(client, parent, angle, mass, speed) {
            var startPos = {
                x: parent.position.x,
                y: parent.position.y
            };
            var newCell = new _entityIndex.PlayerCell(this.getNextNodeId(), client, startPos, mass, null);
            newCell.setAngle(angle);
            newCell.setMoveEngineData(speed, 15, null);
            newCell.calcMergeTime(this.config.playerRecombineTime);
            newCell.ignoreCollision = true;
            this.addNode(newCell);
            this.setAsMovingNode(newCell);
        }
    }, {
        key: 'shootVirus',
        value: function shootVirus(parent) {
            var parentPos = {
                x: parent.position.x,
                y: parent.position.y
            };
            var newVirus = new _entityIndex.Virus(this.getNextNodeId(), null, parentPos, this.config.virusStartMass, null);
            newVirus.setAngle(parent.getAngle());
            newVirus.setMoveEngineData(200, 20, null);
            this.addNode(newVirus);
            this.setAsMovingNode(newVirus);
        }
    }, {
        key: 'getCellsInRange',
        value: function getCellsInRange(cell) {
            var list = new Array();
            var squareR = cell.getSquareSize();
            var len = cell.owner.visibleNodes.length;
            for (var i = 0; i < len; i++) {
                var check = cell.owner.visibleNodes[i];
                if (typeof check === 'undefined') {
                    continue;
                }
                if (check.inRange) {
                    continue;
                }
                if (cell.nodeId == check.nodeId) {
                    continue;
                }
                if (cell.owner == check.owner && cell.ignoreCollision) {
                    continue;
                }
                if (!check.collisionCheck2(squareR, cell.position)) {
                    continue;
                }
                var multiplier = 1.25;
                switch (check.getType()) {
                    case 1:
                        list.push(check);
                        check.inRange = true;
                        continue;
                    case 2:
                        multiplier = 1.33;
                        break;
                    case 0:
                        if (check.owner == cell.owner) {
                            if (cell.recombineTicks > 0 || check.recombineTicks > 0) {
                                continue;
                            }
                            multiplier = 1.00;
                        }
                        if (this.gameMode.haveTeams) {
                            if (!check.owner) {
                                continue;
                            }
                            if (check.owner != cell.owner && check.owner.getTeam() == cell.owner.getTeam()) {
                                continue;
                            }
                        }
                        break;
                    default:
                        break;
                }
                if (check.mass * multiplier > cell.mass) {
                    continue;
                }
                var xs = Math.pow(check.position.x - cell.position.x, 2);
                var ys = Math.pow(check.position.y - cell.position.y, 2);
                var dist = Math.sqrt(xs + ys);
                var eatingRange = cell.getSize() - check.getEatingRange();
                if (dist > eatingRange) {
                    continue;
                }
                list.push(check);
                check.inRange = true;
            }
            return list;
        }
    }, {
        key: 'getNearestVirus',
        value: function getNearestVirus(cell) {
            var virus = null;
            var r = 100;
            var topY = cell.position.y - r;
            var bottomY = cell.position.y + r;
            var leftX = cell.position.x - r;
            var rightX = cell.position.x + r;
            var len = this.nodesVirus.length;
            for (var i = 0; i < len; i++) {
                var check = this.nodesVirus[i];
                if (typeof check === 'undefined') {
                    continue;
                }
                if (!check.collisionCheck(bottomY, topY, rightX, leftX)) {
                    continue;
                }
                virus = check;
                break;
            }
            return virus;
        }
    }, {
        key: 'updateCells',
        value: function updateCells() {
            if (!this.run) {
                return;
            }
            var massDecay = 1 - this.config.playerMassDecayRate * this.gameMode.decayMod;
            for (var i = 0; i < this.nodesPlayer.length; i++) {
                var cell = this.nodesPlayer[i];
                if (!cell) {
                    continue;
                }
                if (cell.recombineTicks > 0) {
                    cell.recombineTicks--;
                }
                if (cell.mass >= this.config.playerMinMassDecay) {
                    cell.mass *= massDecay;
                }
            }
        }
    }, {
        key: 'loadConfig',
        value: function loadConfig() {
            try {
                var load = ini.parse(fs.readFileSync('./gameserver.ini', 'utf-8'));
                for (var obj in load) {
                    this.config[obj] = load[obj];
                }
            } catch (err) {
                console.log("[Game] Config not found... Generating new config");
                fs.writeFileSync('./gameserver.ini', ini.stringify(this.config, null));
            }
        }
    }, {
        key: 'switchSpectator',
        value: function switchSpectator(player) {
            if (this.gameMode.specByLeaderboard) {
                player.spectatedPlayer++;
                if (player.spectatedPlayer == this.leaderboard.length) {
                    player.spectatedPlayer = 0;
                }
            } else {
                var oldPlayer = player.spectatedPlayer + 1;
                var count = 0;
                while (player.spectatedPlayer != oldPlayer && count != this.clients.length) {
                    if (oldPlayer == this.clients.length) {
                        oldPlayer = 0;
                        continue;
                    }
                    if (!this.clients[oldPlayer]) {
                        player.spectatedPlayer = -1;
                        break;
                    }
                    if (this.clients[oldPlayer].playerTracker.cells.length > 0) {
                        break;
                    }
                    oldPlayer++;
                    count++;
                }
                if (count == this.clients.length) {
                    player.spectatedPlayer = -1;
                } else {
                    player.spectatedPlayer = oldPlayer;
                }
            }
        }
    }, {
        key: 'startStatsServer',
        value: function startStatsServer(port) {
            if (port < 1) {
                return;
            }
            this.stats = "Test";
            this.getStats();
            this.httpServer = http.createServer((function (req, res) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.writeHead(200);
                res.end(this.stats);
            }).bind(this));
            this.httpServer.listen(port, (function () {
                console.log("[Game] Loaded stats server on port " + port);
                setInterval(this.getStats.bind(this), this.config.serverStatsUpdate * 1000);
            }).bind(this));
        }
    }, {
        key: 'getStats',
        value: function getStats() {
            var players = 0;
            this.clients.forEach(function (client) {
                if (client.playerTracker && client.playerTracker.cells.length > 0) players++;
            });
            var s = {
                'current_players': this.clients.length,
                'alive': players,
                'spectators': this.clients.length - players,
                'max_players': this.config.serverMaxConnections,
                'gamemode': this.gameMode.name,
                'start_time': this.startTime
            };
            this.stats = JSON.stringify(s);
        }
    }]);

    return GameServer;
})();

exports['default'] = GameServer;

WebSocket['sendPacket'] = function (packet) {
    function getBuf(data) {
        var array = new Uint8Array(data.buffer || data);
        var l = data.byteLength || data.length;
        var o = data.byteOffset || 0;
        var buffer = new Buffer(l);
        for (var i = 0; i < l; i++) {
            buffer[i] = array[o + i];
        }
        return buffer;
    }
    if (this.readyState == WebSocket.OPEN && packet.build) {
        var buf = packet.build();
        this.send(getBuf(buf), { binary: true });
    } else if (!packet.build) {} else {
        this.readyState = WebSocket.CLOSED;
        this.emit('close');
        this.removeAllListeners();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdhbWVTZXJ2ZXIudHMiXSwibmFtZXMiOlsiR2FtZVNlcnZlciIsIkdhbWVTZXJ2ZXIuY29uc3RydWN0b3IiLCJHYW1lU2VydmVyLnN0YXJ0IiwiR2FtZVNlcnZlci5zdGFydC5lcnIiLCJHYW1lU2VydmVyLnN0YXJ0LmNvbm5lY3Rpb25Fc3RhYmxpc2hlZCIsIkdhbWVTZXJ2ZXIuc3RhcnQuY29ubmVjdGlvbkVzdGFibGlzaGVkLmNsb3NlIiwiR2FtZVNlcnZlci5nZXRNb2RlIiwiR2FtZVNlcnZlci5nZXROZXh0Tm9kZUlkIiwiR2FtZVNlcnZlci5nZXROZXdQbGF5ZXJJRCIsIkdhbWVTZXJ2ZXIuZ2V0UmFuZG9tUG9zaXRpb24iLCJHYW1lU2VydmVyLmdldFJhbmRvbVNwYXduIiwiR2FtZVNlcnZlci5nZXRSYW5kb21Db2xvciIsIkdhbWVTZXJ2ZXIuYWRkTm9kZSIsIkdhbWVTZXJ2ZXIucmVtb3ZlTm9kZSIsIkdhbWVTZXJ2ZXIuY2VsbFRpY2siLCJHYW1lU2VydmVyLnNwYXduVGljayIsIkdhbWVTZXJ2ZXIuZ2FtZW1vZGVUaWNrIiwiR2FtZVNlcnZlci5jZWxsVXBkYXRlVGljayIsIkdhbWVTZXJ2ZXIubWFpbkxvb3AiLCJHYW1lU2VydmVyLnVwZGF0ZUNsaWVudHMiLCJHYW1lU2VydmVyLnN0YXJ0aW5nRm9vZCIsIkdhbWVTZXJ2ZXIudXBkYXRlRm9vZCIsIkdhbWVTZXJ2ZXIuc3Bhd25Gb29kIiwiR2FtZVNlcnZlci5zcGF3blBsYXllciIsIkdhbWVTZXJ2ZXIudmlydXNDaGVjayIsIkdhbWVTZXJ2ZXIudXBkYXRlTW92ZUVuZ2luZSIsIkdhbWVTZXJ2ZXIuc2V0QXNNb3ZpbmdOb2RlIiwiR2FtZVNlcnZlci5zcGxpdENlbGxzIiwiR2FtZVNlcnZlci5lamVjdE1hc3MiLCJHYW1lU2VydmVyLm5ld0NlbGxWaXJ1c2VkIiwiR2FtZVNlcnZlci5zaG9vdFZpcnVzIiwiR2FtZVNlcnZlci5nZXRDZWxsc0luUmFuZ2UiLCJHYW1lU2VydmVyLmdldE5lYXJlc3RWaXJ1cyIsIkdhbWVTZXJ2ZXIudXBkYXRlQ2VsbHMiLCJHYW1lU2VydmVyLmxvYWRDb25maWciLCJHYW1lU2VydmVyLnN3aXRjaFNwZWN0YXRvciIsIkdhbWVTZXJ2ZXIuc3RhcnRTdGF0c1NlcnZlciIsIkdhbWVTZXJ2ZXIuZ2V0U3RhdHMiLCJnZXRCdWYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2tCQUUyQixJQUFJOztJQUFuQixTQUFTOztvQkFDQyxNQUFNOztJQUFoQixJQUFJOztrQkFDSyxJQUFJOztJQUFiLEVBQUU7OzBCQUVPLGVBQWU7O0lBQXhCLEdBQUc7OzJCQUdTLGdCQUFnQjs7SUFBNUIsTUFBTTs7OEJBQ1EsbUJBQW1COztJQUFqQyxRQUFROzsyQkFFc0MsZ0JBQWdCOzs2QkFDaEQsaUJBQWlCOzs7OzZCQUNqQixpQkFBaUI7Ozs7MkJBRXJCLGdCQUFnQjs7OzswQkFDbkIsZUFBZTs7OztzQkFDZixVQUFVOzs7O0lBRzdCLFVBQUE7QUF1Q0VBLGFBdkNGLFVBQUEsR0F1Q0VBOzhCQXZDRixVQUFBOztBQXlDSUMsWUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0E7QUFDaEJBLFlBQUlBLENBQUNBLFVBQVVBLEdBQUdBLENBQUNBLENBQUNBO0FBQ3BCQSxZQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUN0QkEsWUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDbEJBLFlBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO0FBQ2hCQSxZQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUNyQkEsWUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDdkJBLFlBQUlBLENBQUNBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBO0FBRXRCQSxZQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNyQkEsWUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDdEJBLFlBQUlBLENBQUNBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBO0FBQ3RCQSxZQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUVwQ0EsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsNkJBQWNBLElBQUlBLENBQUNBLENBQUNBO0FBQ2hDQSxZQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSw2QkFBWUEsQ0FBQ0E7QUFDeEJBLFlBQUlBLENBQUNBLFFBQVFBLENBQUNBO0FBR2RBLFlBQUlBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLElBQUlBLElBQUlBLEVBQUFBLENBQUNBO0FBQ3RCQSxZQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtBQUMzQkEsWUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDZEEsWUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDbEJBLFlBQUlBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBO0FBR25CQSxZQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSx5QkFBWUEsQ0FBQ0E7QUFHM0JBLFlBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO0FBR2xCQSxZQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtBQUd6REEsWUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FDWkEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUdBLENBQUNBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFHQSxDQUFDQSxFQUFDQSxFQUMzQkEsRUFBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBR0EsQ0FBQ0EsRUFBQ0EsRUFDM0JBLEVBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUNBLEdBQUdBLEVBQUNBLEVBQzNCQSxFQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFDQSxHQUFHQSxFQUFDQSxDQUM1QkEsQ0FBQ0E7S0FDSEE7O2lCQTFGSCxVQUFBOztlQTZGT0QsaUJBQUFBO0FBRUhFLGdCQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUdyQkEsZ0JBQUlBLENBQUNBLFFBQVFBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBRWpDQSxnQkFBSUEsY0FBY0EsR0FBR0EsU0FBakJBLGNBQWNBLEdBQUdBO0FBRW5CLG9CQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFHcEIsMkJBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUd6Qyx1QkFBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xFLHVCQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFHakUsb0JBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO0FBQzlCLHlCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDN0MsNEJBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ3BCO0FBQ0QsMkJBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUMsY0FBYyxDQUFDLENBQUM7aUJBQ3JFO2FBQ0YsQ0FBQUE7QUFHREEsZ0JBQUlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLFNBQVNBLENBQUNBLE1BQU1BLENBQ3BDQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxFQUFFQSxpQkFBaUJBLEVBQUVBLEtBQUtBLEVBQUNBLEVBQ3pEQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUM1QkEsQ0FBQ0E7QUFFRkEsZ0JBQUlBLENBQUNBLFlBQVlBLENBQUNBLEVBQUVBLENBQUNBLFlBQVlBLEVBQUVBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFHckVBLGdCQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxFQUFFQSxTQUFBQSxHQUFBQSxDQUFhQSxDQUFDQSxFQUFBQTtBQUMxQ0Msd0JBQVFBLENBQUNBLENBQUNBLElBQUlBO0FBQ1pBLHlCQUFLQSxZQUFZQTtBQUNmQSwrQkFBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0Esb0RBQW9EQSxDQUFDQSxDQUFDQTtBQUNsRUEsOEJBQU1BO0FBQUFBLEFBQ1JBLHlCQUFLQSxRQUFRQTtBQUNYQSwrQkFBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsNkNBQTZDQSxDQUFDQSxDQUFDQTtBQUMzREEsOEJBQU1BO0FBQUFBLEFBQ1JBO0FBQ0VBLCtCQUFPQSxDQUFDQSxHQUFHQSxvQ0FBa0NBLENBQUNBLENBQUNBLElBQUlBLENBQUdBLENBQUNBO0FBQ3ZEQSw4QkFBTUE7QUFBQUEsaUJBQ1RBO0FBQ0RBLHVCQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTthQUNqQkEsQ0FBQ0QsQ0FBQ0E7QUFFSEEscUJBQUFBLHFCQUFBQSxDQUErQkEsRUFBRUEsRUFBQUE7QUFFL0JFLG9CQUFJQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxvQkFBb0JBLEVBQUVBO0FBQzNEQSxzQkFBRUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7QUFDWEEsMkJBQU9BO2lCQUNSQTtBQVVEQSxvQkFBSUEsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7QUFDMUNBLG9CQUFJQSxNQUFNQSxJQUFJQSxnQkFBZ0JBLElBQUlBLE1BQU1BLElBQUlBLGlCQUFpQkEsSUFDdERBLE1BQU1BLElBQUlBLGtCQUFrQkEsSUFBSUEsTUFBTUEsSUFBSUEsbUJBQW1CQSxJQUM3REEsTUFBTUEsSUFBSUEsa0JBQWtCQSxJQUFJQSxNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBO0FBQ3BFQSxzQkFBRUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7QUFDYkEsMkJBQU9BO2lCQUNSQTtBQUdEQSx5QkFBQUEsS0FBQUEsQ0FBZUEsS0FBS0EsRUFBQUE7QUFFbEJDLHdCQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtBQUV4REEsd0JBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLENBQUNBO0FBQ3ZDQSx3QkFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7QUFDakRBLHlCQUFLQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQTtBQUM1QkEsNEJBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBRTlDQSw0QkFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUE7QUFDVEEscUNBQVNBO3lCQUNWQTtBQUdEQSw0QkFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsWUFBQUE7QUFBWSxtQ0FBTzt5QkFBQyxDQUFDQTtxQkFFdENBO0FBRURBLDBCQUFNQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxvQkFBb0JBLEdBQUdBLEVBQUVBLENBQUNBO0FBRWpFQSx3QkFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsR0FBR0EsWUFBQUE7QUFBWSwrQkFBTztxQkFBQyxDQUFDQTtpQkFDL0NBO0FBRURELGtCQUFFQSxDQUFDQSxhQUFhQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxhQUFhQSxDQUFDQTtBQUM1Q0Esa0JBQUVBLENBQUNBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBO0FBQ3RDQSxvQkFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7QUFFckNBLGtCQUFFQSxDQUFDQSxhQUFhQSxHQUFHQSwrQkFBa0JBLElBQUlBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0FBQy9DQSxrQkFBRUEsQ0FBQ0EsYUFBYUEsR0FBR0EsK0JBQWtCQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtBQUMvQ0Esa0JBQUVBLENBQUNBLEVBQUVBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBO0FBRXhFQSxvQkFBSUEsVUFBVUEsR0FBR0EsRUFBRUEsTUFBTUEsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0E7QUFDOUNBLGtCQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxFQUFFQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUN2Q0Esa0JBQUVBLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLEVBQUVBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO0FBQ3ZDQSxvQkFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7YUFDckJBO0FBRURGLGdCQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1NBQ3BEQTs7O2VBRU1GLG1CQUFBQTtBQUNMTSxtQkFBT0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7U0FDdEJBOzs7ZUFFWU4seUJBQUFBO0FBR1hPLGdCQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxFQUFFQTtBQUNoQ0Esb0JBQUlBLENBQUNBLFVBQVVBLEdBQUdBLENBQUNBLENBQUNBO2FBQ3JCQTtBQUNEQSxtQkFBT0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7U0FDMUJBOzs7ZUFFYVAsMEJBQUFBO0FBR1pRLGdCQUFJQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxVQUFVQSxFQUFFQTtBQUNsQ0Esb0JBQUlBLENBQUNBLFlBQVlBLEdBQUdBLENBQUNBLENBQUNBO2FBQ3ZCQTtBQUNEQSxtQkFBT0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7U0FDNUJBOzs7ZUFFZ0JSLDZCQUFBQTtBQUNmUyxtQkFBT0E7QUFDTEEsaUJBQUNBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFVBQVVBLENBQUFBLEFBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFVBQVVBO0FBQzFHQSxpQkFBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQUEsQUFBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0E7YUFDMUdBLENBQUNBO1NBQ0hBOzs7ZUFFYVQsMEJBQUFBO0FBRVpVLGdCQUFJQSxHQUFHQSxDQUFDQTtBQUVSQSxnQkFBSUEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsRUFBRUE7QUFFeEJBLG9CQUFJQSxJQUFJQSxDQUFDQTtBQUNUQSxxQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQUFBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFFakRBLHdCQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUVyQkEsd0JBQUlBLENBQUNBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBO0FBRXpCQSxpQ0FBU0E7cUJBQ1ZBO0FBRURBLHdCQUFJQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUFFQTtBQUN2QkEsMkJBQUdBLEdBQUdBLEVBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEVBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEVBQUNBLENBQUNBO0FBQzlDQSw0QkFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDdEJBLDhCQUFNQTtxQkFDUEE7aUJBQ0ZBO2FBQ0ZBO0FBRURBLGdCQUFJQSxDQUFDQSxHQUFHQSxFQUFFQTtBQUVSQSxtQkFBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTthQUNoQ0E7QUFFREEsbUJBQU9BLEdBQUdBLENBQUNBO1NBQ1pBOzs7ZUFFYVYsMEJBQUFBO0FBQ1pXLGdCQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtBQUMzREEsZ0JBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0FBQy9CQSxtQkFBT0E7QUFDTEEsaUJBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO0FBQ1ZBLGlCQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtBQUNWQSxpQkFBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7YUFDWEEsQ0FBQ0E7U0FDSEE7OztlQUVNWCxpQkFBQ0EsSUFBSUEsRUFBQUE7QUFDVlksZ0JBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBR3RCQSxnQkFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUE7QUFDZEEsb0JBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0FBQ2hDQSxvQkFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDNUJBLG9CQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTthQUN4REE7QUFHREEsZ0JBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBR2pCQSxpQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFDM0NBLG9CQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxhQUFhQSxDQUFDQTtBQUMzQ0Esb0JBQUlBLENBQUNBLE1BQU1BLEVBQUVBO0FBQ1hBLDZCQUFTQTtpQkFDVkE7QUFJREEsb0JBQUlBLFNBQVNBLElBQUlBLE1BQU1BLENBQUNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLEVBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBO0FBQ3BGQSwwQkFBTUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtpQkFDckNBO2FBQ0ZBO1NBQ0ZBOzs7ZUFFU1osb0JBQUNBLElBQUlBLEVBQUFBO0FBRWJhLGdCQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUNyQ0EsZ0JBQUlBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBO0FBQ2ZBLG9CQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTthQUM3QkE7QUFHREEsaUJBQUtBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBQ3ZDQSxnQkFBSUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUE7QUFDZkEsb0JBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2FBQ25DQTtBQUdEQSxnQkFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFHcEJBLGlCQUFLQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFDQSxDQUFDQSxFQUFFQSxFQUFFQTtBQUMzQ0Esb0JBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBO0FBQzNDQSxvQkFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUE7QUFDWEEsNkJBQVNBO2lCQUNWQTtBQUdEQSxzQkFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTthQUNwQ0E7U0FDRkE7OztlQUVPYixvQkFBQUE7QUFFTmMsZ0JBQUlBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7U0FDekJBOzs7ZUFFUWQscUJBQUFBO0FBRVBlLGdCQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtBQUNqQkEsZ0JBQUlBLElBQUlBLENBQUNBLFNBQVNBLElBQUlBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLEVBQUVBO0FBQy9DQSxvQkFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7QUFDbEJBLG9CQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtBQUVsQkEsb0JBQUlBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBO2FBQ3BCQTtTQUNGQTs7O2VBRVdmLHdCQUFBQTtBQUVWZ0IsZ0JBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1NBQzVCQTs7O2VBRWFoQiwwQkFBQUE7QUFFWmlCLGdCQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtTQUNwQkE7OztlQUdPakIsb0JBQUFBO0FBRU5rQixnQkFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsRUFBRUEsQ0FBQ0E7QUFFdkJBLGdCQUFJQSxDQUFDQSxJQUFJQSxJQUFLQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxBQUFDQSxDQUFDQTtBQUNsQ0EsZ0JBQUlBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBO0FBRW5CQSxnQkFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsSUFBSUEsRUFBRUEsRUFBRUE7QUFFbkJBLG9CQUFJQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQTtBQUNaQSw4QkFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDL0JBLDhCQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUNoQ0EsOEJBQVVBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2lCQUNwQ0E7QUFHREEsb0JBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO0FBR3JCQSxvQkFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7QUFDaEJBLG9CQUFJQSxJQUFJQSxDQUFDQSxRQUFRQSxJQUFJQSxFQUFFQSxFQUFFQTtBQUN2QkEsOEJBQVVBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO0FBR3JDQSx3QkFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0E7QUFDdEJBLHdCQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUM3QkEsd0JBQUlBLE1BQU1BLEdBQUdBLElBQUlBLE1BQU1BLENBQUNBLGlCQUFpQkEsQ0FDckNBLElBQUlBLENBQUNBLFdBQVdBLEVBQ2hCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtBQUU1QkEsd0JBQUlBLENBQUNBLFNBQVNBLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO0FBRWhDQSx3QkFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7aUJBQ25CQTtBQU1EQSxvQkFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7YUFDZkE7U0FDRkE7OztlQUdZbEIseUJBQUFBO0FBQ1htQixpQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFDNUNBLG9CQUFJQSxPQUFPQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxXQUFXQSxFQUFFQTtBQUN6Q0EsNkJBQVNBO2lCQUNWQTtBQUVEQSxvQkFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7YUFDeENBO1NBQ0ZBOzs7ZUFFV25CLHdCQUFBQTtBQUVWb0IsaUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBO0FBQ3BEQSxvQkFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7YUFDbEJBO1NBQ0ZBOzs7ZUFFU3BCLHNCQUFBQTtBQUNScUIsZ0JBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLEdBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUVBLENBQUNBO0FBQ2pHQSxpQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsT0FBT0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFDaENBLG9CQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTthQUNsQkE7U0FDRkE7OztlQUVRckIscUJBQUFBO0FBQ1BzQixnQkFBSUEsQ0FBQ0EsR0FBR0Esc0JBQVNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLGlCQUFpQkEsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDbkdBLGFBQUNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBLENBQUNBO0FBRWxDQSxnQkFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDaEJBLGdCQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtTQUNwQkE7OztlQUVVdEIscUJBQUNBLE1BQU1BLEVBQUNBLEdBQUdBLEVBQUNBLElBQUlBLEVBQUFBO0FBRXpCdUIsZ0JBQUlBLEdBQUdBLElBQUlBLElBQUlBLEVBQUVBO0FBQ2ZBLG1CQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTthQUM3QkE7QUFFREEsZ0JBQUlBLElBQUlBLElBQUlBLElBQUlBLEVBQUVBO0FBQ2hCQSxvQkFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7YUFDcENBO0FBR0RBLGdCQUFJQSxJQUFJQSxHQUFHQSw0QkFBZUEsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsTUFBTUEsRUFBRUEsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDekVBLGdCQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUduQkEsa0JBQU1BLENBQUNBLEtBQUtBLEdBQUdBLEVBQUNBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUNBLENBQUNBO1NBQ3JDQTs7O2VBRVN2QixzQkFBQUE7QUFFUndCLGdCQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxFQUFFQTtBQUV2REEsb0JBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7QUFDbkNBLG9CQUFJQSxlQUFlQSxHQUFHQSxBQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxHQUFHQSxHQUFHQSxJQUFLQSxDQUFDQSxDQUFDQTtBQUc5REEscUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBO0FBQ2hEQSx3QkFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFaENBLHdCQUFJQSxLQUFLQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxFQUFFQTtBQUMzQ0EsaUNBQVNBO3FCQUNWQTtBQUVEQSx3QkFBSUEsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7QUFFcENBLHdCQUFJQSxFQUFFQSxHQUFHQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUNsQ0Esd0JBQUlBLEVBQUVBLEdBQUdBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO0FBRWxDQSx3QkFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsZUFBZUEsSUFBSUEsT0FBT0EsRUFDaERBLE9BQU9BO2lCQUNWQTtBQUdEQSxvQkFBSUEsQ0FBQ0EsR0FBR0EsdUJBQVVBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGNBQWNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBQ3JGQSxvQkFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7YUFDakJBO1NBQ0ZBOzs7ZUFFZXhCLDRCQUFBQTtBQUVkeUIsZ0JBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBO0FBQ2xDQSxpQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFDNUJBLG9CQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUcvQkEsb0JBQUlBLENBQUNBLElBQUlBLEVBQUNBO0FBQ1JBLDZCQUFTQTtpQkFDVkE7QUFFREEsb0JBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO0FBRXhCQSxvQkFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFHcERBLG9CQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUN0Q0EscUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUdBLENBQUNBLEVBQUVBLEVBQUVBO0FBQ3JDQSx3QkFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFJcEJBLHdCQUFJQSxLQUFLQSxDQUFDQSxRQUFRQSxJQUFJQSxDQUFDQSxFQUFFQTtBQUN2QkEsMkJBQUdBLEVBQUVBLENBQUNBO0FBQ05BLDRCQUFJQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQTtBQUM5QkEsNkJBQUNBLEVBQUVBLENBQUNBO3lCQUNMQTtxQkFDRkE7QUFHREEseUJBQUtBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBRzNCQSx5QkFBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7QUFDdEJBLHdCQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtpQkFDeEJBO2FBQ0ZBO0FBR0RBLGVBQUdBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBO0FBQzlCQSxpQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFDNUJBLG9CQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUdoQ0EsdUJBQU9BLEFBQUNBLE9BQU9BLEtBQUtBLElBQUlBLFdBQVdBLElBQU1BLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEFBQUNBLEVBQUVBO0FBRXJFQSx3QkFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDOUJBLHlCQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtpQkFDN0JBO0FBRURBLG9CQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQTtBQUNoQ0EsNkJBQVNBO2lCQUNWQTtBQUVEQSxvQkFBSUEsS0FBS0EsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsRUFBRUE7QUFDN0JBLHlCQUFLQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUV2QkEseUJBQUtBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2lCQUNqQ0EsTUFBTUE7QUFFTEEseUJBQUtBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0FBRXJCQSx3QkFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7QUFDNUNBLHdCQUFJQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQTtBQUNmQSw0QkFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7cUJBQ25DQTtpQkFDRkE7YUFDRkE7U0FDRkE7OztlQUVjekIseUJBQUNBLElBQUlBLEVBQUFBO0FBQ2xCMEIsZ0JBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1NBQzdCQTs7O2VBRVMxQixvQkFBQ0EsTUFBcUJBLEVBQUFBO0FBQzlCMkIsZ0JBQUlBLEdBQUdBLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBO0FBQzlCQSxpQkFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFDNUJBLG9CQUFJQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxFQUFFQTtBQUVyREEsNkJBQVNBO2lCQUNWQTtBQUVEQSxvQkFBSUEsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDM0JBLG9CQUFJQSxDQUFDQSxJQUFJQSxFQUFFQTtBQUNUQSw2QkFBU0E7aUJBQ1ZBO0FBRURBLG9CQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxrQkFBa0JBLEVBQUVBO0FBQzlDQSw2QkFBU0E7aUJBQ1ZBO0FBR0RBLG9CQUFJQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUM5Q0Esb0JBQUlBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO0FBQzlDQSxvQkFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7QUFHdENBLG9CQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxHQUFDQSxDQUFDQSxDQUFDQTtBQUM1QkEsb0JBQUlBLFFBQVFBLEdBQUdBO0FBQ2JBLHFCQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFLQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxBQUFFQTtBQUMvQ0EscUJBQUNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUtBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLEFBQUVBO2lCQUNoREEsQ0FBQ0E7QUFFRkEsb0JBQUlBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO0FBQ3JDQSxvQkFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDNUJBLG9CQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxPQUFPQSxDQUFDQTtBQUVwQkEsb0JBQUlBLEtBQUtBLEdBQUdBLDRCQUFlQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxFQUFFQSxNQUFNQSxFQUFFQSxRQUFRQSxFQUFFQSxPQUFPQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUNsRkEscUJBQUtBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0FBQ3RCQSxxQkFBS0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxVQUFVQSxFQUFFQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUM5Q0EscUJBQUtBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0E7QUFHckRBLG9CQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtBQUM1QkEsb0JBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2FBQ3JCQTtTQUNGQTs7O2VBRVEzQixtQkFBQ0EsTUFBTUEsRUFBQUE7QUFDZDRCLGlCQUFLQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQTtBQUM1Q0Esb0JBQUlBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBRTNCQSxvQkFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUE7QUFDVEEsNkJBQVNBO2lCQUNWQTtBQUVEQSxvQkFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQTtBQUM5Q0EsNkJBQVNBO2lCQUNWQTtBQUVEQSxvQkFBSUEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDOUNBLG9CQUFJQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUM5Q0Esb0JBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUNBLE1BQU1BLENBQUNBLENBQUNBO0FBR3RDQSxvQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDOUJBLG9CQUFJQSxRQUFRQSxHQUFHQTtBQUNmQSxxQkFBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBS0EsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQUEsR0FBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQUFBRUE7QUFDekVBLHFCQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFLQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFBQSxHQUFJQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxBQUFFQTtpQkFDeEVBLENBQUNBO0FBR0ZBLG9CQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQTtBQUV2Q0EscUJBQUtBLElBQUlBLEFBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUlBLEVBQUVBLENBQUNBO0FBR25DQSxvQkFBSUEsT0FBT0EsR0FBR0EsNkJBQWdCQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxFQUFFQSxJQUFJQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUNqR0EsdUJBQU9BLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0FBQ3hCQSx1QkFBT0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxFQUFFQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUM1REEsdUJBQU9BLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLENBQUNBO0FBRWxDQSxvQkFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7QUFDdEJBLG9CQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTthQUMvQkE7U0FDRkE7OztlQUVhNUIsd0JBQUNBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLEtBQUtBLEVBQUVBLElBQUlBLEVBQUVBLEtBQUtBLEVBQUFBO0FBRS9DNkIsZ0JBQUlBLFFBQVFBLEdBQUdBO0FBQ2JBLGlCQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtBQUNwQkEsaUJBQUNBLEVBQUVBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2FBQ3JCQSxDQUFDQTtBQUdGQSxnQkFBSUEsT0FBT0EsR0FBR0EsNEJBQWVBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLE1BQU1BLEVBQUVBLFFBQVFBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBQ2pGQSxtQkFBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7QUFDeEJBLG1CQUFPQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBQzNDQSxtQkFBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQTtBQUN2REEsbUJBQU9BLENBQUNBLGVBQWVBLEdBQUdBLElBQUlBLENBQUNBO0FBRy9CQSxnQkFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7QUFDdEJBLGdCQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtTQUMvQkE7OztlQUVTN0Isb0JBQUNBLE1BQU1BLEVBQUFBO0FBQ2Y4QixnQkFBSUEsU0FBU0EsR0FBR0E7QUFDaEJBLGlCQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtBQUNwQkEsaUJBQUNBLEVBQUVBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2FBQ25CQSxDQUFDQTtBQUVGQSxnQkFBSUEsUUFBUUEsR0FBR0EsdUJBQVVBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLElBQUlBLEVBQUVBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGNBQWNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBQ2xHQSxvQkFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7QUFDckNBLG9CQUFRQSxDQUFDQSxpQkFBaUJBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBRzFDQSxnQkFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7QUFDdkJBLGdCQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtTQUNoQ0E7OztlQUVjOUIseUJBQUNBLElBQUlBLEVBQUFBO0FBQ2xCK0IsZ0JBQUlBLElBQUlBLEdBQUdBLElBQUlBLEtBQUtBLEVBQUVBLENBQUNBO0FBQ3ZCQSxnQkFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7QUFHbkNBLGdCQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQTtBQUN6Q0EsaUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUNBLENBQUNBLEVBQUVBLEVBQUVBO0FBQzFCQSxvQkFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFdkNBLG9CQUFJQSxPQUFPQSxLQUFLQSxLQUFLQSxXQUFXQSxFQUFFQTtBQUNoQ0EsNkJBQVNBO2lCQUNWQTtBQUdEQSxvQkFBSUEsS0FBS0EsQ0FBQ0EsT0FBT0EsRUFBRUE7QUFDakJBLDZCQUFTQTtpQkFDVkE7QUFHREEsb0JBQUlBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBO0FBQy9CQSw2QkFBU0E7aUJBQ1ZBO0FBR0RBLG9CQUFJQSxBQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxJQUFNQSxJQUFJQSxDQUFDQSxlQUFlQSxBQUFDQSxFQUFFQTtBQUN6REEsNkJBQVNBO2lCQUNWQTtBQUdEQSxvQkFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFBRUE7QUFDbERBLDZCQUFTQTtpQkFDVkE7QUFHREEsb0JBQUlBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBO0FBRXRCQSx3QkFBUUEsS0FBS0EsQ0FBQ0EsT0FBT0EsRUFBRUE7QUFDckJBLHlCQUFLQSxDQUFDQTtBQUNKQSw0QkFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7QUFDakJBLDZCQUFLQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTtBQUNyQkEsaUNBQVNBO0FBQUFBLEFBQ1hBLHlCQUFLQSxDQUFDQTtBQUNKQSxrQ0FBVUEsR0FBR0EsSUFBSUEsQ0FBQ0E7QUFDbEJBLDhCQUFNQTtBQUFBQSxBQUNSQSx5QkFBS0EsQ0FBQ0E7QUFFSkEsNEJBQUlBLEtBQUtBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBO0FBQzdCQSxnQ0FBSUEsQUFBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsSUFBTUEsS0FBS0EsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQUFBQ0EsRUFBRUE7QUFDM0RBLHlDQUFTQTs2QkFDVkE7QUFFREEsc0NBQVVBLEdBQUdBLElBQUlBLENBQUNBO3lCQUNuQkE7QUFHREEsNEJBQUlBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEVBQUVBO0FBQzNCQSxnQ0FBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUE7QUFDaEJBLHlDQUFTQTs2QkFDVkE7QUFFREEsZ0NBQUlBLEFBQUNBLEtBQUtBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLElBQ3RCQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxFQUFFQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxFQUFFQSxBQUFDQSxFQUFFQTtBQUN0REEseUNBQVNBOzZCQUNWQTt5QkFDRkE7QUFDREEsOEJBQU1BO0FBQUFBLEFBQ1JBO0FBQ0VBLDhCQUFNQTtBQUFBQSxpQkFDVEE7QUFHREEsb0JBQUlBLEFBQUNBLEtBQUtBLENBQUNBLElBQUlBLEdBQUdBLFVBQVVBLEdBQUlBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBO0FBQ3pDQSw2QkFBU0E7aUJBQ1ZBO0FBR0RBLG9CQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUN6REEsb0JBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO0FBQ3pEQSxvQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBRUEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBRUEsQ0FBQ0E7QUFHaENBLG9CQUFJQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxHQUFHQSxLQUFLQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtBQUMxREEsb0JBQUlBLElBQUlBLEdBQUdBLFdBQVdBLEVBQUVBO0FBRXRCQSw2QkFBU0E7aUJBQ1ZBO0FBR0RBLG9CQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtBQUdqQkEscUJBQUtBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO2FBQ3RCQTtBQUNEQSxtQkFBT0EsSUFBSUEsQ0FBQ0E7U0FDYkE7OztlQUVjL0IseUJBQUNBLElBQUlBLEVBQUFBO0FBRWxCZ0MsZ0JBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO0FBQ2pCQSxnQkFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7QUFFWkEsZ0JBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0FBQy9CQSxnQkFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFFbENBLGdCQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNoQ0EsZ0JBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0FBR2pDQSxnQkFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7QUFDakNBLGlCQUFLQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFDQSxDQUFDQSxFQUFFQSxFQUFFQTtBQUMxQkEsb0JBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBRS9CQSxvQkFBSUEsT0FBT0EsS0FBS0EsS0FBS0EsV0FBV0EsRUFBRUE7QUFDaENBLDZCQUFTQTtpQkFDVkE7QUFFREEsb0JBQUlBLENBQUNBLEtBQUtBLENBQUNBLGNBQWNBLENBQUNBLE9BQU9BLEVBQUNBLElBQUlBLEVBQUNBLE1BQU1BLEVBQUNBLEtBQUtBLENBQUNBLEVBQUVBO0FBQ3BEQSw2QkFBU0E7aUJBQ1ZBO0FBR0RBLHFCQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtBQUNkQSxzQkFBTUE7YUFDUEE7QUFDREEsbUJBQU9BLEtBQUtBLENBQUNBO1NBQ2RBOzs7ZUFFVWhDLHVCQUFBQTtBQUNUaUMsZ0JBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBO0FBRWJBLHVCQUFPQTthQUNSQTtBQUdEQSxnQkFBSUEsU0FBU0EsR0FBR0EsQ0FBQ0EsR0FBSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsbUJBQW1CQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxBQUFDQSxDQUFDQTtBQUMvRUEsaUJBQUtBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBO0FBQ2hEQSxvQkFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFL0JBLG9CQUFJQSxDQUFDQSxJQUFJQSxFQUFFQTtBQUNUQSw2QkFBU0E7aUJBQ1ZBO0FBRURBLG9CQUFJQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxFQUFFQTtBQUUzQkEsd0JBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO2lCQUN2QkE7QUFHREEsb0JBQUlBLElBQUlBLENBQUNBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGtCQUFrQkEsRUFBRUE7QUFDL0NBLHdCQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxTQUFTQSxDQUFDQTtpQkFDeEJBO2FBQ0ZBO1NBQ0ZBOzs7ZUFFU2pDLHNCQUFBQTtBQUNSa0MsZ0JBQUlBO0FBRUZBLG9CQUFJQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFFQSxDQUFDQSxZQUFZQSxDQUFDQSxrQkFBa0JBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO0FBR25FQSxxQkFBS0EsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsRUFBRUE7QUFDcEJBLHdCQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtpQkFDOUJBO2FBQ0RBLENBQUFBLE9BQU9BLEdBQUdBLEVBQUVBO0FBRVpBLHVCQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxrREFBa0RBLENBQUNBLENBQUNBO0FBR2hFQSxrQkFBRUEsQ0FBQ0EsYUFBYUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTthQUN4RUE7U0FDRkE7OztlQUVjbEMseUJBQUNBLE1BQU1BLEVBQUFBO0FBQ3BCbUMsZ0JBQUlBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGlCQUFpQkEsRUFBRUE7QUFDbkNBLHNCQUFNQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtBQUN6QkEsb0JBQUlBLE1BQU1BLENBQUNBLGVBQWVBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBO0FBQ3JEQSwwQkFBTUEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7aUJBQzVCQTthQUNGQSxNQUFNQTtBQUVMQSxvQkFBSUEsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDM0NBLG9CQUFJQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNkQSx1QkFBT0EsTUFBTUEsQ0FBQ0EsZUFBZUEsSUFBSUEsU0FBU0EsSUFBSUEsS0FBS0EsSUFBSUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUE7QUFDMUVBLHdCQUFJQSxTQUFTQSxJQUFJQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQTtBQUNwQ0EsaUNBQVNBLEdBQUdBLENBQUNBLENBQUNBO0FBQ2RBLGlDQUFTQTtxQkFDVkE7QUFFREEsd0JBQUlBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBO0FBRTVCQSw4QkFBTUEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDNUJBLDhCQUFNQTtxQkFDUEE7QUFFREEsd0JBQUlBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEVBQUVBO0FBQzFEQSw4QkFBTUE7cUJBQ1BBO0FBRURBLDZCQUFTQSxFQUFFQSxDQUFDQTtBQUNaQSx5QkFBS0EsRUFBRUEsQ0FBQ0E7aUJBQ1RBO0FBQ0RBLG9CQUFJQSxLQUFLQSxJQUFJQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQTtBQUNoQ0EsMEJBQU1BLENBQUNBLGVBQWVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2lCQUM3QkEsTUFBTUE7QUFDTEEsMEJBQU1BLENBQUNBLGVBQWVBLEdBQUdBLFNBQVNBLENBQUNBO2lCQUNwQ0E7YUFDRkE7U0FDRkE7OztlQUllbkMsMEJBQUNBLElBQUlBLEVBQUFBO0FBRW5Cb0MsZ0JBQUlBLElBQUlBLEdBQUdBLENBQUNBLEVBQUVBO0FBQ1pBLHVCQUFPQTthQUNSQTtBQUdEQSxnQkFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0E7QUFDcEJBLGdCQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtBQUdoQkEsZ0JBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUFBLFVBQVNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUFBO0FBQ25ELG1CQUFHLENBQUMsU0FBUyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELG1CQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLG1CQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNyQixDQUFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO0FBRWRBLGdCQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFBQSxZQUFBQTtBQUUzQix1QkFBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMxRCwyQkFBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDN0UsQ0FBQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUNmQTs7O2VBRU9wQyxvQkFBQUE7QUFDTnFDLGdCQUFJQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUNoQkEsZ0JBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLFVBQVNBLE1BQU1BLEVBQUFBO0FBQ2xDLG9CQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDL0QsT0FBTyxFQUFFLENBQUE7YUFDWixDQUFDQSxDQUFDQTtBQUNIQSxnQkFBSUEsQ0FBQ0EsR0FBR0E7QUFDTkEsaUNBQWlCQSxFQUFFQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQTtBQUN0Q0EsdUJBQU9BLEVBQUVBLE9BQU9BO0FBQ2hCQSw0QkFBWUEsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0EsT0FBT0E7QUFDM0NBLDZCQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxvQkFBb0JBO0FBQy9DQSwwQkFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUE7QUFDOUJBLDRCQUFZQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQTthQUM3QkEsQ0FBQUE7QUFDREEsZ0JBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1NBQ2hDQTs7O1dBLzVCSCxVQUFBOzs7cUJBQUEsVUFBQTs7QUFvNkJBLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRyxVQUFTLE1BQU0sRUFBQTtBQUN2QyxhQUFBLE1BQUEsQ0FBZ0IsSUFBSSxFQUFBO0FBQ2xCQyxZQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUNoREEsWUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsSUFBSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7QUFDdkNBLFlBQUlBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLElBQUlBLENBQUNBLENBQUNBO0FBQzdCQSxZQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUUzQkEsYUFBS0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUE7QUFDMUJBLGtCQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUMxQkE7QUFFREEsZUFBT0EsTUFBTUEsQ0FBQ0E7S0FDZkE7QUFHRCxRQUFJLElBQUksQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3JELFlBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QixZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0tBQ3hDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFFekIsTUFBTTtBQUNMLFlBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNuQyxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25CLFlBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQzNCO0NBQ0YsQ0FBQSIsImZpbGUiOiJHYW1lU2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8gTGlicmFyeSBpbXBvcnRzXG5pbXBvcnQgKiBhcyBXZWJTb2NrZXQgZnJvbSAnd3MnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCAqIGFzIGZzICBmcm9tICdmcyc7XG5cbmltcG9ydCAqIGFzIGluaSBmcm9tICcuL21vZHVsZXMvaW5pJztcblxuLy8gUHJvamVjdCBpbXBvcnRzXG5pbXBvcnQgKiBhcyBQYWNrZXQgZnJvbSAnLi9wYWNrZXQvaW5kZXgnO1xuaW1wb3J0ICogYXMgR2FtZW1vZGUgZnJvbSAnLi9nYW1lbW9kZXMvaW5kZXgnO1xuXG5pbXBvcnQge0NlbGwsIFBsYXllckNlbGwsIEZvb2QsIFZpcnVzLCBFamVjdGVkTWFzc30gIGZyb20gJy4vZW50aXR5L2luZGV4JztcbmltcG9ydCBQbGF5ZXJUcmFja2VyIGZyb20gJy4vUGxheWVyVHJhY2tlcic7XG5pbXBvcnQgUGFja2V0SGFuZGxlciBmcm9tICcuL1BhY2tldEhhbmRsZXInO1xuaW1wb3J0IE1vZGUgZnJvbSAnLi9nYW1lbW9kZXMvTW9kZSc7XG5pbXBvcnQgQm90TG9hZGVyIGZyb20gJy4vYWkvQm90TG9hZGVyJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9tb2R1bGVzL2xvZyc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnJztcblxuLy8gR2FtZVNlcnZlciBpbXBsZW1lbnRhdGlvblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVNlcnZlciB7XG4gIC8vIFN0YXJ0dXBcbiAgcnVuOiBib29sZWFuO1xuICBsYXN0Tm9kZUlkOiBudW1iZXI7XG4gIGxhc3RQbGF5ZXJJZDogbnVtYmVyO1xuICBjbGllbnRzOiBhbnlbXTtcbiAgbm9kZXM6IGFueVtdO1xuICAvLyBWaXJ1cyBub2Rlc1xuICBub2Rlc1ZpcnVzOiBWaXJ1c1tdO1xuICAvLyBFamVjdGVkIG1hc3Mgbm9kZXNcbiAgbm9kZXNFamVjdGVkOiBDZWxsW107XG4gIC8vIE5vZGVzIGNvbnRyb2xsZWQgYnkgcGxheWVyc1xuICBub2Rlc1BsYXllcjogUGxheWVyQ2VsbFtdO1xuXG4gIGN1cnJlbnRGb29kOiBudW1iZXI7XG4gIG1vdmluZ05vZGVzOiBhbnlbXTtcbiAgbGVhZGVyYm9hcmQ6IGFueVtdO1xuICBsYl9wYWNrZXQ6IEFycmF5QnVmZmVyO1xuICBib3RzOiBCb3RMb2FkZXI7XG4gIGxvZzogTG9nZ2VyO1xuICBjb21tYW5kczogYW55O1xuICB0aW1lOiBudW1iZXI7XG4gIHN0YXJ0VGltZTogbnVtYmVyO1xuICAvLyAxIHNlY29uZCB0aWNrcyBvZiBtYWluTG9vcFxuICB0aWNrOiBudW1iZXI7XG4gIC8vIDUwIG1zIHRpY2tzLCAyMCBvZiB0aGVzZSA9IDEgbGVhZGVyYm9hcmQgdXBkYXRlXG4gIHRpY2tNYWluOiBudW1iZXI7XG4gIC8vIFVzZWQgd2l0aCBzcGF3bmluZyBmb29kXG4gIHRpY2tTcGF3bjogbnVtYmVyO1xuXG4gIGdhbWVNb2RlOiBNb2RlO1xuICBjb25maWc6IENvbmZpZztcbiAgY29sb3JzOiBhbnlbXTtcblxuICBzb2NrZXRTZXJ2ZXI6IFdlYlNvY2tldC5TZXJ2ZXI7XG5cbiAgc3RhdHM6IGFueTtcbiAgaHR0cFNlcnZlcjogYW55OyAvLyBzaG91bGQgYmUgaHR0cFNlcnZlclxuXG4gIGNvbnN0cnVjdG9yKCl7XG5cbiAgICB0aGlzLnJ1biA9IHRydWU7XG4gICAgdGhpcy5sYXN0Tm9kZUlkID0gMTtcbiAgICB0aGlzLmxhc3RQbGF5ZXJJZCA9IDE7XG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMubm9kZXNWaXJ1cyA9IFtdO1xuICAgIHRoaXMubm9kZXNFamVjdGVkID0gW107XG4gICAgdGhpcy5ub2Rlc1BsYXllciA9IFtdO1xuXG4gICAgdGhpcy5jdXJyZW50Rm9vZCA9IDA7XG4gICAgdGhpcy5tb3ZpbmdOb2RlcyA9IFtdOyAvLyBGb3IgbW92ZSBlbmdpbmVcbiAgICB0aGlzLmxlYWRlcmJvYXJkID0gW107XG4gICAgdGhpcy5sYl9wYWNrZXQgPSBuZXcgQXJyYXlCdWZmZXIoMCk7IC8vIExlYWRlcmJvYXJkIHBhY2tldFxuXG4gICAgdGhpcy5ib3RzID0gbmV3IEJvdExvYWRlcih0aGlzKTtcbiAgICB0aGlzLmxvZyA9IG5ldyBMb2dnZXIoKTtcbiAgICB0aGlzLmNvbW1hbmRzOyAvLyBDb21tYW5kIGhhbmRsZXJcblxuICAgIC8vIE1haW4gbG9vcCB0aWNrXG4gICAgdGhpcy50aW1lID0gK25ldyBEYXRlO1xuICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy50aW1lO1xuICAgIHRoaXMudGljayA9IDA7IC8vIDEgc2Vjb25kIHRpY2tzIG9mIG1haW5Mb29wXG4gICAgdGhpcy50aWNrTWFpbiA9IDA7IC8vIDUwIG1zIHRpY2tzLCAyMCBvZiB0aGVzZSA9IDEgbGVhZGVyYm9hcmQgdXBkYXRlXG4gICAgdGhpcy50aWNrU3Bhd24gPSAwOyAvLyBVc2VkIHdpdGggc3Bhd25pbmcgZm9vZFxuXG4gICAgLy8gQ29uZmlnXG4gICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKCk7XG5cbiAgICAvLyBQYXJzZSBjb25maWdcbiAgICB0aGlzLmxvYWRDb25maWcoKTtcblxuICAgIC8vIEdhbWVtb2Rlc1xuICAgIHRoaXMuZ2FtZU1vZGUgPSBHYW1lbW9kZS5nZXQodGhpcy5jb25maWcuc2VydmVyR2FtZW1vZGUpO1xuXG4gICAgLy8gQ29sb3JzXG4gICAgdGhpcy5jb2xvcnMgPSBbXG4gICAgICB7J3InOjIzNSwgJ2cnOiA3NSwgJ2InOiAgMH0sXG4gICAgICB7J3InOjIyNSwgJ2cnOjEyNSwgJ2InOjI1NX0sXG4gICAgICB7J3InOjE4MCwgJ2cnOiAgNywgJ2InOiAyMH0sXG4gICAgICB7J3InOiA4MCwgJ2cnOjE3MCwgJ2InOjI0MH0sXG4gICAgICB7J3InOjE4MCwgJ2cnOiA5MCwgJ2InOjEzNX0sXG4gICAgICB7J3InOjE5NSwgJ2cnOjI0MCwgJ2InOiAgMH0sXG4gICAgICB7J3InOjE1MCwgJ2cnOiAxOCwgJ2InOjI1NX0sXG4gICAgICB7J3InOiA4MCwgJ2cnOjI0NSwgJ2InOiAgMH0sXG4gICAgICB7J3InOjE2NSwgJ2cnOiAyNSwgJ2InOiAgMH0sXG4gICAgICB7J3InOiA4MCwgJ2cnOjE0NSwgJ2InOiAgMH0sXG4gICAgICB7J3InOiA4MCwgJ2cnOjE3MCwgJ2InOjI0MH0sXG4gICAgICB7J3InOiA1NSwgJ2cnOiA5MiwgJ2InOjI1NX0sXG4gICAgXTtcbiAgfVxuXG5cbiAgc3RhcnQoKSB7XG4gICAgLy8gTG9nZ2luZ1xuICAgIHRoaXMubG9nLnNldHVwKHRoaXMpO1xuXG4gICAgLy8gR2FtZW1vZGUgY29uZmlndXJhdGlvbnNcbiAgICB0aGlzLmdhbWVNb2RlLm9uU2VydmVySW5pdCh0aGlzKTtcblxuICAgIHZhciBzZXJ2ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyBTcGF3biBzdGFydGluZyBmb29kXG4gICAgICB0aGlzLnN0YXJ0aW5nRm9vZCgpO1xuXG4gICAgICAvLyBTdGFydCBNYWluIExvb3BcbiAgICAgIHNldEludGVydmFsKHRoaXMubWFpbkxvb3AuYmluZCh0aGlzKSwgMSk7XG5cbiAgICAgIC8vIERvbmVcbiAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIExpc3RlbmluZyBvbiBwb3J0IFwiICsgdGhpcy5jb25maWcuc2VydmVyUG9ydCk7XG4gICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBDdXJyZW50IGdhbWUgbW9kZSBpcyBcIiArIHRoaXMuZ2FtZU1vZGUubmFtZSk7XG5cbiAgICAgIC8vIFBsYXllciBib3RzIChFeHBlcmltZW50YWwpXG4gICAgICBpZiAodGhpcy5jb25maWcuc2VydmVyQm90cyA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IHRoaXMuY29uZmlnLnNlcnZlckJvdHM7aSsrKSB7XG4gICAgICAgICAgdGhpcy5ib3RzLmFkZEJvdCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVdIExvYWRlZCBcIit0aGlzLmNvbmZpZy5zZXJ2ZXJCb3RzK1wiIHBsYXllciBib3RzXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0YXJ0IHRoZSBzZXJ2ZXJcbiAgICB0aGlzLnNvY2tldFNlcnZlciA9IG5ldyBXZWJTb2NrZXQuU2VydmVyKFxuICAgICAgICB7IHBvcnQ6IHRoaXMuY29uZmlnLnNlcnZlclBvcnQsIHBlck1lc3NhZ2VEZWZsYXRlOiBmYWxzZX0sXG4gICAgICAgIHNlcnZlckNhbGxiYWNrLmJpbmQodGhpcylcbiAgICApO1xuXG4gICAgdGhpcy5zb2NrZXRTZXJ2ZXIub24oJ2Nvbm5lY3Rpb24nLCBjb25uZWN0aW9uRXN0YWJsaXNoZWQuYmluZCh0aGlzKSk7XG5cbiAgICAvLyBQcm9wZXJseSBoYW5kbGUgZXJyb3JzIGJlY2F1c2Ugc29tZSBwZW9wbGUgYXJlIHRvbyBsYXp5IHRvIHJlYWQgdGhlIHJlYWRtZVxuICAgIHRoaXMuc29ja2V0U2VydmVyLm9uKCdlcnJvcicsIGZ1bmN0aW9uIGVycihlKSB7XG4gICAgICBzd2l0Y2ggKGUubmFtZSkge1xuICAgICAgICBjYXNlIFwiRUFERFJJTlVTRVwiOlxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0Vycm9yXSBFQUREUklOVVNFLiBTZXJ2ZXIgY291bGQgbm90IGJpbmQgdG8gcG9ydCFcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJFQUNDRVNcIjpcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIltFcnJvcl0gRUFDQ0VTLiBUaXBzOlxcblVzZSBwb3J0cyBhYm92ZSAxMDAwXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUubG9nKGBbRXJyb3JdIFVuaGFuZGxlZCBlcnJvciBjb2RlOiAke2UubmFtZX1gKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHByb2Nlc3MuZXhpdCgxKTsgLy8gRXhpdHMgdGhlIHByb2dyYW1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNvbm5lY3Rpb25Fc3RhYmxpc2hlZCh3cykge1xuICAgICAgLy8gU2VydmVyIGZ1bGxcbiAgICAgIGlmICh0aGlzLmNsaWVudHMubGVuZ3RoID49IHRoaXMuY29uZmlnLnNlcnZlck1heENvbm5lY3Rpb25zKSB7XG4gICAgICAgIHdzLmNsb3NlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gLS0tLS0gQ2xpZW50IGF1dGhlbnRpY2l0eSBjaGVjayBjb2RlIC0tLS0tXG4gICAgICAvLyAhISEhISBXQVJOSU5HICEhISEhXG4gICAgICAvLyBUSEUgQkVMT1cgU0VDVElPTiBPRiBDT0RFIENIRUNLUyBUTyBFTlNVUkUgVEhBVCBDT05ORUNUSU9OUyBBUkUgQ09NSU5HXG4gICAgICAvLyBGUk9NIFRIRSBPRkZJQ0lBTCBBR0FSLklPIENMSUVOVC4gSUYgWU9VIFJFTU9WRSBPUiBNT0RJRlkgVEhFIEJFTE9XXG4gICAgICAvLyBTRUNUSU9OIE9GIENPREUgVE8gQUxMT1cgQ09OTkVDVElPTlMgRlJPTSBBIENMSUVOVCBPTiBBIERJRkZFUkVOVCBET01BSU4sXG4gICAgICAvLyBZT1UgTUFZIEJFIENPTU1JVFRJTkcgQ09QWVJJR0hUIElORlJJTkdFTUVOVCBBTkQgTEVHQUwgQUNUSU9OIE1BWSBCRSBUQUtFTlxuICAgICAgLy8gQUdBSU5TVCBZT1UuIFRISVMgU0VDVElPTiBPRiBDT0RFIFdBUyBBRERFRCBPTiBKVUxZIDksIDIwMTUgQVQgVEhFIFJFUVVFU1RcbiAgICAgIC8vIE9GIFRIRSBBR0FSLklPIERFVkVMT1BFUlMuXG4gICAgICB2YXIgb3JpZ2luID0gd3MudXBncmFkZVJlcS5oZWFkZXJzLm9yaWdpbjtcbiAgICAgIGlmIChvcmlnaW4gIT0gJ2h0dHA6Ly9hZ2FyLmlvJyAmJiBvcmlnaW4gIT0gJ2h0dHBzOi8vYWdhci5pbydcbiAgICAgICAgICAmJiBvcmlnaW4gIT0gJ2h0dHA6Ly9sb2NhbGhvc3QnICYmIG9yaWdpbiAhPSAnaHR0cHM6Ly9sb2NhbGhvc3QnXG4gICAgICAgICAgJiYgb3JpZ2luICE9ICdodHRwOi8vMTI3LjAuMC4xJyAmJiBvcmlnaW4gIT0gJ2h0dHBzOi8vMTI3LjAuMC4xJykge1xuICAgICAgICB3cy5jbG9zZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyAtLS0tLS9DbGllbnQgYXV0aGVudGljaXR5IGNoZWNrIGNvZGUgLS0tLS1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKGVycm9yKSB7XG4gICAgICAvLyBMb2cgZGlzY29ubmVjdGlvbnNcbiAgICAgIHRoaXMuc2VydmVyLmxvZy5vbkRpc2Nvbm5lY3QodGhpcy5zb2NrZXQucmVtb3RlQWRkcmVzcyk7XG5cbiAgICAgIHZhciBjbGllbnQgPSB0aGlzLnNvY2tldC5wbGF5ZXJUcmFja2VyO1xuICAgICAgdmFyIGxlbiA9IHRoaXMuc29ja2V0LnBsYXllclRyYWNrZXIuY2VsbHMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YXIgY2VsbCA9IHRoaXMuc29ja2V0LnBsYXllclRyYWNrZXIuY2VsbHNbaV07XG5cbiAgICAgICAgaWYgKCFjZWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBmdW5jdGlvbiBzbyB0aGF0IHRoZSBjZWxsIGNhbnQgbW92ZVxuICAgICAgICBjZWxsLmNhbGNNb3ZlID0gZnVuY3Rpb24oKSB7cmV0dXJuO307XG4gICAgICAgIC8vdGhpcy5zZXJ2ZXIucmVtb3ZlTm9kZShjZWxsKTtcbiAgICAgIH1cblxuICAgICAgY2xpZW50LmRpc2Nvbm5lY3QgPSB0aGlzLnNlcnZlci5jb25maWcucGxheWVyRGlzY29ubmVjdFRpbWUgKiAyMDtcbiAgICAgIC8vIENsZWFyIGZ1bmN0aW9uIHNvIG5vIHBhY2tldHMgYXJlIHNlbnRcbiAgICAgIHRoaXMuc29ja2V0LnNlbmRQYWNrZXQgPSBmdW5jdGlvbigpIHtyZXR1cm47fTtcbiAgICB9XG5cbiAgICB3cy5yZW1vdGVBZGRyZXNzID0gd3MuX3NvY2tldC5yZW1vdGVBZGRyZXNzO1xuICAgIHdzLnJlbW90ZVBvcnQgPSB3cy5fc29ja2V0LnJlbW90ZVBvcnQ7XG4gICAgdGhpcy5sb2cub25Db25uZWN0KHdzLnJlbW90ZUFkZHJlc3MpOyAvLyBMb2cgY29ubmVjdGlvbnNcblxuICAgIHdzLnBsYXllclRyYWNrZXIgPSBuZXcgUGxheWVyVHJhY2tlcih0aGlzLCB3cyk7XG4gICAgd3MucGFja2V0SGFuZGxlciA9IG5ldyBQYWNrZXRIYW5kbGVyKHRoaXMsIHdzKTtcbiAgICB3cy5vbignbWVzc2FnZScsIHdzLnBhY2tldEhhbmRsZXIuaGFuZGxlTWVzc2FnZS5iaW5kKHdzLnBhY2tldEhhbmRsZXIpKTtcblxuICAgIHZhciBiaW5kT2JqZWN0ID0geyBzZXJ2ZXI6IHRoaXMsIHNvY2tldDogd3MgfTtcbiAgICB3cy5vbignZXJyb3InLCBjbG9zZS5iaW5kKGJpbmRPYmplY3QpKTtcbiAgICB3cy5vbignY2xvc2UnLCBjbG9zZS5iaW5kKGJpbmRPYmplY3QpKTtcbiAgICB0aGlzLmNsaWVudHMucHVzaCh3cyk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydFN0YXRzU2VydmVyKHRoaXMuY29uZmlnLnNlcnZlclN0YXRzUG9ydCk7XG4gIH1cblxuICBnZXRNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmdhbWVNb2RlO1xuICB9XG5cbiAgZ2V0TmV4dE5vZGVJZCgpIHtcbiAgICAvLyBSZXNldHMgaW50ZWdlclxuICAgIC8vIFRPRE9cbiAgICBpZiAodGhpcy5sYXN0Tm9kZUlkID4gMjE0NzQ4MzY0Nykge1xuICAgICAgdGhpcy5sYXN0Tm9kZUlkID0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubGFzdE5vZGVJZCsrO1xuICB9XG5cbiAgZ2V0TmV3UGxheWVySUQoKSB7XG4gICAgLy8gUmVzZXRzIGludGVnZXJcbiAgICAvLyBUT0RPXG4gICAgaWYgKHRoaXMubGFzdFBsYXllcklkID4gMjE0NzQ4MzY0Nykge1xuICAgICAgdGhpcy5sYXN0UGxheWVySWQgPSAxO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sYXN0UGxheWVySWQrKztcbiAgfVxuXG4gIGdldFJhbmRvbVBvc2l0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5jb25maWcuYm9yZGVyUmlnaHQgLSB0aGlzLmNvbmZpZy5ib3JkZXJMZWZ0KSkgKyB0aGlzLmNvbmZpZy5ib3JkZXJMZWZ0LFxuICAgICAgeTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMuY29uZmlnLmJvcmRlckJvdHRvbSAtIHRoaXMuY29uZmlnLmJvcmRlclRvcCkpICsgdGhpcy5jb25maWcuYm9yZGVyVG9wXG4gICAgfTtcbiAgfVxuXG4gIGdldFJhbmRvbVNwYXduKCkge1xuICAgIC8vIFJhbmRvbSBzcGF3bnMgZm9yIHBsYXllcnNcbiAgICB2YXIgcG9zO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudEZvb2QgPiAwKSB7XG4gICAgICAvLyBTcGF3biBmcm9tIGZvb2RcbiAgICAgIHZhciBub2RlO1xuICAgICAgZm9yICh2YXIgaSA9ICh0aGlzLm5vZGVzLmxlbmd0aCAtIDEpOyBpID4gLTE7IGktLSkge1xuICAgICAgICAvLyBGaW5kIHJhbmRvbSBmb29kXG4gICAgICAgIG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xuXG4gICAgICAgIGlmICghbm9kZSB8fCBub2RlLmluUmFuZ2UpIHtcbiAgICAgICAgICAvLyBTa2lwIGlmIGZvb2QgaXMgYWJvdXQgdG8gYmUgZWF0ZW4vdW5kZWZpbmVkXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9kZS5nZXRUeXBlKCkgPT0gMSkge1xuICAgICAgICAgIHBvcyA9IHt4OiBub2RlLnBvc2l0aW9uLngseTogbm9kZS5wb3NpdGlvbi55fTtcbiAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXBvcykge1xuICAgICAgLy8gR2V0IHJhbmRvbSBzcGF3biBpZiBubyBmb29kIGNlbGwgaXMgZm91bmRcbiAgICAgIHBvcyA9IHRoaXMuZ2V0UmFuZG9tUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgZ2V0UmFuZG9tQ29sb3IoKSB7XG4gICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jb2xvcnMubGVuZ3RoKTtcbiAgICB2YXIgY29sb3IgPSB0aGlzLmNvbG9yc1tpbmRleF07XG4gICAgcmV0dXJuIHtcbiAgICAgIHI6IGNvbG9yLnIsXG4gICAgICBiOiBjb2xvci5iLFxuICAgICAgZzogY29sb3IuZ1xuICAgIH07XG4gIH1cblxuICBhZGROb2RlKG5vZGUpIHtcbiAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG5cbiAgICAvLyBBZGRzIHRvIHRoZSBvd25pbmcgcGxheWVyJ3Mgc2NyZWVuXG4gICAgaWYgKG5vZGUub3duZXIpIHtcbiAgICAgIG5vZGUuc2V0Q29sb3Iobm9kZS5vd25lci5jb2xvcik7XG4gICAgICBub2RlLm93bmVyLmNlbGxzLnB1c2gobm9kZSk7XG4gICAgICBub2RlLm93bmVyLnNvY2tldC5zZW5kUGFja2V0KG5ldyBQYWNrZXQuQWRkTm9kZShub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gU3BlY2lhbCBvbi1hZGQgYWN0aW9uc1xuICAgIG5vZGUub25BZGQodGhpcyk7XG5cbiAgICAvLyBBZGQgdG8gdmlzaWJsZSBub2Rlc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jbGllbnRzLmxlbmd0aDtpKyspIHtcbiAgICAgIHZhciBjbGllbnQgPSB0aGlzLmNsaWVudHNbaV0ucGxheWVyVHJhY2tlcjtcbiAgICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBjbGllbnQubm9kZUFkZGl0aW9uUXVldWUgaXMgb25seSB1c2VkIGJ5IGh1bWFuIHBsYXllcnMsIG5vdCBib3RzXG4gICAgICAvLyBmb3IgYm90cyBpdCBqdXN0IGdldHMgY29sbGVjdGVkIGZvcmV2ZXIsIHVzaW5nIGV2ZXItaW5jcmVhc2luZyBhbW91bnRzIG9mIG1lbW9yeVxuICAgICAgaWYgKCdfc29ja2V0JyBpbiBjbGllbnQuc29ja2V0ICYmIG5vZGUudmlzaWJsZUNoZWNrKGNsaWVudC52aWV3Qm94LGNsaWVudC5jZW50ZXJQb3MpKSB7XG4gICAgICAgIGNsaWVudC5ub2RlQWRkaXRpb25RdWV1ZS5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZU5vZGUobm9kZSkge1xuICAgIC8vIFJlbW92ZSBmcm9tIG1haW4gbm9kZXMgbGlzdFxuICAgIHZhciBpbmRleCA9IHRoaXMubm9kZXMuaW5kZXhPZihub2RlKTtcbiAgICBpZiAoaW5kZXggIT0gLTEpIHtcbiAgICAgIHRoaXMubm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZnJvbSBtb3ZpbmcgY2VsbHMgbGlzdFxuICAgIGluZGV4ID0gdGhpcy5tb3ZpbmdOb2Rlcy5pbmRleE9mKG5vZGUpO1xuICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgdGhpcy5tb3ZpbmdOb2Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIC8vIFNwZWNpYWwgb24tcmVtb3ZlIGFjdGlvbnNcbiAgICBub2RlLm9uUmVtb3ZlKHRoaXMpO1xuXG4gICAgLy8gQW5pbWF0aW9uIHdoZW4gZWF0aW5nXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNsaWVudHMubGVuZ3RoO2krKykge1xuICAgICAgdmFyIGNsaWVudCA9IHRoaXMuY2xpZW50c1tpXS5wbGF5ZXJUcmFja2VyO1xuICAgICAgaWYgKCFjbGllbnQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSBmcm9tIGNsaWVudFxuICAgICAgY2xpZW50Lm5vZGVEZXN0cm95UXVldWUucHVzaChub2RlKTtcbiAgICB9XG4gIH1cblxuICBjZWxsVGljaygpIHtcbiAgICAvLyBNb3ZlIGNlbGxzXG4gICAgdGhpcy51cGRhdGVNb3ZlRW5naW5lKCk7XG4gIH1cblxuICBzcGF3blRpY2soKSB7XG4gICAgLy8gU3Bhd24gZm9vZFxuICAgIHRoaXMudGlja1NwYXduKys7XG4gICAgaWYgKHRoaXMudGlja1NwYXduID49IHRoaXMuY29uZmlnLnNwYXduSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMudXBkYXRlRm9vZCgpOyAvLyBTcGF3biBmb29kXG4gICAgICB0aGlzLnZpcnVzQ2hlY2soKTsgLy8gU3Bhd24gdmlydXNlc1xuXG4gICAgICB0aGlzLnRpY2tTcGF3biA9IDA7IC8vIFJlc2V0XG4gICAgfVxuICB9XG5cbiAgZ2FtZW1vZGVUaWNrKCkge1xuICAgIC8vIEdhbWVtb2RlIHRpY2tcbiAgICB0aGlzLmdhbWVNb2RlLm9uVGljayh0aGlzKTtcbiAgfVxuXG4gIGNlbGxVcGRhdGVUaWNrKCkge1xuICAgIC8vIFVwZGF0ZSBjZWxsc1xuICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcbiAgfVxuXG5cbiAgbWFpbkxvb3AoKSB7XG4gICAgLy8gVGltZXJcbiAgICB2YXIgbG9jYWwgPSBuZXcgRGF0ZSgpO1xuICAgIC8vIFRPRE9cbiAgICB0aGlzLnRpY2sgKz0gKCtsb2NhbCAtIHRoaXMudGltZSk7XG4gICAgdGhpcy50aW1lID0gK2xvY2FsO1xuXG4gICAgaWYgKHRoaXMudGljayA+PSA1MCkge1xuICAgICAgLy8gTG9vcCBtYWluIGZ1bmN0aW9uc1xuICAgICAgaWYgKHRoaXMucnVuKSB7XG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5jZWxsVGljaygpLCAwKTtcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLnNwYXduVGljaygpLCAwKTtcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLmdhbWVtb2RlVGljaygpLCAwKTtcbiAgICAgIH1cblxuICAgICAgLy8gVXBkYXRlIHRoZSBjbGllbnQncyBtYXBzXG4gICAgICB0aGlzLnVwZGF0ZUNsaWVudHMoKTtcblxuICAgICAgLy8gVXBkYXRlIGNlbGxzL2xlYWRlcmJvYXJkIGxvb3BcbiAgICAgIHRoaXMudGlja01haW4rKztcbiAgICAgIGlmICh0aGlzLnRpY2tNYWluID49IDIwKSB7IC8vIDEgU2Vjb25kXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5jZWxsVXBkYXRlVGljaygpLCAwKTtcblxuICAgICAgICAvLyBVcGRhdGUgbGVhZGVyYm9hcmQgd2l0aCB0aGUgZ2FtZW1vZGUncyBtZXRob2RcbiAgICAgICAgdGhpcy5sZWFkZXJib2FyZCA9IFtdO1xuICAgICAgICB0aGlzLmdhbWVNb2RlLnVwZGF0ZUxCKHRoaXMpO1xuICAgICAgICB2YXIgbGJQYWNrID0gbmV3IFBhY2tldC5VcGRhdGVMZWFkZXJib2FyZChcbiAgICAgICAgICAgIHRoaXMubGVhZGVyYm9hcmQsXG4gICAgICAgICAgICB0aGlzLmdhbWVNb2RlLnBhY2tldExCKTtcblxuICAgICAgICB0aGlzLmxiX3BhY2tldCA9IGxiUGFjay5idWlsZCgpO1xuXG4gICAgICAgIHRoaXMudGlja01haW4gPSAwOyAvLyBSZXNldFxuICAgICAgfVxuXG4gICAgICAvLyBEZWJ1Z1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnRpY2sgLSA1MCk7XG5cbiAgICAgIC8vIFJlc2V0XG4gICAgICB0aGlzLnRpY2sgPSAwO1xuICAgIH1cbiAgfVxuXG5cbiAgdXBkYXRlQ2xpZW50cygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2xpZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmNsaWVudHNbaV0gPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbGllbnRzW2ldLnBsYXllclRyYWNrZXIudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnRpbmdGb29kKCkge1xuICAgIC8vIFNwYXducyB0aGUgc3RhcnRpbmcgYW1vdW50IG9mIGZvb2QgY2VsbHNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29uZmlnLmZvb2RTdGFydEFtb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLnNwYXduRm9vZCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUZvb2QoKSB7XG4gICAgdmFyIHRvU3Bhd24gPSBNYXRoLm1pbih0aGlzLmNvbmZpZy5mb29kU3Bhd25BbW91bnQsKHRoaXMuY29uZmlnLmZvb2RNYXhBbW91bnQtdGhpcy5jdXJyZW50Rm9vZCkpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9TcGF3bjsgaSsrKSB7XG4gICAgICB0aGlzLnNwYXduRm9vZCgpO1xuICAgIH1cbiAgfVxuXG4gIHNwYXduRm9vZCgpIHtcbiAgICB2YXIgZiA9IG5ldyBGb29kKHRoaXMuZ2V0TmV4dE5vZGVJZCgpLCBudWxsLCB0aGlzLmdldFJhbmRvbVBvc2l0aW9uKCksIHRoaXMuY29uZmlnLmZvb2RNYXNzLCBudWxsKTtcbiAgICBmLnNldENvbG9yKHRoaXMuZ2V0UmFuZG9tQ29sb3IoKSk7XG5cbiAgICB0aGlzLmFkZE5vZGUoZik7XG4gICAgdGhpcy5jdXJyZW50Rm9vZCsrO1xuICB9XG5cbiAgc3Bhd25QbGF5ZXIocGxheWVyLHBvcyxtYXNzKSB7XG4gICAgLy8gR2V0IHJhbmRvbSBwb3NcbiAgICBpZiAocG9zID09IG51bGwpIHtcbiAgICAgIHBvcyA9IHRoaXMuZ2V0UmFuZG9tU3Bhd24oKTtcbiAgICB9XG4gICAgLy8gR2V0IHN0YXJ0aW5nIG1hc3NcbiAgICBpZiAobWFzcyA9PSBudWxsKSB7XG4gICAgICBtYXNzID0gdGhpcy5jb25maWcucGxheWVyU3RhcnRNYXNzO1xuICAgIH1cblxuICAgIC8vIFNwYXduIHBsYXllciBhbmQgYWRkIHRvIHdvcmxkXG4gICAgdmFyIGNlbGwgPSBuZXcgUGxheWVyQ2VsbCh0aGlzLmdldE5leHROb2RlSWQoKSwgcGxheWVyLCBwb3MsIG1hc3MsIG51bGwpO1xuICAgIHRoaXMuYWRkTm9kZShjZWxsKTtcblxuICAgIC8vIFNldCBpbml0aWFsIG1vdXNlIGNvb3Jkc1xuICAgIHBsYXllci5tb3VzZSA9IHt4OiBwb3MueCwgeTogcG9zLnl9O1xuICB9XG5cbiAgdmlydXNDaGVjaygpIHtcbiAgICAvLyBDaGVja3MgaWYgdGhlcmUgYXJlIGVub3VnaCB2aXJ1c2VzIG9uIHRoZSBtYXBcbiAgICBpZiAodGhpcy5ub2Rlc1ZpcnVzLmxlbmd0aCA8IHRoaXMuY29uZmlnLnZpcnVzTWluQW1vdW50KSB7XG4gICAgICAvLyBTcGF3bnMgYSB2aXJ1c1xuICAgICAgdmFyIHBvcyA9IHRoaXMuZ2V0UmFuZG9tUG9zaXRpb24oKTtcbiAgICAgIHZhciB2aXJ1c1NxdWFyZVNpemUgPSAodGhpcy5jb25maWcudmlydXNTdGFydE1hc3MgKiAxMDApID4+IDA7XG5cbiAgICAgIC8vIENoZWNrIGZvciBwbGF5ZXJzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXNQbGF5ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrID0gdGhpcy5ub2Rlc1BsYXllcltpXTtcblxuICAgICAgICBpZiAoY2hlY2subWFzcyA8IHRoaXMuY29uZmlnLnZpcnVzU3RhcnRNYXNzKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3F1YXJlUiA9IGNoZWNrLmdldFNxdWFyZVNpemUoKTsgLy8gc3F1YXJlZCBSYWRpdXMgb2YgY2hlY2tpbmcgcGxheWVyIGNlbGxcblxuICAgICAgICB2YXIgZHggPSBjaGVjay5wb3NpdGlvbi54IC0gcG9zLng7XG4gICAgICAgIHZhciBkeSA9IGNoZWNrLnBvc2l0aW9uLnkgLSBwb3MueTtcblxuICAgICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgKyB2aXJ1c1NxdWFyZVNpemUgPD0gc3F1YXJlUilcbiAgICAgICAgICByZXR1cm47IC8vIENvbGxpZGVkXG4gICAgICB9XG5cbiAgICAgIC8vIFNwYXduIGlmIG5vIGNlbGxzIGFyZSBjb2xsaWRpbmdcbiAgICAgIHZhciB2ID0gbmV3IFZpcnVzKHRoaXMuZ2V0TmV4dE5vZGVJZCgpLCBudWxsLCBwb3MsIHRoaXMuY29uZmlnLnZpcnVzU3RhcnRNYXNzLCBudWxsKTtcbiAgICAgIHRoaXMuYWRkTm9kZSh2KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVNb3ZlRW5naW5lKCkge1xuICAgIC8vIE1vdmUgcGxheWVyIGNlbGxzXG4gICAgdmFyIGxlbiA9IHRoaXMubm9kZXNQbGF5ZXIubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBjZWxsID0gdGhpcy5ub2Rlc1BsYXllcltpXTtcblxuICAgICAgLy8gRG8gbm90IG1vdmUgY2VsbHMgdGhhdCBoYXZlIGFscmVhZHkgYmVlbiBlYXRlbiBvciBoYXZlIGNvbGxpc2lvbiB0dXJuZWQgb2ZmXG4gICAgICBpZiAoIWNlbGwpe1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNsaWVudCA9IGNlbGwub3duZXI7XG5cbiAgICAgIGNlbGwuY2FsY01vdmUoY2xpZW50Lm1vdXNlLngsIGNsaWVudC5tb3VzZS55LCB0aGlzKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgY2VsbHMgbmVhcmJ5XG4gICAgICB2YXIgbGlzdCA9IHRoaXMuZ2V0Q2VsbHNJblJhbmdlKGNlbGwpO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsaXN0Lmxlbmd0aCA7IGorKykge1xuICAgICAgICB2YXIgY2hlY2sgPSBsaXN0W2pdO1xuXG4gICAgICAgIC8vIGlmIHdlJ3JlIGRlbGV0aW5nIGZyb20gdGhpcy5ub2Rlc1BsYXllciwgZml4IG91dGVyIGxvb3AgdmFyaWFibGVzXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gdXBkYXRlIGl0cyBsZW5ndGgsIGFuZCBtYXliZSAnaScgdG9vXG4gICAgICAgIGlmIChjaGVjay5jZWxsVHlwZSA9PSAwKSB7XG4gICAgICAgICAgbGVuLS07XG4gICAgICAgICAgaWYgKGNoZWNrLm5vZGVJZCA8IGNlbGwubm9kZUlkKSB7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uc3VtZSBlZmZlY3RcbiAgICAgICAgY2hlY2sub25Db25zdW1lKGNlbGwsdGhpcyk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGNlbGxcbiAgICAgICAgY2hlY2suc2V0S2lsbGVyKGNlbGwpO1xuICAgICAgICB0aGlzLnJlbW92ZU5vZGUoY2hlY2spO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEEgc3lzdGVtIHRvIG1vdmUgY2VsbHMgbm90IGNvbnRyb2xsZWQgYnkgcGxheWVycyAoZXguIHZpcnVzZXMsIGVqZWN0ZWQgbWFzcylcbiAgICBsZW4gPSB0aGlzLm1vdmluZ05vZGVzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2sgPSB0aGlzLm1vdmluZ05vZGVzW2ldO1xuXG4gICAgICAvLyBSZWN5Y2xlIHVudXNlZCBub2Rlc1xuICAgICAgd2hpbGUgKCh0eXBlb2YgY2hlY2sgPT0gXCJ1bmRlZmluZWRcIikgJiYgKGkgPCB0aGlzLm1vdmluZ05vZGVzLmxlbmd0aCkpIHtcbiAgICAgICAgLy8gUmVtb3ZlIG1vdmluZyBjZWxscyB0aGF0IGFyZSB1bmRlZmluZWRcbiAgICAgICAgdGhpcy5tb3ZpbmdOb2Rlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGNoZWNrID0gdGhpcy5tb3ZpbmdOb2Rlc1tpXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGkgPj0gdGhpcy5tb3ZpbmdOb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGVjay5tb3ZlRW5naW5lVGlja3MgPiAwKSB7XG4gICAgICAgIGNoZWNrLm9uQXV0b01vdmUodGhpcyk7XG4gICAgICAgIC8vIElmIHRoZSBjZWxsIGhhcyBlbm91Z2ggbW92ZSB0aWNrcywgdGhlbiBtb3ZlIGl0XG4gICAgICAgIGNoZWNrLmNhbGNNb3ZlUGh5cyh0aGlzLmNvbmZpZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdXRvIG1vdmUgaXMgZG9uZVxuICAgICAgICBjaGVjay5tb3ZlRG9uZSh0aGlzKTtcbiAgICAgICAgLy8gUmVtb3ZlIGNlbGwgZnJvbSBsaXN0XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMubW92aW5nTm9kZXMuaW5kZXhPZihjaGVjayk7XG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgICAgIHRoaXMubW92aW5nTm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldEFzTW92aW5nTm9kZShub2RlKSB7XG4gICAgdGhpcy5tb3ZpbmdOb2Rlcy5wdXNoKG5vZGUpO1xuICB9XG5cbiAgc3BsaXRDZWxscyhjbGllbnQ6IFBsYXllclRyYWNrZXIpIHtcbiAgICB2YXIgbGVuID0gY2xpZW50LmNlbGxzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoY2xpZW50LmNlbGxzLmxlbmd0aCA+PSB0aGlzLmNvbmZpZy5wbGF5ZXJNYXhDZWxscykge1xuICAgICAgICAvLyBQbGF5ZXIgY2VsbCBsaW1pdFxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNlbGwgPSBjbGllbnQuY2VsbHNbaV07XG4gICAgICBpZiAoIWNlbGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjZWxsLm1hc3MgPCB0aGlzLmNvbmZpZy5wbGF5ZXJNaW5NYXNzU3BsaXQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEdldCBhbmdsZVxuICAgICAgdmFyIGRlbHRhWSA9IGNsaWVudC5tb3VzZS55IC0gY2VsbC5wb3NpdGlvbi55O1xuICAgICAgdmFyIGRlbHRhWCA9IGNsaWVudC5tb3VzZS54IC0gY2VsbC5wb3NpdGlvbi54O1xuICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihkZWx0YVgsZGVsdGFZKTtcblxuICAgICAgLy8gR2V0IHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgICB2YXIgc2l6ZSA9IGNlbGwuZ2V0U2l6ZSgpLzI7XG4gICAgICB2YXIgc3RhcnRQb3MgPSB7XG4gICAgICAgIHg6IGNlbGwucG9zaXRpb24ueCArICggc2l6ZSAqIE1hdGguc2luKGFuZ2xlKSApLFxuICAgICAgICB5OiBjZWxsLnBvc2l0aW9uLnkgKyAoIHNpemUgKiBNYXRoLmNvcyhhbmdsZSkgKVxuICAgICAgfTtcbiAgICAgIC8vIENhbGN1bGF0ZSBtYXNzIGFuZCBzcGVlZCBvZiBzcGxpdHRpbmcgY2VsbFxuICAgICAgdmFyIHNwbGl0U3BlZWQgPSBjZWxsLmdldFNwZWVkKCkgKiA2O1xuICAgICAgdmFyIG5ld01hc3MgPSBjZWxsLm1hc3MgLyAyO1xuICAgICAgY2VsbC5tYXNzID0gbmV3TWFzcztcbiAgICAgIC8vIENyZWF0ZSBjZWxsXG4gICAgICB2YXIgc3BsaXQgPSBuZXcgUGxheWVyQ2VsbCh0aGlzLmdldE5leHROb2RlSWQoKSwgY2xpZW50LCBzdGFydFBvcywgbmV3TWFzcywgbnVsbCk7XG4gICAgICBzcGxpdC5zZXRBbmdsZShhbmdsZSk7XG4gICAgICBzcGxpdC5zZXRNb3ZlRW5naW5lRGF0YShzcGxpdFNwZWVkLCAzMiwgMC44NSk7XG4gICAgICBzcGxpdC5jYWxjTWVyZ2VUaW1lKHRoaXMuY29uZmlnLnBsYXllclJlY29tYmluZVRpbWUpO1xuXG4gICAgICAvLyBBZGQgdG8gbW92aW5nIGNlbGxzIGxpc3RcbiAgICAgIHRoaXMuc2V0QXNNb3ZpbmdOb2RlKHNwbGl0KTtcbiAgICAgIHRoaXMuYWRkTm9kZShzcGxpdCk7XG4gICAgfVxuICB9XG5cbiAgZWplY3RNYXNzKGNsaWVudCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xpZW50LmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2VsbCA9IGNsaWVudC5jZWxsc1tpXTtcblxuICAgICAgaWYgKCFjZWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2VsbC5tYXNzIDwgdGhpcy5jb25maWcucGxheWVyTWluTWFzc0VqZWN0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVsdGFZID0gY2xpZW50Lm1vdXNlLnkgLSBjZWxsLnBvc2l0aW9uLnk7XG4gICAgICB2YXIgZGVsdGFYID0gY2xpZW50Lm1vdXNlLnggLSBjZWxsLnBvc2l0aW9uLng7XG4gICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKGRlbHRhWCxkZWx0YVkpO1xuXG4gICAgICAvLyBHZXQgc3RhcnRpbmcgcG9zaXRpb25cbiAgICAgIHZhciBzaXplID0gY2VsbC5nZXRTaXplKCkgKyA1O1xuICAgICAgdmFyIHN0YXJ0UG9zID0ge1xuICAgICAgeDogY2VsbC5wb3NpdGlvbi54ICsgKCAoc2l6ZSArIHRoaXMuY29uZmlnLmVqZWN0TWFzcykgKiBNYXRoLnNpbihhbmdsZSkgKSxcbiAgICAgIHk6IGNlbGwucG9zaXRpb24ueSArICggKHNpemUgKyB0aGlzLmNvbmZpZy5lamVjdE1hc3MpICogTWF0aC5jb3MoYW5nbGUpIClcbiAgICAgIH07XG5cbiAgICAgIC8vIFJlbW92ZSBtYXNzIGZyb20gcGFyZW50IGNlbGxcbiAgICAgIGNlbGwubWFzcyAtPSB0aGlzLmNvbmZpZy5lamVjdE1hc3NMb3NzO1xuICAgICAgLy8gUmFuZG9taXplIGFuZ2xlXG4gICAgICBhbmdsZSArPSAoTWF0aC5yYW5kb20oKSAqIC40KSAtIC4yO1xuXG4gICAgICAvLyBDcmVhdGUgY2VsbFxuICAgICAgdmFyIGVqZWN0ZWQgPSBuZXcgRWplY3RlZE1hc3ModGhpcy5nZXROZXh0Tm9kZUlkKCksIG51bGwsIHN0YXJ0UG9zLCB0aGlzLmNvbmZpZy5lamVjdE1hc3MsIG51bGwpO1xuICAgICAgZWplY3RlZC5zZXRBbmdsZShhbmdsZSk7XG4gICAgICBlamVjdGVkLnNldE1vdmVFbmdpbmVEYXRhKHRoaXMuY29uZmlnLmVqZWN0U3BlZWQsIDIwLCBudWxsKTtcbiAgICAgIGVqZWN0ZWQuc2V0Q29sb3IoY2VsbC5nZXRDb2xvcigpKTtcblxuICAgICAgdGhpcy5hZGROb2RlKGVqZWN0ZWQpO1xuICAgICAgdGhpcy5zZXRBc01vdmluZ05vZGUoZWplY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgbmV3Q2VsbFZpcnVzZWQoY2xpZW50LCBwYXJlbnQsIGFuZ2xlLCBtYXNzLCBzcGVlZCkge1xuICAgIC8vIFN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgdmFyIHN0YXJ0UG9zID0ge1xuICAgICAgeDogcGFyZW50LnBvc2l0aW9uLngsXG4gICAgICB5OiBwYXJlbnQucG9zaXRpb24ueVxuICAgIH07XG5cbiAgICAvLyBDcmVhdGUgY2VsbFxuICAgIHZhciBuZXdDZWxsID0gbmV3IFBsYXllckNlbGwodGhpcy5nZXROZXh0Tm9kZUlkKCksIGNsaWVudCwgc3RhcnRQb3MsIG1hc3MsIG51bGwpO1xuICAgIG5ld0NlbGwuc2V0QW5nbGUoYW5nbGUpO1xuICAgIG5ld0NlbGwuc2V0TW92ZUVuZ2luZURhdGEoc3BlZWQsIDE1LCBudWxsKTtcbiAgICBuZXdDZWxsLmNhbGNNZXJnZVRpbWUodGhpcy5jb25maWcucGxheWVyUmVjb21iaW5lVGltZSk7XG4gICAgbmV3Q2VsbC5pZ25vcmVDb2xsaXNpb24gPSB0cnVlOyAvLyBSZW1vdmUgY29sbGlzaW9uIGNoZWNrc1xuXG4gICAgLy8gQWRkIHRvIG1vdmluZyBjZWxscyBsaXN0XG4gICAgdGhpcy5hZGROb2RlKG5ld0NlbGwpO1xuICAgIHRoaXMuc2V0QXNNb3ZpbmdOb2RlKG5ld0NlbGwpO1xuICB9XG5cbiAgc2hvb3RWaXJ1cyhwYXJlbnQpIHtcbiAgICB2YXIgcGFyZW50UG9zID0ge1xuICAgIHg6IHBhcmVudC5wb3NpdGlvbi54LFxuICAgIHk6IHBhcmVudC5wb3NpdGlvbi55LFxuICAgIH07XG5cbiAgICB2YXIgbmV3VmlydXMgPSBuZXcgVmlydXModGhpcy5nZXROZXh0Tm9kZUlkKCksIG51bGwsIHBhcmVudFBvcywgdGhpcy5jb25maWcudmlydXNTdGFydE1hc3MsIG51bGwpO1xuICAgIG5ld1ZpcnVzLnNldEFuZ2xlKHBhcmVudC5nZXRBbmdsZSgpKTtcbiAgICBuZXdWaXJ1cy5zZXRNb3ZlRW5naW5lRGF0YSgyMDAsIDIwLCBudWxsKTtcblxuICAgIC8vIEFkZCB0byBtb3ZpbmcgY2VsbHMgbGlzdFxuICAgIHRoaXMuYWRkTm9kZShuZXdWaXJ1cyk7XG4gICAgdGhpcy5zZXRBc01vdmluZ05vZGUobmV3VmlydXMpO1xuICB9XG5cbiAgZ2V0Q2VsbHNJblJhbmdlKGNlbGwpIHtcbiAgICB2YXIgbGlzdCA9IG5ldyBBcnJheSgpO1xuICAgIHZhciBzcXVhcmVSID0gY2VsbC5nZXRTcXVhcmVTaXplKCk7IC8vIEdldCBjZWxsIHNxdWFyZWQgcmFkaXVzXG5cbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIGNlbGxzIHRoYXQgYXJlIHZpc2libGUgdG8gdGhlIGNlbGwuIFRoZXJlIGlzIHByb2JhYmx5IGEgbW9yZSBlZmZpY2llbnQgd2F5IG9mIGRvaW5nIHRoaXMgYnV0IHdoYXRldmVyXG4gICAgdmFyIGxlbiA9IGNlbGwub3duZXIudmlzaWJsZU5vZGVzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDtpIDwgbGVuO2krKykge1xuICAgICAgdmFyIGNoZWNrID0gY2VsbC5vd25lci52aXNpYmxlTm9kZXNbaV07XG5cbiAgICAgIGlmICh0eXBlb2YgY2hlY2sgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBzb21ldGhpbmcgYWxyZWFkeSBjb2xsaWRlZCB3aXRoIHRoaXMgY2VsbCwgZG9uJ3QgY2hlY2sgZm9yIG90aGVyIGNvbGxpc2lvbnNcbiAgICAgIGlmIChjaGVjay5pblJhbmdlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDYW4ndCBlYXQgaXRzZWxmXG4gICAgICBpZiAoY2VsbC5ub2RlSWQgPT0gY2hlY2subm9kZUlkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDYW4ndCBlYXQgY2VsbHMgdGhhdCBoYXZlIGNvbGxpc2lvbiB0dXJuZWQgb2ZmXG4gICAgICBpZiAoKGNlbGwub3duZXIgPT0gY2hlY2sub3duZXIpICYmIChjZWxsLmlnbm9yZUNvbGxpc2lvbikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFBQkIgQ29sbGlzaW9uXG4gICAgICBpZiAoIWNoZWNrLmNvbGxpc2lvbkNoZWNrMihzcXVhcmVSLCBjZWxsLnBvc2l0aW9uKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2VsbCB0eXBlIGNoZWNrIC0gQ2VsbCBtdXN0IGJlIGJpZ2dlciB0aGFuIHRoaXMgbnVtYmVyIHRpbWVzIHRoZSBtYXNzIG9mIHRoZSBjZWxsIGJlaW5nIGVhdGVuXG4gICAgICB2YXIgbXVsdGlwbGllciA9IDEuMjU7XG5cbiAgICAgIHN3aXRjaCAoY2hlY2suZ2V0VHlwZSgpKSB7XG4gICAgICAgIGNhc2UgMTogLy8gRm9vZCBjZWxsXG4gICAgICAgICAgbGlzdC5wdXNoKGNoZWNrKTtcbiAgICAgICAgICBjaGVjay5pblJhbmdlID0gdHJ1ZTsgLy8gc2tpcCBmdXR1cmUgY29sbGlzaW9uIGNoZWNrcyBmb3IgdGhpcyBmb29kXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIGNhc2UgMjogLy8gVmlydXNcbiAgICAgICAgICBtdWx0aXBsaWVyID0gMS4zMztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAwOiAvLyBQbGF5ZXJzXG4gICAgICAgICAgLy8gQ2FuJ3QgZWF0IHNlbGYgaWYgaXQncyBub3QgdGltZSB0byByZWNvbWJpbmUgeWV0XG4gICAgICAgICAgaWYgKGNoZWNrLm93bmVyID09IGNlbGwub3duZXIpIHtcbiAgICAgICAgICAgIGlmICgoY2VsbC5yZWNvbWJpbmVUaWNrcyA+IDApIHx8IChjaGVjay5yZWNvbWJpbmVUaWNrcyA+IDApKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtdWx0aXBsaWVyID0gMS4wMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDYW4ndCBlYXQgdGVhbSBtZW1iZXJzXG4gICAgICAgICAgaWYgKHRoaXMuZ2FtZU1vZGUuaGF2ZVRlYW1zKSB7XG4gICAgICAgICAgICBpZiAoIWNoZWNrLm93bmVyKSB7IC8vIEVycm9yIGNoZWNrXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKGNoZWNrLm93bmVyICE9IGNlbGwub3duZXIpXG4gICAgICAgICAgICAgICAgJiYgKGNoZWNrLm93bmVyLmdldFRlYW0oKSA9PSBjZWxsLm93bmVyLmdldFRlYW0oKSkpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIHN1cmUgdGhlIGNlbGwgaXMgYmlnIGVub3VnaCB0byBiZSBlYXRlbi5cbiAgICAgIGlmICgoY2hlY2subWFzcyAqIG11bHRpcGxpZXIpID4gY2VsbC5tYXNzKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBFYXRpbmcgcmFuZ2VcbiAgICAgIHZhciB4cyA9IE1hdGgucG93KGNoZWNrLnBvc2l0aW9uLnggLSBjZWxsLnBvc2l0aW9uLngsIDIpO1xuICAgICAgdmFyIHlzID0gTWF0aC5wb3coY2hlY2sucG9zaXRpb24ueSAtIGNlbGwucG9zaXRpb24ueSwgMik7XG4gICAgICB2YXIgZGlzdCA9IE1hdGguc3FydCggeHMgKyB5cyApO1xuXG4gICAgICAvLyBFYXRpbmcgcmFuZ2UgPSByYWRpdXMgb2YgZWF0aW5nIGNlbGwgKyA0MCUgb2YgdGhlIHJhZGl1cyBvZiB0aGUgY2VsbCBiZWluZyBlYXRlblxuICAgICAgdmFyIGVhdGluZ1JhbmdlID0gY2VsbC5nZXRTaXplKCkgLSBjaGVjay5nZXRFYXRpbmdSYW5nZSgpO1xuICAgICAgaWYgKGRpc3QgPiBlYXRpbmdSYW5nZSkge1xuICAgICAgICAvLyBOb3QgaW4gZWF0aW5nIHJhbmdlXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdG8gbGlzdCBvZiBjZWxscyBuZWFyYnlcbiAgICAgIGxpc3QucHVzaChjaGVjayk7XG5cbiAgICAgIC8vIFNvbWV0aGluZyBpcyBhYm91dCB0byBlYXQgdGhpcyBjZWxsOyBubyBuZWVkIHRvIGNoZWNrIGZvciBvdGhlciBjb2xsaXNpb25zIHdpdGggaXRcbiAgICAgIGNoZWNrLmluUmFuZ2UgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIGdldE5lYXJlc3RWaXJ1cyhjZWxsKSB7XG4gICAgLy8gTW9yZSBsaWtlIGdldE5lYXJieVZpcnVzXG4gICAgdmFyIHZpcnVzID0gbnVsbDtcbiAgICB2YXIgciA9IDEwMDsgLy8gQ2hlY2tpbmcgcmFkaXVzXG5cbiAgICB2YXIgdG9wWSA9IGNlbGwucG9zaXRpb24ueSAtIHI7XG4gICAgdmFyIGJvdHRvbVkgPSBjZWxsLnBvc2l0aW9uLnkgKyByO1xuXG4gICAgdmFyIGxlZnRYID0gY2VsbC5wb3NpdGlvbi54IC0gcjtcbiAgICB2YXIgcmlnaHRYID0gY2VsbC5wb3NpdGlvbi54ICsgcjtcblxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgdmlydXNlcyBvbiB0aGUgbWFwLiBUaGVyZSBpcyBwcm9iYWJseSBhIG1vcmUgZWZmaWNpZW50IHdheSBvZiBkb2luZyB0aGlzIGJ1dCB3aGF0ZXZlclxuICAgIHZhciBsZW4gPSB0aGlzLm5vZGVzVmlydXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwO2kgPCBsZW47aSsrKSB7XG4gICAgICB2YXIgY2hlY2sgPSB0aGlzLm5vZGVzVmlydXNbaV07XG5cbiAgICAgIGlmICh0eXBlb2YgY2hlY2sgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWNoZWNrLmNvbGxpc2lvbkNoZWNrKGJvdHRvbVksdG9wWSxyaWdodFgsbGVmdFgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdG8gbGlzdCBvZiBjZWxscyBuZWFyYnlcbiAgICAgIHZpcnVzID0gY2hlY2s7XG4gICAgICBicmVhazsgLy8gc3RvcCBjaGVja2luZyB3aGVuIGEgdmlydXMgZm91bmRcbiAgICB9XG4gICAgcmV0dXJuIHZpcnVzO1xuICB9XG5cbiAgdXBkYXRlQ2VsbHMoKSB7XG4gICAgaWYgKCF0aGlzLnJ1bikge1xuICAgICAgLy8gU2VydmVyIGlzIHBhdXNlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgcGxheWVyIGNlbGxzXG4gICAgdmFyIG1hc3NEZWNheSA9IDEgLSAodGhpcy5jb25maWcucGxheWVyTWFzc0RlY2F5UmF0ZSAqIHRoaXMuZ2FtZU1vZGUuZGVjYXlNb2QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlc1BsYXllci5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNlbGwgPSB0aGlzLm5vZGVzUGxheWVyW2ldO1xuXG4gICAgICBpZiAoIWNlbGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjZWxsLnJlY29tYmluZVRpY2tzID4gMCkge1xuICAgICAgICAvLyBSZWNvbWJpbmluZ1xuICAgICAgICBjZWxsLnJlY29tYmluZVRpY2tzLS07XG4gICAgICB9XG5cbiAgICAgIC8vIE1hc3MgZGVjYXlcbiAgICAgIGlmIChjZWxsLm1hc3MgPj0gdGhpcy5jb25maWcucGxheWVyTWluTWFzc0RlY2F5KSB7XG4gICAgICAgIGNlbGwubWFzcyAqPSBtYXNzRGVjYXk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbG9hZENvbmZpZygpIHtcbiAgICB0cnkge1xuICAgICAgLy8gTG9hZCB0aGUgY29udGVudHMgb2YgdGhlIGNvbmZpZyBmaWxlXG4gICAgICB2YXIgbG9hZCA9IGluaS5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJy4vZ2FtZXNlcnZlci5pbmknLCAndXRmLTgnKSk7XG5cbiAgICAgIC8vIFJlcGxhY2UgYWxsIHRoZSBkZWZhdWx0IGNvbmZpZydzIHZhbHVlcyB3aXRoIHRoZSBsb2FkZWQgY29uZmlnJ3MgdmFsdWVzXG4gICAgICBmb3IgKHZhciBvYmogaW4gbG9hZCkge1xuICAgICAgICB0aGlzLmNvbmZpZ1tvYmpdID0gbG9hZFtvYmpdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gTm8gY29uZmlnXG4gICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBDb25maWcgbm90IGZvdW5kLi4uIEdlbmVyYXRpbmcgbmV3IGNvbmZpZ1wiKTtcblxuICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbmZpZ1xuICAgICAgZnMud3JpdGVGaWxlU3luYygnLi9nYW1lc2VydmVyLmluaScsIGluaS5zdHJpbmdpZnkodGhpcy5jb25maWcsIG51bGwpKTtcbiAgICB9XG4gIH1cblxuICBzd2l0Y2hTcGVjdGF0b3IocGxheWVyKSB7XG4gICAgaWYgKHRoaXMuZ2FtZU1vZGUuc3BlY0J5TGVhZGVyYm9hcmQpIHtcbiAgICAgIHBsYXllci5zcGVjdGF0ZWRQbGF5ZXIrKztcbiAgICAgIGlmIChwbGF5ZXIuc3BlY3RhdGVkUGxheWVyID09IHRoaXMubGVhZGVyYm9hcmQubGVuZ3RoKSB7XG4gICAgICAgIHBsYXllci5zcGVjdGF0ZWRQbGF5ZXIgPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGaW5kIG5leHQgbm9uLXNwZWN0YXRvciB3aXRoIGNlbGxzIGluIHRoZSBjbGllbnQgbGlzdFxuICAgICAgdmFyIG9sZFBsYXllciA9IHBsYXllci5zcGVjdGF0ZWRQbGF5ZXIgKyAxO1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIHdoaWxlIChwbGF5ZXIuc3BlY3RhdGVkUGxheWVyICE9IG9sZFBsYXllciAmJiBjb3VudCAhPSB0aGlzLmNsaWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGlmIChvbGRQbGF5ZXIgPT0gdGhpcy5jbGllbnRzLmxlbmd0aCkge1xuICAgICAgICAgIG9sZFBsYXllciA9IDA7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY2xpZW50c1tvbGRQbGF5ZXJdKSB7XG4gICAgICAgICAgLy8gQnJlYWsgb3V0IG9mIGxvb3AgaW4gY2FzZSBjbGllbnQgdHJpZXMgdG8gc3BlY3RhdGUgYW4gdW5kZWZpbmVkIHBsYXllclxuICAgICAgICAgIHBsYXllci5zcGVjdGF0ZWRQbGF5ZXIgPSAtMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNsaWVudHNbb2xkUGxheWVyXS5wbGF5ZXJUcmFja2VyLmNlbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIG9sZFBsYXllcisrO1xuICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuICAgICAgaWYgKGNvdW50ID09IHRoaXMuY2xpZW50cy5sZW5ndGgpIHtcbiAgICAgICAgcGxheWVyLnNwZWN0YXRlZFBsYXllciA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLnNwZWN0YXRlZFBsYXllciA9IG9sZFBsYXllcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTdGF0cyBzZXJ2ZXJcblxuICBzdGFydFN0YXRzU2VydmVyKHBvcnQpIHtcbiAgICAvLyBEbyBub3Qgc3RhcnQgdGhlIHNlcnZlciBpZiB0aGUgcG9ydCBpcyBuZWdhdGl2ZVxuICAgIGlmIChwb3J0IDwgMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBzdGF0c1xuICAgIHRoaXMuc3RhdHMgPSBcIlRlc3RcIjtcbiAgICB0aGlzLmdldFN0YXRzKCk7XG5cbiAgICAvLyBTaG93IHN0YXRzXG4gICAgdGhpcy5odHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKHRoaXMuc3RhdHMpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmh0dHBTZXJ2ZXIubGlzdGVuKHBvcnQsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gU3RhdHMgc2VydmVyXG4gICAgICBjb25zb2xlLmxvZyhcIltHYW1lXSBMb2FkZWQgc3RhdHMgc2VydmVyIG9uIHBvcnQgXCIgKyBwb3J0KTtcbiAgICAgIHNldEludGVydmFsKHRoaXMuZ2V0U3RhdHMuYmluZCh0aGlzKSwgdGhpcy5jb25maWcuc2VydmVyU3RhdHNVcGRhdGUgKiAxMDAwKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG5cbiAgZ2V0U3RhdHMoKSB7XG4gICAgdmFyIHBsYXllcnMgPSAwO1xuICAgIHRoaXMuY2xpZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGNsaWVudCkge1xuICAgICAgaWYgKGNsaWVudC5wbGF5ZXJUcmFja2VyICYmIGNsaWVudC5wbGF5ZXJUcmFja2VyLmNlbGxzLmxlbmd0aCA+IDApXG4gICAgICAgIHBsYXllcnMrK1xuICAgIH0pO1xuICAgIHZhciBzID0ge1xuICAgICAgJ2N1cnJlbnRfcGxheWVycyc6IHRoaXMuY2xpZW50cy5sZW5ndGgsXG4gICAgICAnYWxpdmUnOiBwbGF5ZXJzLFxuICAgICAgJ3NwZWN0YXRvcnMnOiB0aGlzLmNsaWVudHMubGVuZ3RoIC0gcGxheWVycyxcbiAgICAgICdtYXhfcGxheWVycyc6IHRoaXMuY29uZmlnLnNlcnZlck1heENvbm5lY3Rpb25zLFxuICAgICAgJ2dhbWVtb2RlJzogdGhpcy5nYW1lTW9kZS5uYW1lLFxuICAgICAgJ3N0YXJ0X3RpbWUnOiB0aGlzLnN0YXJ0VGltZVxuICAgIH1cbiAgICB0aGlzLnN0YXRzID0gSlNPTi5zdHJpbmdpZnkocyk7XG4gIH1cbn1cblxuLy8gQ3VzdG9tIHByb3RvdHlwZSBmdW5jdGlvbnNcbi8vIFtdIHN5bnRheCB0byBvdmVycmlkZSB0eXBlc2NyaXB0IHdhcm5pbmdcbldlYlNvY2tldFsnc2VuZFBhY2tldCddID0gZnVuY3Rpb24ocGFja2V0KSB7XG4gIGZ1bmN0aW9uIGdldEJ1ZihkYXRhKSB7XG4gICAgdmFyIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5idWZmZXIgfHwgZGF0YSk7XG4gICAgdmFyIGwgPSBkYXRhLmJ5dGVMZW5ndGggfHwgZGF0YS5sZW5ndGg7XG4gICAgdmFyIG8gPSBkYXRhLmJ5dGVPZmZzZXQgfHwgMDtcbiAgICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcihsKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBidWZmZXJbaV0gPSBhcnJheVtvICsgaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG4gIC8vaWYgKHRoaXMucmVhZHlTdGF0ZSA9PSBXZWJTb2NrZXQuT1BFTiAmJiAodGhpcy5fc29ja2V0LmJ1ZmZlclNpemUgPT0gMCkgJiYgcGFja2V0LmJ1aWxkKSB7XG4gIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gV2ViU29ja2V0Lk9QRU4gJiYgcGFja2V0LmJ1aWxkKSB7XG4gICAgdmFyIGJ1ZiA9IHBhY2tldC5idWlsZCgpO1xuICAgIHRoaXMuc2VuZChnZXRCdWYoYnVmKSwge2JpbmFyeTogdHJ1ZX0pO1xuICB9IGVsc2UgaWYgKCFwYWNrZXQuYnVpbGQpIHtcbiAgICAvLyBEbyBub3RoaW5nXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yZWFkeVN0YXRlID0gV2ViU29ja2V0LkNMT1NFRDtcbiAgICB0aGlzLmVtaXQoJ2Nsb3NlJyk7XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=