import { useQuery } from "@apollo/client";
import { GET_TEAM_DETAILS } from "queries/teamQueries";
import { useParams } from "react-router-dom";

export function useTeamDetails() {
  const { id } = useParams();
  const numericId = Number(id);
  const { data, loading, error } = useQuery(GET_TEAM_DETAILS, {
    variables: { id: numericId },
  });

  return { data, loading, error };
}
