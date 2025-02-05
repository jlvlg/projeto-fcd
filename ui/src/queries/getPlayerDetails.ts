import { gql } from "@apollo/client";

export const GET_PLAYER_DETAILS = gql`
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
`;
