import { useQuery } from "@apollo/client";
import {
  CircularProgress,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { GET_PLAYER_GAME_STATS } from "queries/getPlayerGameStats";
import Table from "components/table";
import { transpose } from "components/teamTables";

interface Props {
  id: string | undefined;
  playerid: string | undefined;
  season: string;
  selectOpponent?: boolean;
}

const PlayerGameStatsTable = ({
  id,
  playerid,
  season,
  selectOpponent,
}: Props) => {
  const teamId = id ? parseInt(id, 10) : 0;
  const playerId = playerid ? parseInt(playerid, 10) : null;
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);

  const { loading, error, data } = useQuery(GET_PLAYER_GAME_STATS, {
    variables: { teamId, playerIds: [playerId], season },
    skip: !teamId || !playerId,
  });

  if (!teamId || !playerId) {
    return <p>Erro: ID do time ou do jogador não foi fornecido.</p>;
  }

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const players = data?.teams?.[0]?.players || [];
  let games = players[0]?.games || [];

  const uniqueOpponents = Array.from(
    new Set(games.map((game) => game.opponent.full_name))
  );

  if (selectOpponent && selectedOpponent) {
    games = games.filter(
      (game) => game.opponent.full_name === selectedOpponent
    );
  }

  const headers = [
    { label: "Data do Jogo" },
    { label: "Adversário" },
    { label: "Resultado (D ou V)" },
    { label: "Local" },
    { label: "Placar" },
    { label: "Placar do Adversário" },
    { label: "REB" },
    { label: "AST" },
    { label: "Tentativas de Cestas de 3 PTS" },
    { label: "Cestas de 3 PTS" },
    { label: "Tempo de Permanência do Jogador em Quadra" },
  ];

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const columns = games.map((game) => [
    formatDate(game.date),
    game.opponent.full_name,
    game.result === "W" ? "V" : "D",
    game.location === "home" ? "Casa" : "Fora",
    game.teamScore,
    game.opponentScore,
    game.rebounds,
    game.assists,
    game.threePointFieldGoalsAttempted,
    game.threePointFieldGoals,
    `${game.minutesPlayed.toFixed(2)} minutos`,
  ]);

  return (
    <>
      {selectOpponent && uniqueOpponents.length > 0 && (
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography variant="h6">Adversário</Typography>
          <Select
            value={selectedOpponent || uniqueOpponents[0]}
            onChange={(event) => setSelectedOpponent(event.target.value)}
          >
            {uniqueOpponents.map((opponent) => (
              <MenuItem key={opponent} value={opponent}>
                {opponent}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      <Table
        headers={headers}
        columns={transpose(columns)}
        onClickRow={(row) => console.log("Selected Row:", row)}
      />
    </>
  );
};

export default PlayerGameStatsTable;
