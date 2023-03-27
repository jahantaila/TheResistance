import { GameCustomRoleOptions, GameMode, GamePhase } from "..";
declare let _store: import("@reduxjs/toolkit").EnhancedStore<import("..").GameState, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<import("..").GameState, import("redux").AnyAction, undefined>]>;
export declare type GameStore = typeof _store;
export declare type GameState = ReturnType<typeof _store.getState>;
export declare const SampleNames: string[];
export declare const SampleIDs: string[];
export declare function tickUntil(store: GameStore, phase: GamePhase): void;
export declare function getInitializedGame(options: GameMode | GameCustomRoleOptions, numPlayers?: number): import("@reduxjs/toolkit").EnhancedStore<import("..").GameState, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<import("..").GameState, import("redux").AnyAction, undefined>]>;
export declare function addTeamMembers(store: GameStore, requireSpy?: boolean): void;
export declare function voteAll(store: GameStore, vote: "accept" | "reject" | number): void;
export declare function missionAll(store: GameStore, action: "success" | "fail"): void;
export {};
