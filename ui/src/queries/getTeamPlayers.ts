import { gql } from "@apollo/client";

export const GET_TEAM_PLAYERS = gql`
    query GetTeamPlayers($teamIds: [Int]!) {
      teams(ids: $teamIds) {
        players {
          id
          name
          height
          weight
          age
          experience
          position
          college
          salary
        }
      }
    }
  `;