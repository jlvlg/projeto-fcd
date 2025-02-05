import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import Table from "components/table/index";
import { GET_TEAMS } from "queries/getTeams";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Team } from "types/Types";

type Props = {};

const TABLE_HEADERS = [
  [
    {
      label: "Conferência Oeste",
      children: [{ label: "Rank" }, { label: "Nome" }, { label: "ID" }],
    },
  ],
  [
    {
      label: "Conferência Leste",
      children: [{ label: "Rank" }, { label: "Nome" }, { label: "ID" }],
    },
  ],
];

export default function TeamsPage({}: Props) {
  const { data } = useQuery(GET_TEAMS);
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const westRank: (string | number)[] = [];
    const westName: (string | number)[] = [];
    const westId: (string | number)[] = [];
    const eastRank: (string | number)[] = [];
    const eastName: (string | number)[] = [];
    const eastId: (string | number)[] = [];

    data?.teams.forEach((team: Team) => {
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

    return [
      [westRank, westName, westId],
      [eastRank, eastName, eastId],
    ];
  }, [data]);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Table
        headers={TABLE_HEADERS[0]}
        columns={columns[0]}
        onClickRow={(row) => navigate(`/teams/${row[2]}`)}
      />
      <Table
        headers={TABLE_HEADERS[1]}
        columns={columns[1]}
        onClickRow={(row) => navigate(`/teams/${row[2]}`)}
      />
    </Box>
  );
}
