import { gql } from "@apollo/client";

export const GET_PLAYER_STATS = gql`
  query GetPlayerStats($teamId: Int!, $playerId: Int!, $season: String!) {
    teams(ids: [$teamId]) {
      players(ids: [$playerId]) {
        id
        name
        games(seasons: [$season]) {
          date
          location
          opponent {
            full_name
          }
          result
          teamScore
          opponentScore
          rebounds
          assists
          score
          minutesPlayed
        }
        stats(seasons: [$season, "career"]) {
          gamesPlayed
          score
          assists
          meanAssists
          rebounds
          meanRebounds
          minutesPlayed
        }
      }
    }
  }
`;
