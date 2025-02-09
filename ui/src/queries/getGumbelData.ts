import { gql } from "__generated__";

export const GET_GUMBLE_DATA = gql(`
  query GetGumbelData($teamId: Int!, $playerId: Int!, $column: String!, $start: Int!, $end: Int!) {
    teams(ids: [$teamId]) {
      full_name
      players(ids: [$playerId]) {
        name
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
`);

export default GET_GUMBLE_DATA;
