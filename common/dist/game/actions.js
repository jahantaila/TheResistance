"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPlayerChatMessage = exports.finishAssassinChoice = exports.updateAssassinChoice = exports.sendMissionAction = exports.sendProposalVote = exports.passTeamBuilding = exports.finishTeamBuilding = exports.updateTeamMembers = exports.tick = exports.playerReconnect = exports.playerDisconnect = exports.initialize = exports.hydrate = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
// Basic
exports.hydrate = (0, toolkit_1.createAction)("game/hydrate");
exports.initialize = (0, toolkit_1.createAction)("game/initialize");
exports.playerDisconnect = (0, toolkit_1.createAction)("game/player-disconnect");
exports.playerReconnect = (0, toolkit_1.createAction)("game/player-reconnect");
exports.tick = (0, toolkit_1.createAction)("game/tick");
// Team Building
exports.updateTeamMembers = (0, toolkit_1.createAction)("game/update-team-members");
exports.finishTeamBuilding = (0, toolkit_1.createAction)("game/finish-team-building");
exports.passTeamBuilding = (0, toolkit_1.createAction)("game/pass-team-building");
// Team Voting
exports.sendProposalVote = (0, toolkit_1.createAction)("game/send-proposal-vote");
// Mission
exports.sendMissionAction = (0, toolkit_1.createAction)("game/send-mission-action");
// Assassin
exports.updateAssassinChoice = (0, toolkit_1.createAction)("game/update-assassin-choice");
exports.finishAssassinChoice = (0, toolkit_1.createAction)("game/finish-assassin-choice");
// Chat
exports.newPlayerChatMessage = (0, toolkit_1.createAction)("game/new-player-chat-message");
// export const newSystemChatMessage = createAction<{
//   message: string;
// }>("game/new-system-chat-message");
// export const updateStatusMessage = createAction<{
//   message: string | null;
// }>("game/update-status-message");
//# sourceMappingURL=actions.js.map