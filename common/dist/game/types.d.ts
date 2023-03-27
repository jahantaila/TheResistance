export declare type GameInitOptions = {
    socketIDs: string[];
    names: string[];
    seed: number;
    gamemode: GameMode | GameCustomRoleOptions;
};
export declare type GameCustomRoleOptions = {
    captain: boolean;
    deputy: boolean;
    assassin: boolean;
    imposter: boolean;
    intern: boolean;
    mole: boolean;
};
export declare type Color = "red" | "orange" | "yellow" | "green" | "teal" | "cyan" | "blue" | "indigo" | "purple" | "pink";
export declare type GameMode = "normal" | "assassins";
export declare type GamePhase = "role-reveal" | "team-building" | "team-building-review" | "voting" | "voting-review" | "mission" | "mission-review" | "finished-assassinate" | "finished";
export declare type ChatMessage = PlayerChatMessage | SystemChatMessage;
export declare type PlayerChatMessage = {
    type: "player";
    player: number;
    content: string;
};
export declare type SystemChatMessage = {
    type: "system";
    content: string;
};
export declare type ProposalVote = "accept" | "reject" | "none";
export declare type MissionAction = "success" | "fail";
export declare type Team = {
    mission: number;
    leader: number;
    members: number[];
    votes: ProposalVote[];
};
export declare type Mission = {
    mission: number;
    members: number[];
    actions: (MissionAction | null)[];
};
export declare type Alligance = "agent" | "spy";
export declare type Role = "agent" | "captain" | "deputy" | "spy" | "assassin" | "imposter" | "mole" | "intern";
export declare type GameState = {
    player: {
        names: string[];
        socketIDs: (string | null)[];
        roles: Role[];
    };
    assassinChoice: number | null;
    winner: Alligance | null;
    game: {
        phase: GamePhase;
        mission: number;
        phaseCountdown: number;
    };
    team: Team | null;
    teamHistory: Team[];
    mission: Mission | null;
    missionHistory: Mission[];
    chat: ChatMessage[];
    statusMessage: string | null;
};
