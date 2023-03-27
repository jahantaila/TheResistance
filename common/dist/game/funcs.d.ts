import { ChatMessage, GameInitOptions, GameCustomRoleOptions, GameState, MissionAction, ProposalVote, Role, Alligance, Team, Mission, Color } from "./types";
export declare const GameFunc: {
    init(options: GameInitOptions): GameState | null;
    tick(state: GameState): GameState;
    begin: {
        teamBuilding(state: GameState, noMissionIncrement?: boolean, pass?: boolean): GameState;
        teamBuildingReview(state: GameState): GameState;
        voting(state: GameState): GameState;
        votingReview(state: GameState): GameState;
        mission(state: GameState): GameState;
        missionReview(state: GameState): GameState;
        finishedAssassinate(state: GameState): GameState;
        finished(state: GameState): GameState;
    };
    action: {
        updateTeamMembers(state: GameState, members: number[]): GameState;
        finishTeamBuilding(state: GameState): GameState;
        passTeamBuilding(state: GameState): GameState;
        sendProposalVote(state: GameState, player: number, vote: ProposalVote): GameState;
        sendMissionAction(state: GameState, player: number, action: MissionAction): GameState;
        updateAssassinChoice(state: GameState, player: number): GameState;
        finishAssassinChoice(state: GameState): GameState;
        newChatMessage(state: GameState, message: ChatMessage): GameState;
    };
    util: {
        getRoleList(numPlayers: number, options: "normal" | "assassins" | GameCustomRoleOptions): Role[] | null;
        getCustomRoleList(numPlayers: number, roleOptions: GameCustomRoleOptions): Role[] | null;
        getKnownRoles(playerIndex: number, roleList: Role[]): Map<number, Role[]>;
        getProposalsRemaining(teams: Team[], mission: number): number;
        getProposalVoteResult(votes: ProposalVote[]): "accept" | "reject";
        getMissionResult(mission: Mission, numPlayers: number): MissionAction;
        getWinner(state: GameState): Alligance | null;
        getIsHammer(state: GameState): boolean;
        getWinnerFromMissions(state: GameState): Alligance | null;
        getColorOrder(names: string[]): Color[];
    };
};
