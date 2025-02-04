import { gql } from "@apollo/client";

export const GET_TEAM_DETAILS = gql`
  query GetTeamDetails($id: Int!) {
    teams(ids: [$id]) {
      id
      full_name
      conference
      stats(seasons: ["2023-24", "2024-25"]) {
        season
        wins
        winsHome
        winsRoad
        losses
        lossesHome
        lossesRoad
        scorePerGame
        assistsPerGame
        reboundsPerGame
        threePointFieldGoals
        rebounds
        offensiveRebounds
        defensiveRebounds
        twoPointFieldGoals
        freeThrows
        steals
        blocksPerGame
        turnoversPerGame
        foulsPerGame
      }
      games(seasons: ["2023-24", "2024-25"]) {
        date
        opponent { full_name }
        result
        location
        teamScore
        opponentScore
      }
    }
  }
`;
