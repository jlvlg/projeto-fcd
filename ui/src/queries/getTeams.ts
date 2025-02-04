import { gql } from "@apollo/client";

export const GET_TEAMS = gql`
    query GetWestTeams {
      teams {
        id
        full_name
        conference
        rank
      }
    }
  `;