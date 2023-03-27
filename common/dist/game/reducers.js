"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameReducer = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const actions_1 = require("./actions");
const funcs_1 = require("./funcs");
const initialState = {
    player: {
        names: [],
        roles: [],
        socketIDs: [],
    },
    game: {
        mission: 0,
        phase: "role-reveal",
        phaseCountdown: 0,
    },
    statusMessage: null,
    team: null,
    teamHistory: [],
    mission: null,
    missionHistory: [],
    winner: null,
    chat: [],
    assassinChoice: null,
};
exports.GameReducer = (0, toolkit_1.createReducer)(initialState, (builder) => {
    builder
        .addCase(actions_1.hydrate, (state, action) => {
        return action.payload;
    })
        .addCase(actions_1.initialize, (state, action) => {
        const res = funcs_1.GameFunc.init(action.payload);
        if (!res)
            return state;
        return res;
    })
        .addCase(actions_1.playerDisconnect, (state, action) => {
        const index = state.player.socketIDs.indexOf(action.payload.socketID);
        if (index >= 0 && index < state.player.socketIDs.length) {
            state.player.socketIDs[index] = null;
        }
        return state;
    })
        .addCase(actions_1.playerReconnect, (state, action) => {
        state.player.socketIDs[action.payload.index] = action.payload.socketID;
        state.player.names[action.payload.index] = action.payload.name;
        return state;
    })
        .addCase(actions_1.tick, (state) => {
        return funcs_1.GameFunc.tick(state);
    })
        .addCase(actions_1.updateTeamMembers, (state, action) => {
        return funcs_1.GameFunc.action.updateTeamMembers(state, action.payload.members);
    })
        .addCase(actions_1.finishTeamBuilding, (state) => {
        return funcs_1.GameFunc.action.finishTeamBuilding(state);
    })
        .addCase(actions_1.passTeamBuilding, (state) => {
        return funcs_1.GameFunc.action.passTeamBuilding(state);
    })
        .addCase(actions_1.sendProposalVote, (state, action) => {
        return funcs_1.GameFunc.action.sendProposalVote(state, action.payload.player, action.payload.vote);
    })
        .addCase(actions_1.sendMissionAction, (state, action) => {
        return funcs_1.GameFunc.action.sendMissionAction(state, action.payload.player, action.payload.action);
    })
        .addCase(actions_1.updateAssassinChoice, (state, action) => {
        return funcs_1.GameFunc.action.updateAssassinChoice(state, action.payload.player);
    })
        .addCase(actions_1.finishAssassinChoice, (state, action) => {
        return funcs_1.GameFunc.action.finishAssassinChoice(state);
    })
        .addCase(actions_1.newPlayerChatMessage, (state, action) => {
        funcs_1.GameFunc.action.newChatMessage(state, {
            type: "player",
            player: action.payload.player,
            content: action.payload.message,
        });
    });
});
//# sourceMappingURL=reducers.js.map