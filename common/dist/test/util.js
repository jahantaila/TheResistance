"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionAll = exports.voteAll = exports.addTeamMembers = exports.getInitializedGame = exports.tickUntil = exports.SampleIDs = exports.SampleNames = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const __1 = require("..");
let _store = (0, toolkit_1.configureStore)({ reducer: __1.GameReducer });
exports.SampleNames = [
    "alice",
    "bob",
    "charlie",
    "david",
    "edward",
    "fred",
    "george",
    "harry",
    "ivan",
    "jamie",
];
exports.SampleIDs = (0, __1.range)(10).map((x) => x + "");
function tickUntil(store, phase) {
    while (store.getState().game.phase !== phase) {
        store.dispatch(__1.GameAction.tick());
    }
}
exports.tickUntil = tickUntil;
function getInitializedGame(options, numPlayers = 5) {
    const initialState = {
        player: {
            names: exports.SampleNames.slice(0, numPlayers),
            roles: __1.GameFunc.util.getRoleList(numPlayers, options),
            socketIDs: exports.SampleIDs.slice(0, numPlayers),
        },
        winner: null,
        game: { mission: 0, phase: "role-reveal", phaseCountdown: 10 },
        mission: null,
        missionHistory: [],
        team: null,
        teamHistory: [],
        chat: [],
        statusMessage: "Welcome to the Resistance",
        assassinChoice: null,
    };
    const store = (0, toolkit_1.configureStore)({
        reducer: __1.GameReducer,
    });
    store.dispatch(__1.GameAction.hydrate(initialState));
    return store;
}
exports.getInitializedGame = getInitializedGame;
function addTeamMembers(store, requireSpy = false) {
    const state = store.getState();
    const playersReq = __1.MissionPlayerCount[5][store.getState().game.mission - 1];
    if (!requireSpy) {
        store.dispatch(__1.GameAction.updateTeamMembers({ members: (0, __1.range)(playersReq) }));
    }
    else {
        let roles = state.player.roles
            .map((_, i) => i)
            .filter((x) => !__1.GameAgentRoles.includes(state.player.roles[x]));
        let i = 0;
        while (roles.length < playersReq) {
            if (!roles.includes(i)) {
                roles.push(i);
            }
            i++;
        }
        if (roles.length > playersReq) {
            roles = roles.slice(0, playersReq);
        }
        store.dispatch(__1.GameAction.updateTeamMembers({ members: roles }));
    }
}
exports.addTeamMembers = addTeamMembers;
function voteAll(store, vote) {
    const players = store.getState().player.names;
    for (let i = 0; i < players.length; i++) {
        let action;
        if (typeof vote === "number") {
            action = i < vote ? "accept" : "reject";
        }
        else {
            action = vote;
        }
        store.dispatch(__1.GameAction.sendProposalVote({
            player: i,
            vote: action,
        }));
    }
}
exports.voteAll = voteAll;
function missionAll(store, action) {
    const state = store.getState();
    const roles = state.player.roles;
    const members = state.mission.members;
    members.forEach((i) => {
        if (__1.GameAgentRoles.includes(roles[i])) {
            store.dispatch(__1.GameAction.sendMissionAction({
                player: i,
                action: "success",
            }));
        }
        else {
            store.dispatch(__1.GameAction.sendMissionAction({
                player: i,
                action,
            }));
        }
    });
}
exports.missionAll = missionAll;
//# sourceMappingURL=util.js.map