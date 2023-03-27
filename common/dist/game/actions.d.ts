import { GameInitOptions, GameState, MissionAction, ProposalVote } from "./types";
export declare const hydrate: import("@reduxjs/toolkit").ActionCreatorWithPayload<GameState, string>;
export declare const initialize: import("@reduxjs/toolkit").ActionCreatorWithPayload<GameInitOptions, string>;
export declare const playerDisconnect: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    socketID: string;
}, string>;
export declare const playerReconnect: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    index: number;
    name: string;
    socketID: string;
}, string>;
export declare const tick: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"game/tick">;
export declare const updateTeamMembers: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    members: number[];
}, string>;
export declare const finishTeamBuilding: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"game/finish-team-building">;
export declare const passTeamBuilding: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"game/pass-team-building">;
export declare const sendProposalVote: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    player: number;
    vote: ProposalVote;
}, string>;
export declare const sendMissionAction: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    player: number;
    action: MissionAction;
}, string>;
export declare const updateAssassinChoice: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    player: number;
}, string>;
export declare const finishAssassinChoice: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"game/finish-assassin-choice">;
export declare const newPlayerChatMessage: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    player: number;
    message: string;
}, string>;
