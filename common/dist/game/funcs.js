"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameFunc = void 0;
const util_1 = require("../util");
const constants_1 = require("./constants");
exports.GameFunc = {
    init(options) {
        let seed = options.seed;
        const numPlayers = options.names.length;
        if (numPlayers !== options.socketIDs.length) {
            return null;
        }
        if (numPlayers < constants_1.GameMinPlayers || numPlayers > constants_1.GameMaxPlayers) {
            return null;
        }
        // Shuffle names and socketIDs together
        const mixed = options.names.map((x, i) => [
            x,
            options.socketIDs[i],
        ]);
        (0, util_1.shuffle)(mixed, seed++);
        const names = mixed.map((x) => x[0]);
        const socketIDs = mixed.map((x) => x[1]);
        const roles = exports.GameFunc.util.getRoleList(numPlayers, options.gamemode);
        if (roles === null)
            return null;
        (0, util_1.shuffle)(roles, seed++);
        return {
            player: {
                names,
                socketIDs,
                roles,
            },
            winner: null,
            game: {
                mission: 0,
                phase: "role-reveal",
                phaseCountdown: constants_1.GamePhaseLengths["role-reveal"],
            },
            mission: null,
            missionHistory: [],
            team: null,
            teamHistory: [],
            chat: [],
            statusMessage: "Welcome to The Resistance",
            assassinChoice: null,
        };
    },
    tick(state) {
        if (state.game.phaseCountdown > 0) {
            if (state.game.phase !== "finished") {
                state.game.phaseCountdown--;
            }
            return state;
        }
        // Go to next phase
        switch (state.game.phase) {
            case "role-reveal":
                return exports.GameFunc.begin.teamBuilding(state);
            case "team-building":
                // Inactivity
                return exports.GameFunc.action.passTeamBuilding(state);
            case "team-building-review":
                return exports.GameFunc.begin.voting(state);
            case "voting":
                return this.begin.votingReview(state);
            case "voting-review":
                const team = (0, util_1.last)(state.teamHistory);
                const res = exports.GameFunc.util.getProposalVoteResult(team.votes);
                if (res === "accept") {
                    return exports.GameFunc.begin.mission(state);
                }
                else {
                    if (exports.GameFunc.util.getIsHammer(state)) {
                        return exports.GameFunc.begin.finished(state);
                    }
                    else {
                        return this.begin.teamBuilding(state, true);
                    }
                }
            case "mission":
                return exports.GameFunc.begin.missionReview(state);
            case "mission-review":
                const winner = exports.GameFunc.util.getWinnerFromMissions(state);
                if (winner === null) {
                    return exports.GameFunc.begin.teamBuilding(state);
                }
                else {
                    if (state.player.roles.includes("assassin") && winner === "agent") {
                        return exports.GameFunc.begin.finishedAssassinate(state);
                    }
                    else {
                        return exports.GameFunc.begin.finished(state);
                    }
                }
            case "finished-assassinate":
                return exports.GameFunc.begin.finished(state);
            case "finished":
                // Should never happen
                return state;
        }
    },
    begin: {
        teamBuilding(state, noMissionIncrement = false, pass = false) {
            state.game.phase = "team-building";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["team-building"];
            if (!noMissionIncrement) {
                state.game.mission += 1;
            }
            const prev = (0, util_1.last)(state.teamHistory);
            let nextLeader;
            if (pass) {
                nextLeader = (state.team.leader + 1) % state.player.names.length;
            }
            else if (prev === null) {
                nextLeader = 0;
            }
            else {
                nextLeader = (prev.leader + 1) % state.player.names.length;
            }
            state.team = {
                mission: state.game.mission,
                leader: nextLeader,
                members: [],
                votes: [],
            };
            // Status
            state.statusMessage = `{{name:${nextLeader}}} is proposing a team`;
            return state;
        },
        teamBuildingReview(state) {
            state.game.phase = "team-building-review";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["team-building-review"];
            // Chat
            const leader = state.team.leader;
            const members = state.team.members;
            state.statusMessage = `${(0, util_1.nameStr)(leader)} has proposed ${members
                .map(util_1.nameStr)
                .join(", ")}`;
            state.chat.push({
                type: "system",
                content: `${(0, util_1.nameStr)(leader)} has proposed ${members
                    .map(util_1.nameStr)
                    .join(", ")}`,
            });
            return state;
        },
        voting(state) {
            state.game.phase = "voting";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["voting"];
            state.team.votes = state.player.names.map(() => "none");
            return state;
        },
        votingReview(state) {
            state.game.phase = "voting-review";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["voting-review"];
            // Archive team
            const team = state.team;
            state.teamHistory.push(team);
            state.team = null;
            // Chat/status
            let msg = "";
            const res = exports.GameFunc.util.getProposalVoteResult(team.votes);
            if (res === "accept") {
                msg += "The proposal was {{success:ACCEPTED}}";
            }
            else if (res === "reject") {
                msg += "The proposal was {{fail:REJECTED}}";
            }
            state.chat.push({
                type: "system",
                content: msg,
            });
            state.statusMessage = msg;
            return state;
        },
        mission(state) {
            state.game.phase = "mission";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["mission"];
            // Archive team
            const team = (0, util_1.last)(state.teamHistory);
            const members = team.members.sort((a, b) => a - b);
            const actions = members.map(() => null);
            const mission = {
                mission: state.game.mission,
                members,
                actions,
            };
            state.mission = mission;
            // Status
            const membersStr = members.map(util_1.nameStr);
            state.statusMessage = `${membersStr.join(", ")} are going on a mission`;
            return state;
        },
        missionReview(state) {
            state.game.phase = "mission-review";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["mission-review"];
            // Archive mission
            const mission = state.mission;
            state.missionHistory.push(mission);
            state.mission = null;
            // Chat/status
            let msg = "";
            const res = exports.GameFunc.util.getMissionResult(mission, state.player.socketIDs.length);
            if (res === "success") {
                msg += `Mission ${mission.mission} {{success:SUCCESSFUL}} `;
            }
            else if (res === "fail") {
                msg += `Mission ${mission.mission} {{fail:FAILED}} `;
            }
            const numFails = (0, util_1.count)(mission.actions, "fail");
            msg += `(${(0, util_1.plural)(numFails, "fail")} detected)`;
            state.statusMessage = msg;
            state.chat.push({
                type: "system",
                content: msg,
            });
            return state;
        },
        finishedAssassinate(state) {
            state.game.phase = "finished-assassinate";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["finished-assassinate"];
            const assassin = state.player.roles.indexOf("assassin");
            let msg = `${(0, util_1.nameStr)(assassin)} is picking a player to assassinate`;
            state.statusMessage = msg;
            state.chat.push({
                type: "system",
                content: msg,
            });
            return state;
        },
        finished(state) {
            state.game.phase = "finished";
            state.game.phaseCountdown = constants_1.GamePhaseLengths["finished"];
            state.winner = exports.GameFunc.util.getWinner(state);
            // Chat/status
            let msg = "";
            if (exports.GameFunc.util.getIsHammer(state)) {
                msg += "The agents have ran out of proposals. ";
            }
            if (state.assassinChoice !== null) {
                const choice = state.assassinChoice;
                const wasCaptain = state.player.roles[choice] === "captain";
                msg += `${(0, util_1.nameStr)(choice)} was ${wasCaptain ? "" : "not "}the {{role:captain}}. `;
            }
            const winners = state.player.roles
                .map((x, i) => i)
                .filter((x) => state.winner === "agent"
                ? constants_1.GameAgentRoles.includes(state.player.roles[x])
                : !constants_1.GameAgentRoles.includes(state.player.roles[x]))
                .map(util_1.nameStr);
            msg += `${winners.join(", ")} have won!`;
            state.statusMessage = msg;
            state.chat.push({
                type: "system",
                content: `${winners.join(", ")} have won.`,
            });
            return state;
        },
    },
    action: {
        updateTeamMembers(state, members) {
            if (state.game.phase !== "team-building") {
                return state;
            }
            const team = state.team;
            team.members = members;
            // Status
            const leader = team.leader;
            if (members.length === 0) {
                state.statusMessage = `${(0, util_1.nameStr)(leader)} is proposing a team`;
            }
            else {
                state.statusMessage = `${(0, util_1.nameStr)(leader)} is proposing ${members
                    .map(util_1.nameStr)
                    .join(", ")}`;
            }
            return state;
        },
        finishTeamBuilding(state) {
            if (state.game.phase !== "team-building") {
                return state;
            }
            const team = state.team;
            const reqPlayers = constants_1.MissionPlayerCount[state.player.names.length][(team === null || team === void 0 ? void 0 : team.mission) - 1];
            if ((team === null || team === void 0 ? void 0 : team.members.length) !== reqPlayers) {
                // This really should never happen, because the UI should prevent
                // people from submitting non-full teams
                return state;
            }
            else {
                return exports.GameFunc.begin.teamBuildingReview(state);
            }
        },
        passTeamBuilding(state) {
            if (state.game.phase !== "team-building") {
                return state;
            }
            // Chat
            const leader = state.team.leader;
            state.chat.push({
                type: "system",
                content: `${(0, util_1.nameStr)(leader)} passed the proposal`,
            });
            return exports.GameFunc.begin.teamBuilding(state, true, true);
        },
        sendProposalVote(state, player, vote) {
            if (state.game.phase !== "voting") {
                return state;
            }
            const team = state.team;
            team.votes[player] = vote;
            if (team.votes.includes("none")) {
                return state;
            }
            else {
                return exports.GameFunc.begin.votingReview(state);
            }
        },
        sendMissionAction(state, player, action) {
            if (state.game.phase !== "mission") {
                return state;
            }
            const mission = state.mission;
            const index = mission.members.indexOf(player);
            if (index === -1) {
                return state;
            }
            mission.actions[index] = action;
            if (mission.actions.indexOf(null) !== -1) {
                return state;
            }
            return exports.GameFunc.begin.missionReview(state);
        },
        updateAssassinChoice(state, player) {
            if (state.game.phase !== "finished-assassinate") {
                return state;
            }
            state.assassinChoice = player;
            return state;
        },
        finishAssassinChoice(state) {
            if (state.game.phase !== "finished-assassinate") {
                return state;
            }
            return exports.GameFunc.begin.finished(state);
        },
        newChatMessage(state, message) {
            if (message.type === "player" && message.content.length > 200) {
                return state;
            }
            state.chat.push(message);
            return state;
        },
    },
    util: {
        // Return the result of a role list
        getRoleList(numPlayers, options) {
            if (options === "normal") {
                return constants_1.TeamPoolsNormal[numPlayers].slice();
            }
            else if (options === "assassins") {
                return constants_1.TeamPoolsAssassins[numPlayers].slice();
            }
            else {
                return this.getCustomRoleList(numPlayers, options);
            }
        },
        // Return the result of a custom role list
        getCustomRoleList(numPlayers, roleOptions) {
            if (numPlayers < constants_1.GameMinPlayers || numPlayers > constants_1.GameMaxPlayers)
                return null;
            const pool = constants_1.TeamPoolsNormal[numPlayers].slice();
            const numAgents = pool.reduce((a, v) => (v === "agent" ? a + 1 : a), 0);
            const numSpies = pool.reduce((a, v) => (v === "spy" ? a + 1 : a), 0);
            const roleList = [];
            // Agents
            const agentRoles = [];
            const spyRoles = [];
            if (roleOptions.captain)
                agentRoles.push("captain");
            if (roleOptions.deputy)
                agentRoles.push("deputy");
            if (roleOptions.assassin)
                spyRoles.push("assassin");
            if (roleOptions.imposter)
                spyRoles.push("imposter");
            if (roleOptions.intern)
                spyRoles.push("intern");
            if (roleOptions.mole)
                spyRoles.push("mole");
            for (let i = 0; i < numAgents; i++) {
                const newRole = agentRoles.splice(0, 1)[0];
                if (newRole)
                    roleList.push(newRole);
                else
                    roleList.push("agent");
            }
            for (let i = 0; i < numSpies; i++) {
                const newRole = spyRoles.splice(0, 1)[0];
                if (newRole)
                    roleList.push(newRole);
                else
                    roleList.push("spy");
            }
            return roleList;
        },
        // Get the roles that are known to a player
        getKnownRoles(playerIndex, roleList) {
            const playerRole = roleList[playerIndex];
            let known = new Map();
            known.set(playerIndex, [roleList[playerIndex]]);
            if (playerRole === "captain") {
                for (let i = 0; i < roleList.length; i++) {
                    if (i === playerIndex)
                        continue;
                    if (!constants_1.GameAgentRoles.includes(roleList[i]) && roleList[i] !== "mole") {
                        known.set(i, ["spy"]);
                    }
                }
            }
            else if (playerRole === "deputy") {
                const roles = [];
                if (roleList.includes("captain")) {
                    roles.push("captain");
                }
                if (roleList.includes("imposter")) {
                    roles.push("imposter");
                }
                for (let i = 0; i < roleList.length; i++) {
                    if (i === playerIndex)
                        continue;
                    if (roleList[i] === "captain" || roleList[i] === "imposter") {
                        known.set(i, roles.slice());
                    }
                }
            }
            else if (["spy", "assassin", "imposter", "mole"].includes(playerRole)) {
                for (let i = 0; i < roleList.length; i++) {
                    if (i === playerIndex)
                        continue;
                    if (!constants_1.GameAgentRoles.includes(roleList[i]) &&
                        roleList[i] !== "intern") {
                        known.set(i, [roleList[i]]);
                    }
                }
            }
            return known;
        },
        // Get the number of team proposals remaining
        getProposalsRemaining(teams, mission) {
            let count = 0;
            for (let i = teams.length - 1; i >= 0; i--) {
                if (teams[i].mission === mission) {
                    count++;
                }
                else {
                    break;
                }
            }
            return 5 - count;
        },
        // Return the result of a proposal votes
        getProposalVoteResult(votes) {
            let accept = 0;
            let reject = 0;
            for (const vote of votes) {
                if (vote === "accept")
                    accept++;
                if (vote === "reject")
                    reject++;
            }
            return accept > reject ? "accept" : "reject";
        },
        // Get the result of a mission (success/fail)
        getMissionResult(mission, numPlayers) {
            const requiresTwo = constants_1.MissionNeedDouble[numPlayers][mission.mission - 1];
            const failCount = (0, util_1.count)(mission.actions, "fail");
            if (failCount >= 2 || (!requiresTwo && failCount >= 1)) {
                return "fail";
            }
            else {
                return "success";
            }
        },
        // Return the winner of a game,
        // Based on winner, hammer, and assassin result
        getWinner(state) {
            if (exports.GameFunc.util.getIsHammer(state)) {
                return "spy";
            }
            const winner = exports.GameFunc.util.getWinnerFromMissions(state);
            if (winner === null || winner === "spy") {
                return winner;
            }
            else if (winner === "agent") {
                if (!state.player.roles.includes("assassin"))
                    return "agent";
                if (state.assassinChoice === null)
                    return "agent";
                const assassinated = state.player.roles[state.assassinChoice];
                if (assassinated === "captain") {
                    return "spy";
                }
                else {
                    return "agent";
                }
            }
            throw "up"; // How did you even get here
        },
        // Returns whether or not the last 5 team proposals were failed
        getIsHammer(state) {
            return (exports.GameFunc.util.getProposalsRemaining(state.teamHistory, state.game.mission) === 0);
        },
        // Returns the winner, based on missions only
        getWinnerFromMissions(state) {
            let fail = 0, success = 0;
            for (const mission of state.missionHistory) {
                if (exports.GameFunc.util.getMissionResult(mission, state.player.names.length) ===
                    "success") {
                    success++;
                }
                else {
                    fail++;
                }
            }
            if (fail === 3)
                return "spy";
            if (success === 3)
                return "agent";
            return null;
        },
        getColorOrder(names) {
            if (names.length > constants_1.GameMaxPlayers) {
                return constants_1.ColorOrderDefault;
            }
            // Basically makes it so that
            // colors are assigned alphabetically
            const mixed = names
                .map((x, i) => [x, constants_1.ColorOrderDefault[i]])
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map((x) => x[1]);
            return mixed;
        },
    },
};
//# sourceMappingURL=funcs.js.map