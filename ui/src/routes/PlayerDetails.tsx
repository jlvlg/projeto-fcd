import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import ExtremeAnalysis from "components/gumbelVisualization";
import { LoadingComponent } from "components/loading";
import SidebarMenu from "components/menu";
import PlayerGameStatsTable from "components/playerGameStats";
import PlayerStatistics from "components/playerStatistics";
import PlayerTeamGamesStats from "components/playerTeamGamesStats";
import RegressionVisualization, {
  RegressionMode,
} from "components/regressionVisualization";
import { GET_PLAYER_DETAILS } from "queries/getPlayerDetails";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const PlayerDetails = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { id, playerid } = useParams<{ id?: string; playerid?: string }>();
  const season = "2024-25";
  const teamId = id ? parseInt(id, 10) : 0;
  const playerId = playerid ? parseInt(playerid, 10) : null;
  const menuItems = [
    "Estatísticas",
    "Dados das Partidas",
    "Partidas Específicas",
    "Jogos Realizados",
    "Análise de Gumbel",
    "Regressão Linear",
    "Regressão Logística",
    "GAM Linear",
    "GAM Poisson",
  ];
  const drawerWidth = 240;

  const { loading, error, data } = useQuery(GET_PLAYER_DETAILS, {
    variables: { teamId, playerIds: playerId ? [playerId] : [] },
    skip: !teamId || !playerId,
  });

  if (!teamId || !playerId) {
    return <p>Erro: ID do time ou do jogador não foi fornecido.</p>;
  }
  if (loading) return <LoadingComponent />;
  if (error) return <p>Error: {error.message}</p>;

  const player = data?.teams?.[0]?.players?.[0];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SidebarMenu
        backButtonPath={`/teams/${id}`}
        player={player}
        menuItems={menuItems}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        drawerWidth={drawerWidth}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: `calc(100% - ${drawerWidth}px)`,
          padding: 1,
        }}
      >
        <Box sx={{ p: 1, width: "100%", height: "100%" }}>
          {selectedTab === 0 && (
            <PlayerStatistics
              teamId={Number(id)}
              playerId={Number(playerid)}
              season={season}
            />
          )}
          {selectedTab === 1 && (
            <PlayerGameStatsTable id={id} playerid={playerid} season={season} />
          )}
          {selectedTab === 2 && (
            <PlayerGameStatsTable
              id={id}
              playerid={playerid}
              season={season}
              selectOpponent
            />
          )}
          {selectedTab === 3 && (
            <PlayerTeamGamesStats id={id} playerid={playerid} season={season} />
          )}
          {selectedTab === 4 && (
            <ExtremeAnalysis teamId={Number(id)} playerId={playerId} />
          )}
          {selectedTab === 5 && (
            <RegressionVisualization mode={RegressionMode.LINEAR} />
          )}
          {selectedTab === 6 && (
            <RegressionVisualization mode={RegressionMode.LOGISTIC} />
          )}
          {selectedTab === 7 && (
            <RegressionVisualization mode={RegressionMode.GAMLINEAR} />
          )}
          {selectedTab === 8 && (
            <RegressionVisualization mode={RegressionMode.GAMPOISSON} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerDetails;
