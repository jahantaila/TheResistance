import { LobbyState } from "./types";
import { GameCustomRoleOptions, GameMode } from "../game";
export declare const hydrate: import("@reduxjs/toolkit").ActionCreatorWithPayload<LobbyState, string>;
export declare const initialize: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
}, string>;
export declare const reset: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"lobby/reset">;
export declare const clientCreateLobby: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: string;
}, string>;
export declare const clientJoinLobby: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: string;
    roomID: string;
}, string>;
export declare const clientLeaveLobby: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"lobby/client-leave">;
export declare const clientStartGame: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"lobby/client-start-game">;
export declare const clientRejoinGame: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    index: number;
}, string>;
export declare const clientLeaveGame: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"lobby/client-leave-game">;
export declare const memberJoin: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    memberID: string;
    name: string;
}, string>;
export declare const memberLeave: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    memberID: string;
}, string>;
export declare const updateGameOptions: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    options: GameMode | GameCustomRoleOptions;
}, string>;
export declare const updateGameState: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    inGame: boolean;
}, string>;
