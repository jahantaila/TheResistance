"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("@reduxjs/toolkit");
const game_1 = require("../game");
function getInitializedGame() {
    const store = (0, toolkit_1.configureStore)({
        reducer: game_1.GameReducer,
    });
    store.dispatch(game_1.GameAction.initialize({
        gamemode: "normal",
        names: ["alice", "bob", "charlie", "david", "edward"],
        seed: 0,
        socketIDs: ["a", "b", "c", "d", "e"],
    }));
    return store;
}
console.log(JSON.stringify(getInitializedGame().getState()));
//# sourceMappingURL=index.js.map