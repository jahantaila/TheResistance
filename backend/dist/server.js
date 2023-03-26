"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const common_modules_1 = require("common-modules");
const lobby_1 = require("./lobby");
const util_1 = require("./util");
class Server {
    constructor(io) {
        this.io = io;
        this.io.on("connection", this.onConnection.bind(this));
        this.sockets = new Map();
        this.rooms = new Map();
        this.idManager = new util_1.RoomCodeManager();
    }
    onConnection(socket) {
        console.log("Connect", socket.id);
        this.sockets.set(socket.id, null);
        socket.on("disconnect", () => this.onDisconnect(socket));
        socket.on("action", (action) => this.onAction(socket, action));
    }
    onDisconnect(socket) {
        console.log("Disconnect", socket.id);
        const roomID = this.sockets.get(socket.id);
        this.sockets.delete(socket.id);
        if (!roomID)
            return;
        const room = this.rooms.get(roomID);
        if (!room)
            return;
        room.onLeave(socket, this.io);
        if (room.store.getState().memberIDs.length === 0) {
            console.log("Lobby closed:", roomID);
            this.rooms.delete(roomID);
            this.idManager.releaseCode(roomID);
        }
    }
    onAction(socket, action) {
        const clientCreateLobby = common_modules_1.LobbyAction.clientCreateLobby.type;
        const clientJoinLobby = common_modules_1.LobbyAction.clientJoinLobby.type;
        const clientLeaveLobby = common_modules_1.LobbyAction.clientLeaveLobby.type;
        if (action.type === clientCreateLobby) {
            // Protect against double create
            if (this.sockets.get(socket.id)) {
                return;
            }
            // Create a lobby
            const roomID = this.idManager.generateCode();
            const room = new lobby_1.Lobby(roomID);
            console.log("Lobby created:", roomID);
            this.rooms.set(roomID, room);
            this.sockets.set(socket.id, room.id);
            room.onJoin(action.payload.name, socket, this.io);
        }
        else if (action.type === clientJoinLobby) {
            // Protect against double join
            if (this.sockets.get(socket.id))
                return;
            const room = this.rooms.get(action.payload.roomID);
            if (!room) {
                socket.emit("action", (0, util_1.actionFromServer)({ type: "error", error: "Invalid room code" }));
                return;
            }
            this.sockets.set(socket.id, room.id);
            room.onJoin(action.payload.name, socket, this.io);
        }
        else if (action.type === clientLeaveLobby) {
            const roomID = this.sockets.get(socket.id);
            if (!roomID)
                return;
            const room = this.rooms.get(roomID);
            if (!room)
                return;
            this.sockets.set(socket.id, null);
            room.onLeave(socket, this.io);
            socket.emit("action", (0, util_1.actionFromServer)(common_modules_1.LobbyAction.reset()));
            if (room.store.getState().memberIDs.length === 0) {
                console.log("Lobby closed:", roomID);
                this.rooms.delete(roomID);
                this.idManager.releaseCode(roomID);
            }
        }
        else {
            const roomID = this.sockets.get(socket.id);
            if (!roomID)
                return;
            const room = this.rooms.get(roomID);
            if (!room)
                return;
            room.onAction(action, socket, this.io);
        }
    }
}
exports.Server = Server;
