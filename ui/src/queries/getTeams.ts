import { gql } from "__generated__";

export const GET_TEAMS = gql(`
    query GetWestTeams {
      teams {
        id
        full_name
        conference
        rank
      }
    }
  `);
