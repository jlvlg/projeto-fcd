import { useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import Table from "components/table";
import { transpose } from "components/teamTables";
import { GET_TEAM_PLAYERS } from "queries/getTeamPlayers";
import { useNavigate } from "react-router";
import { Player } from "types/Types";

type Props = {
  teamId: number;
  playerId?: number; 
};

const TeamPlayersTable = ({ teamId, playerId }: Props) => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<{ teams: { players: Player[] }[] }>(
    GET_TEAM_PLAYERS,
    {
      variables: { teamIds: [teamId] },
    }
  );

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  let players: Player[] = data?.teams[0]?.players || [];

  if (playerId) {
    players = players.filter((player) => player.id === playerId);
  }

  if (playerId && players.length === 0) {
    return <p>Jogador não encontrado.</p>;
  }

  const headers = [
    { label: "ID" },
    { label: "Nome" },
    { label: "Altura" },
    { label: "Peso" },
    { label: "Idade" },
    { label: "Experiência" },
    { label: "Posição" },
    { label: "Universidade" },
    { label: "Salário" },
  ];

  const columns = players.map((player) => [
    player.id,
    player.name,
    `${player.height.toFixed(2)} m`,
    `${player.weight.toFixed(2)} kg`,
    player.age,
    player.experience === 0 ? "Novato" : player.experience,
    player.position,
    player.college || "N/A",
    player.salary ? `$${player.salary.toFixed(2).toLocaleString()}` : "N/A",
  ]);

  return (
    <Table
      headers={headers}
      columns={transpose(columns)}
      onClickRow={(row) => navigate(`/teams/${teamId}/${row[0]}`)}
    />
  );
};

export default TeamPlayersTable;
