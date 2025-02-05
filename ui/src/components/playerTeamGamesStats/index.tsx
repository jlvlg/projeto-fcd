import { useQuery } from "@apollo/client";
import {
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { GET_PLAYER_GAME_STATS } from "queries/getPlayerGameStats";
import Table from "components/table";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import { LoadingComponent } from "components/loading";

interface Props {
  id: string | undefined;
  playerid: string | undefined;
  season: string;
}

const PlayerTeamGamesStats = ({ id, playerid, season }: Props) => {
  const teamId = id ? parseInt(id, 10) : 0;
  const playerId = playerid ? parseInt(playerid, 10) : null;

  const { loading, error, data } = useQuery(GET_PLAYER_GAME_STATS, {
    variables: { teamId, playerIds: playerId ? [playerId] : [], season },
    skip: !teamId || !playerId,
  });

  const players = data?.teams?.[0]?.players || [];
  const games = players[0]?.games || [];
  const uniqueOpponents = Array.from(
    new Set(games.map((game) => game.opponent.full_name))
  );

  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);

  useEffect(() => {
    if (uniqueOpponents.length > 0 && selectedOpponent === null) {
      setSelectedOpponent(uniqueOpponents[0]);
    }
  }, [uniqueOpponents, selectedOpponent]);

  if (!teamId || !playerId) {
    return <p>Erro: ID do time ou do jogador não foi fornecido.</p>;
  }

  if (loading) return <LoadingComponent />;
  if (error) return <p>Error: {error.message}</p>;

  const totalHomeGames = games.filter(
    (game) => game.location === "home"
  ).length;
  const totalAwayGames = games.filter(
    (game) => game.location === "road"
  ).length;

  const filteredGames = games.filter(
    (game) => game.opponent.full_name === selectedOpponent
  );
  const homeGamesAgainstOpponent = filteredGames.filter(
    (game) => game.location === "home"
  ).length;
  const awayGamesAgainstOpponent = filteredGames.filter(
    (game) => game.location === "road"
  ).length;

  const tableHeaders = [
    { label: "Local" },
    { label: "Total Jogos (Todos os Adversários)" },
    { label: `Contra Adversário (${selectedOpponent})` },
  ];

  const tableColumns = [
    ["Casa", "Fora"],
    [totalHomeGames, totalAwayGames],
    [homeGamesAgainstOpponent, awayGamesAgainstOpponent],
  ];

  const barChartData = {
    labels: ["Total Jogos", "Contra " + selectedOpponent],
    datasets: [
      {
        label: "Jogos em Casa",
        data: [totalHomeGames, homeGamesAgainstOpponent],
        backgroundColor: ["#3e95cd", "#8e5ea2"],
      },
      {
        label: "Jogos Fora",
        data: [totalAwayGames, awayGamesAgainstOpponent],
        backgroundColor: ["#3cba9f", "#e8c3b9"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Jogos em Casa Contra Adversário", "Jogos Fora Contra Adversário"],
    datasets: [
      {
        label: "Distribuição de Jogos Contra Adversário",
        data: [homeGamesAgainstOpponent, awayGamesAgainstOpponent],
        backgroundColor: ["#ff6384", "#36a2eb"],
      },
    ],
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography variant="h6">Adversário</Typography>
        <Select
          value={selectedOpponent || ""}
          onChange={(event) => setSelectedOpponent(event.target.value)}
        >
          {uniqueOpponents.map((opponent) => (
            <MenuItem key={opponent} value={opponent}>
              {opponent}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Table headers={tableHeaders} columns={tableColumns} />
      <Box display="flex" gap={4}>
        <Box flex={1} height="300px">
          <BarChart data={barChartData} />
        </Box>
        <Box flex={1} height="300px">
          <PieChart data={pieChartData} />
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerTeamGamesStats;
