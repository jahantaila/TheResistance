import { GameCustomRoleOptions, GameMode } from "../game";
export declare type LobbyState = {
    id: string;
    memberIDs: string[];
    names: string[];
    gameInitOptions: GameMode | GameCustomRoleOptions;
    inGame: boolean;
};
