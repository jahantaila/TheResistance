export type GameInitOptions = {
  socketIDs: string[];
  names: string[];
  seed: number;
  gamemode: GameMode | GameCustomRoleOptions;
};
export type GameCustomRoleOptions = {
  captain: boolean;
  deputy: boolean;
  assassin: boolean;
  imposter: boolean;
  intern: boolean;
  mole: boolean;
};
export type Color =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

export type GameMode = "normal" | "assassins";
export type GamePhase =
  | "role-reveal"
  | "team-building"
  | "team-building-review"
  | "voting"
  | "voting-review"
  | "mission"
  | "mission-review"
  | "finished-assassinate"
  | "finished";

export type ChatMessage = PlayerChatMessage | SystemChatMessage;
export type PlayerChatMessage = {
  type: "player";
  player: number;
  content: string;
};
export type SystemChatMessage = {
  type: "system";
  content: string;
};

export type ProposalVote = "accept" | "reject" | "none";
export type MissionAction = "success" | "fail";
export type Team = {
  mission: number;
  leader: number;
  members: number[];
  votes: ProposalVote[];
};
export type Mission = {
  mission: number;
  members: number[];
  actions: (MissionAction | null)[];
};
export type Alligance = "agent" | "spy";
export type Role =
  | "agent"
  | "captain"
  | "deputy"
  | "spy"
  | "assassin"
  | "imposter"
  | "mole"
  | "intern";
// --- Team Agent ---
// Agent knows noone
// Captain knows who spies are
// Deputy knows captain and impostor but doesn't know who's who
// --- Team Spies ---
// Spies know fellow spies (except intern)
// Assassin knows fellow spies (except intern), can kill one person at end of game
// Imposter knows fellow spies, appears as Captain to Deputy
// Mole is unknown to Captain
// Intern is unknown to other spies

export type GameState = {
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
  // Team only exists during team building and voting phases
  team: Team | null;
  teamHistory: Team[];
  // Mission only exists during mission phases
  mission: Mission | null;
  missionHistory: Mission[];
  chat: ChatMessage[];
  statusMessage: string | null;
};
