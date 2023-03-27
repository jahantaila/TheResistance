"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGameState = exports.updateGameOptions = exports.memberLeave = exports.memberJoin = exports.clientLeaveGame = exports.clientRejoinGame = exports.clientStartGame = exports.clientLeaveLobby = exports.clientJoinLobby = exports.clientCreateLobby = exports.reset = exports.initialize = exports.hydrate = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
exports.hydrate = (0, toolkit_1.createAction)("lobby/hydrate");
exports.initialize = (0, toolkit_1.createAction)("lobby/initialize");
exports.reset = (0, toolkit_1.createAction)("lobby/reset");
// Client actions are actions that the browser sends to the server
// Other actions are the actual actions that are processed by the redux reducers
// Tell the server that you'd like to create a lobby
exports.clientCreateLobby = (0, toolkit_1.createAction)("lobby/client-create");
// Tell the server that you'd like to join a lobby
exports.clientJoinLobby = (0, toolkit_1.createAction)("lobby/client-join");
// Tell the server that you'd like to leave a lobby
exports.clientLeaveLobby = (0, toolkit_1.createAction)("lobby/client-leave");
// Tell the server that you'd like to start the game (host only)
exports.clientStartGame = (0, toolkit_1.createAction)("lobby/client-start-game");
// Tell the server if you want to rejoin the game at a particular index
// Only for people rejoining the game after disconnecting
exports.clientRejoinGame = (0, toolkit_1.createAction)("lobby/client-rejoin-game");
// Tell the server you want to leave the game
exports.clientLeaveGame = (0, toolkit_1.createAction)("lobby/client-leave-game");
exports.memberJoin = (0, toolkit_1.createAction)("lobby/member-join");
exports.memberLeave = (0, toolkit_1.createAction)("lobby/member-leave");
exports.updateGameOptions = (0, toolkit_1.createAction)("lobby/update-game-options");
exports.updateGameState = (0, toolkit_1.createAction)("lobby/update-game-state");
//# sourceMappingURL=actions.js.map