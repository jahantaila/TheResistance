"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.Lobby = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const common_modules_1 = require("common-modules");
const util_1 = require("./util");
class Lobby {
    constructor(id) {
        this.store = (0, toolkit_1.configureStore)({
            reducer: common_modules_1.LobbyReducer,
        });
        this.store.dispatch(common_modules_1.LobbyAction.initialize({ id }));
        this.game = null;
    }
    get id() {
        return this.store.getState().id;
    }
    onJoin(name, socket, io) {
        const memberJoinAction = common_modules_1.LobbyAction.memberJoin({
            name,
            memberID: socket.id,
        });
        this.store.dispatch(memberJoinAction);
        io.to(this.id).emit("action", (0, util_1.actionFromServer)(memberJoinAction));
        socket.join(this.id);
        const hydrateAction = common_modules_1.LobbyAction.hydrate(this.store.getState());
        socket.emit("action", (0, util_1.actionFromServer)(hydrateAction));
        // Hydrate game too
        if (this.game) {
            const hydrateGameAction = common_modules_1.GameAction.hydrate(this.game.store.getState());
            socket.emit("action", (0, util_1.actionFromServer)(hydrateGameAction));
        }
    }
    onAction(action, socket, io) {
        const clientStartGame = common_modules_1.LobbyAction.clientStartGame.type;
        const clientLeaveGame = common_modules_1.LobbyAction.clientLeaveGame.type;
        const clientRejoinGame = common_modules_1.LobbyAction.clientRejoinGame.type;
        if (action.type === clientStartGame) {
            // Safeguard
            if (this.game !== null) {
                return;
            }
            const numPlayers = this.store.getState().memberIDs.length;
            if (numPlayers < common_modules_1.GameMinPlayers || numPlayers > common_modules_1.GameMaxPlayers) {
                return;
            }
            // Create game
            const gameOptions = {
                socketIDs: this.store.getState().memberIDs,
                names: this.store.getState().names,
                // Should be good enough
                seed: new Date().getTime() % 10000,
                gamemode: this.store.getState().gameInitOptions,
            };
            this.game = new Game(gameOptions, this.id);
            // Get everyone to join game
            const hydrateGameStateAction = common_modules_1.GameAction.hydrate(this.game.store.getState());
            io.to(this.id).emit("action", (0, util_1.actionFromServer)(hydrateGameStateAction));
            const updateGameStateAction = common_modules_1.LobbyAction.updateGameState({
                inGame: true,
            });
            this.store.dispatch(updateGameStateAction);
            io.to(this.id).emit("action", (0, util_1.actionFromServer)(updateGameStateAction));
            // Start game
            console.log("Game start:", this.id);
            this.game.start(io);
        }
        else if (action.type === clientLeaveGame) {
            this.handleUserLeaveGame(socket, io);
        }
        else if (action.type === clientRejoinGame) {
            if (this.game) {
                const state = this.store.getState();
                const index = state.memberIDs.indexOf(socket.id);
                const name = state.names[index];
                this.game.onRejoin(socket.id, name, action.payload.index, io);
            }
        }
        else if (action.type.startsWith("lobby/")) {
            this.store.dispatch(action);
            io.to(this.id).emit("action", (0, util_1.actionFromServer)(action));
        }
        else if (action.type.startsWith("game/")) {
            if (this.game) {
                this.game.onAction(action, socket, io);
            }
        }
    }
    onLeave(socket, io) {
        this.handleUserLeaveGame(socket, io);
        const memberLeaveAction = common_modules_1.LobbyAction.memberLeave({ memberID: socket.id });
        this.store.dispatch(memberLeaveAction);
        io.to(this.id).emit("action", (0, util_1.actionFromServer)(memberLeaveAction));
    }
    // Used twice
    handleUserLeaveGame(socket, io) {
        var _a;
        if (this.game === null)
            return;
        this.game.onLeave(socket.id, io);
        // Delete the game if necessary
        if (this.game === null)
            return;
        const socketIDs = (_a = this.game) === null || _a === void 0 ? void 0 : _a.store.getState().player.socketIDs;
        const count = socketIDs === null || socketIDs === void 0 ? void 0 : socketIDs.reduce((a, v) => (v === null ? a : a + 1), 0);
        if (count === 0) {
            // Start game
            console.log("Game end:", this.id);
            this.game.stop();
            this.game = null;
            const updateGameStateAction = common_modules_1.LobbyAction.updateGameState({
                inGame: false,
            });
            this.store.dispatch(updateGameStateAction);
            io.to(this.id).emit("action", (0, util_1.actionFromServer)(updateGameStateAction));
        }
    }
}
exports.Lobby = Lobby;
class Game {
    constructor(options, roomID) {
        this.roomID = roomID;
        this.store = (0, toolkit_1.configureStore)({
            reducer: common_modules_1.GameReducer,
        });
        this.store.dispatch(common_modules_1.GameAction.initialize(options));
        this.timeout = null;
    }
    start(io) {
        if (!this.timeout) {
            this.timeout = setInterval(() => this.tick(io), 1000);
        }
    }
    stop() {
        if (this.timeout) {
            clearInterval(this.timeout);
        }
    }
    tick(io) {
        const tickAction = common_modules_1.GameAction.tick();
        this.store.dispatch(tickAction);
        io.to(this.roomID).emit("action", (0, util_1.actionFromServer)(tickAction));
        if (this.store.getState().game.phase === "finished") {
            this.stop();
        }
    }
    onAction(action, socket, io) {
        this.store.dispatch(action);
        io.to(this.roomID).emit("action", (0, util_1.actionFromServer)(action));
    }
    onRejoin(socketID, name, index, io) {
        const playerRejoinAction = common_modules_1.GameAction.playerReconnect({
            index,
            socketID,
            name,
        });
        this.store.dispatch(playerRejoinAction);
        io.to(this.roomID).emit("action", (0, util_1.actionFromServer)(playerRejoinAction));
    }
    onLeave(socketID, io) {
        const playerDisconnectAction = common_modules_1.GameAction.playerDisconnect({ socketID });
        this.store.dispatch(playerDisconnectAction);
        io.to(this.roomID).emit("action", (0, util_1.actionFromServer)(playerDisconnectAction));
    }
}
exports.Game = Game;
