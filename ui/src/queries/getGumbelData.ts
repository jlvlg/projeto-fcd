import { gql } from "@apollo/client";

export const GET_GUMBLE_DATA = gql`
  query GetGumbelData($teamId: Int!, $playerId: Int!, $season: String!, $column: String!, $start: Int!, $end: Int!) {
    teams(ids: [$teamId]) {
      full_name
      players(ids: [$playerId]) {
        name
        stats(seasons: [$season]) {
          season
          meanAssists
          meanRebounds
        }
        ai {
          gumbel(column: $column, start: $start, end: $end) {
            probGreaterThan { x y }
            probLessThan { x y }
            probGreaterThanOrEqualTo { x y }
            probLessThanOrEqualTo { x y }
          }
        }
      }
    }
  }
`;

export default GET_GUMBLE_DATA;