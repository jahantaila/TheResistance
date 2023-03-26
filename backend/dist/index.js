"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const socket_io_1 = __importDefault(require("socket.io"));
const server_1 = require("./server");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(httpServer);
const server = new server_1.Server(io);
const port = (_a = process_1.default.env.PORT) !== null && _a !== void 0 ? _a : 8080;
httpServer.listen(port, () => {
    console.log("Starting HTTP server on port " + port);
});
httpServer.addListener("close", () => {
    console.log("HTTP server closed");
});
app.get("/api/statistics", (req, res) => {
    const players = server.sockets.size;
    const lobbies = server.rooms.size;
    const games = Array.from(server.rooms.values()).map((x) => x.game !== null).length;
    return res.json({
        players,
        lobbies,
        games,
    });
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/build/index.html"));
});
// Handle SIGINT and SIGTERM
process_1.default.on("SIGINT", () => httpServer.close());
process_1.default.on("SIGTERM", () => httpServer.close());
