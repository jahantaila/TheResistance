"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRolesDisplay = exports.GameAgentRoles = exports.GameRolesOrder = exports.GameMaxPlayers = exports.GameMinPlayers = exports.TeamPoolsAssassins = exports.TeamPoolsNormal = exports.MissionNeedDouble = exports.MissionPlayerCount = exports.GamePhaseLengths = exports.ColorOrderDefault = void 0;
exports.ColorOrderDefault = [
    "red",
    "yellow",
    "blue",
    "orange",
    "green",
    "purple",
    "pink",
    "cyan",
    "teal",
    "indigo",
];
exports.GamePhaseLengths = {
    "role-reveal": 10,
    "team-building": 180,
    "team-building-review": 3,
    voting: 120,
    "voting-review": 5,
    mission: 20,
    "mission-review": 5,
    "finished-assassinate": 120,
    finished: 1,
};
exports.MissionPlayerCount = {
    5: [2, 3, 2, 3, 3],
    6: [2, 3, 4, 3, 4],
    7: [2, 3, 3, 4, 4],
    8: [3, 4, 4, 5, 5],
    9: [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5],
};
exports.MissionNeedDouble = {
    5: [false, false, false, false, false],
    6: [false, false, false, false, false],
    7: [false, false, false, true, false],
    8: [false, false, false, true, false],
    9: [false, false, false, true, false],
    10: [false, false, false, true, false],
};
exports.TeamPoolsNormal = {
    5: ["agent", "agent", "agent", "spy", "spy"],
    6: ["agent", "agent", "agent", "agent", "spy", "spy"],
    7: ["agent", "agent", "agent", "agent", "spy", "spy", "spy"],
    8: ["agent", "agent", "agent", "agent", "agent", "spy", "spy", "spy"],
    9: [
        "agent",
        "agent",
        "agent",
        "agent",
        "agent",
        "agent",
        "spy",
        "spy",
        "spy",
    ],
    10: [
        "agent",
        "agent",
        "agent",
        "agent",
        "agent",
        "agent",
        "spy",
        "spy",
        "spy",
        "spy",
    ],
};
exports.TeamPoolsAssassins = {
    5: ["agent", "agent", "captain", "spy", "assassin"],
    6: ["agent", "agent", "agent", "captain", "spy", "assassin"],
    7: ["agent", "agent", "agent", "captain", "spy", "intern", "assassin"],
    8: [
        "agent",
        "agent",
        "agent",
        "agent",
        "captain",
        "spy",
        "assassin",
        "intern",
    ],
    9: [
        "agent",
        "agent",
        "agent",
        "agent",
        "agent",
        "captain",
        "spy",
        "assassin",
        "intern",
    ],
    10: [
        "agent",
        "agent",
        "agent",
        "agent",
        "agent",
        "captain",
        "spy",
        "spy",
        "assassin",
        "intern",
    ],
};
exports.GameMinPlayers = 5;
exports.GameMaxPlayers = 10;
exports.GameRolesOrder = [
    "agent",
    "captain",
    "deputy",
    "spy",
    "assassin",
    "intern",
    "imposter",
    "mole",
];
exports.GameAgentRoles = ["agent", "captain", "deputy"];
exports.GameRolesDisplay = new Map([
    ["agent", "Agent"],
    ["captain", "Captain"],
    ["deputy", "Deputy"],
    ["spy", "Spy"],
    ["assassin", "Assassin"],
    ["intern", "Intern"],
    ["imposter", "Imposter"],
    ["mole", "Mole"],
]);
//# sourceMappingURL=constants.js.map