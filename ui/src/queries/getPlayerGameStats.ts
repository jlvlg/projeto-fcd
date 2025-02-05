import { gql } from "__generated__";

export const GET_PLAYER_GAME_STATS = gql(`
  query GetPlayerGameStats($teamId: Int!, $playerIds: [Int], $season: String!) {
    teams(ids: [$teamId]) {
      players(ids: $playerIds) {
        id
        name
        games(seasons: [$season]) {
          date
          opponent {
            full_name
          }
          result
          location
          teamScore
          opponentScore
          rebounds
          assists
          threePointFieldGoalsAttempted
          threePointFieldGoals
          minutesPlayed
        }
      }
    }
  }
`);
