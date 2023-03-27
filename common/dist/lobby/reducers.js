"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyReducer = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const actions_1 = require("./actions");
const initialState = {
    id: "",
    inGame: false,
    memberIDs: [],
    names: [],
    gameInitOptions: "normal",
};
exports.LobbyReducer = (0, toolkit_1.createReducer)(initialState, (builder) => {
    builder
        .addCase(actions_1.hydrate, (state, action) => {
        return action.payload;
    })
        .addCase(actions_1.initialize, (state, action) => {
        return {
            id: action.payload.id,
            inGame: false,
            memberIDs: [],
            names: [],
            gameInitOptions: "normal",
        };
    })
        .addCase(actions_1.reset, (state, action) => {
        return initialState;
    })
        .addCase(actions_1.memberJoin, (state, action) => {
        state.memberIDs.push(action.payload.memberID);
        state.names.push(action.payload.name);
    })
        .addCase(actions_1.memberLeave, (state, action) => {
        const index = state.memberIDs.findIndex((x) => x === action.payload.memberID);
        if (index === -1)
            return state;
        state.memberIDs.splice(index, 1);
        state.names.splice(index, 1);
    })
        .addCase(actions_1.updateGameOptions, (state, action) => {
        state.gameInitOptions = action.payload.options;
        return state;
    })
        .addCase(actions_1.updateGameState, (state, action) => {
        state.inGame = action.payload.inGame;
    });
});
//# sourceMappingURL=reducers.js.map