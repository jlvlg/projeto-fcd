export type Team = {
    id: number;
    full_name: string;
    conference: string;
    stats: Stat[];
    games: Game[];
    rank: number;
  };
  
  export type Stat = {
    season: string;
    wins: number;
    winsHome: number;
    winsRoad: number;
    losses: number;
    lossesHome: number;
    lossesRoad: number;
    scorePerGame: number;
    assistsPerGame: number;
    reboundsPerGame: number;
    threePointFieldGoals: number;
    rebounds: number;
    offensiveRebounds: number;
    defensiveRebounds: number;
    twoPointFieldGoals: number;
    freeThrows: number;
    steals: number;
    blocksPerGame: number;
    turnoversPerGame: number;
    foulsPerGame: number;
  };
  
  export type Game = {
    date: string;
    opponent: {
      full_name: string;
    };
    result: "W" | "L";
    location: string;
    teamScore: number;
    opponentScore: number;
    rebounds: number;
    score: number;
    assists: number;
    threePointFieldGoalsAttempted: number;
    threePointFieldGoals: number;
    minutesPlayed: number;
  };
  
  
  export type TotalStats = {
    wins: number;
    winsHome: number;
    winsRoad: number;
    losses: number;
    lossesHome: number;
    lossesRoad: number;
    scorePerGame: number;
    assistsPerGame: number;
    reboundsPerGame: number;
    threePointFieldGoals: number;
    rebounds: number;
    offensiveRebounds: number;
    defensiveRebounds: number;
    twoPointFieldGoals: number;
    freeThrows: number;
    steals: number;
    blocksPerGame: number;
    turnoversPerGame: number;
    foulsPerGame: number;
  };
  

export type Player = {
  id: number;
  name: string;
  height: number;
  weight: number;
  age: number;
  experience: number;
  position: string;
  college: string | null;
  salary: number | null;
};