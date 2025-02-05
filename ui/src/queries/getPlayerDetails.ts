import { gql } from "__generated__";

export const GET_PLAYER_DETAILS = gql(`
  query GetPlayerDetails($teamId: Int!, $playerIds: [Int!]!) {
    teams(ids: [$teamId]) {
      players(ids: $playerIds) {
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
