import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_TEAM_DETAILS } from "queries/teamQueries";
import { Team } from "types/Types";

type QueryResponse = { teams: Team[] };

export function useTeamDetails() {
  const { id } = useParams();
  const numericId = Number(id);
  const { data, loading, error } = useQuery<QueryResponse>(GET_TEAM_DETAILS, { variables: { id: numericId } });

  return { data, loading, error };
}
