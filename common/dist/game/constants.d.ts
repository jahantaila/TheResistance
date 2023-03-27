import { Color, GamePhase, Role } from "./types";
export declare const ColorOrderDefault: Color[];
export declare const GamePhaseLengths: {
    [p in GamePhase]: number;
};
export declare const MissionPlayerCount: {
    [i: number]: [number, number, number, number, number];
};
export declare const MissionNeedDouble: {
    [i: number]: [boolean, boolean, boolean, boolean, boolean];
};
export declare const TeamPoolsNormal: {
    [n: number]: Role[];
};
export declare const TeamPoolsAssassins: {
    [n: number]: Role[];
};
export declare const GameMinPlayers = 5;
export declare const GameMaxPlayers = 10;
export declare const GameRolesOrder: Role[];
export declare const GameAgentRoles: Role[];
export declare const GameRolesDisplay: Map<Role, string>;
