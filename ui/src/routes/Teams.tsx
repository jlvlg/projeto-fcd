import { useQuery } from "@apollo/client";
import { gql } from "__generated__";
import Table from "components/table";
import { useMemo } from "react";

type Props = {};

const GET_TEAMS = gql(`
  query GetWestTeams {
    teams {
      id
      full_name
      conference
      rank
    }
  }
`);

const TABLE_HEADERS = [
  {
    label: "Conferência Oeste",
    children: [{ label: "Rank" }, { label: "Nome" }, { label: "ID" }],
  },
  {
    label: "Conferência Leste",
    children: [{ label: "Rank" }, { label: "Nome" }, { label: "ID" }],
  },
];

export default function TeamsPage({}: Props) {
  const { data } = useQuery(GET_TEAMS);

  const columns = useMemo(() => {
    const westRank: (string | number)[] = [];
    const westName: (string | number)[] = [];
    const westId: (string | number)[] = [];
    const eastRank: (string | number)[] = [];
    const eastName: (string | number)[] = [];
    const eastId: (string | number)[] = [];

    data?.teams.forEach((team) => {
      if (team.conference === "West") {
        westRank.push(team.rank!);
        westName.push(team.full_name);
        westId.push(team.id);
      } else {
        eastRank.push(team.rank!);
        eastName.push(team.full_name);
        eastId.push(team.id);
      }
    });

    return [westRank, westName, westId, eastRank, eastName, eastId];
  }, [data]);

  return <Table headers={TABLE_HEADERS} columns={columns} />;
}
