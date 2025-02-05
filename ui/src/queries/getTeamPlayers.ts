import { gql } from "__generated__";

export const GET_TEAM_PLAYERS = gql(`
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
`);
