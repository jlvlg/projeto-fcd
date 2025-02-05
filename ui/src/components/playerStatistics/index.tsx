import { useQuery } from "@apollo/client";
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { BoxPlot } from "components/charts/BoxPlot";
import { DistributionChart } from "components/charts/DistributionChart";
import { PlayerStatsTable } from "components/playerStatsCareerTable";
import TeamPlayersTable from "components/teamPlayers";
import { GET_PLAYER_STATS } from "queries/getPlaterStats";
import {
  calculateMedian,
  calculateMode,
  calculateStandardDeviation,
} from "util/calc";

type PlayerStatsProps = {
  teamId: number;
  playerId: number;
  season: string;
};

export default function PlayerStatisticsDashboard({
  teamId,
  playerId,
  season,
}: PlayerStatsProps) {
  const { loading, error, data } = useQuery(GET_PLAYER_STATS, {
    variables: { teamId, playerId, season },
  });
  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Erro ao carregar dados</Typography>;

  const player = data?.teams[0]?.players[0];
  const games = player?.games || [];

  const points = games.map((game) => game.score);
  const rebounds = games.map((game) => game.rebounds);
  const assists = games.map((game) => game.assists);

  const meanPoints =
    points.reduce((a: number, b: number) => a + b, 0) / points.length || 0;
  const medianPoints = calculateMedian(points);
  const modePoints = calculateMode(points);
  const stdDevPoints = calculateStandardDeviation(points);
  const belowMeanPointsPercentage = (points.filter((p: number) => p < meanPoints).length / points.length) * 100;

  const meanRebounds =
    rebounds.reduce((a: number, b: number) => a + b, 0) / rebounds.length || 0;
  const medianRebounds = calculateMedian(rebounds);
  const modeRebounds = calculateMode(rebounds);
  const stdDevRebounds = calculateStandardDeviation(rebounds);
  const belowMeanReboundsPercentage = (rebounds.filter((r: number) => r < meanRebounds).length / rebounds.length) * 100;

  const meanAssists =
    assists.reduce((a: number, b: number) => a + b, 0) / assists.length || 0;
  const medianAssists = calculateMedian(assists);
  const modeAssists = calculateMode(assists);
  const stdDevAssists = calculateStandardDeviation(assists);
  const belowMeanAssistsPercentage = (assists.filter((a: number) => a < meanAssists).length / assists.length) * 100;

  return (
    <Box sx={{ padding: 4, backgroundColor: "#121212", color: "#e0e0e0" }}>
      <Typography variant="h4" textAlign="center" gutterBottom color="#90caf9">
        Estatísticas do Jogador: {player?.name}
      </Typography>

      <Card sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <TeamPlayersTable teamId={teamId} playerId={playerId} />
      </Card>

      <PlayerStatsTable playerId={playerId} teamId={teamId} season={season} />

      <Card sx={{ padding: 3, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Dados Comparativos
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Stack
          direction="row"
          spacing={4}
          flexWrap="wrap"
          justifyContent="center"
        >
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>Pontos</Typography>
            <Typography>Média: {meanPoints.toFixed(2)}</Typography>
            <Typography>Mediana: {medianPoints.toFixed(2)}</Typography>
            <Typography>Moda: {modePoints.join(", ")}</Typography>
            <Typography>Desvio Padrão: {stdDevPoints.toFixed(2)}</Typography>
            <Typography>Percentual abaixo da média: {belowMeanPointsPercentage.toFixed(2)}%</Typography>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>Rebotes</Typography>
            <Typography>Média: {meanRebounds.toFixed(2)}</Typography>
            <Typography>Mediana: {medianRebounds.toFixed(2)}</Typography>
            <Typography>Moda: {modeRebounds.join(", ")}</Typography>
            <Typography>Desvio Padrão: {stdDevRebounds.toFixed(2)}</Typography>
            <Typography>Percentual abaixo da média: {belowMeanReboundsPercentage.toFixed(2)}%</Typography>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="h6" gutterBottom>Assistências</Typography>
            <Typography>Média: {meanAssists.toFixed(2)}</Typography>
            <Typography>Mediana: {medianAssists.toFixed(2)}</Typography>
            <Typography>Moda: {modeAssists.join(", ")}</Typography>
            <Typography>Desvio Padrão: {stdDevAssists.toFixed(2)}</Typography>
            <Typography>Percentual abaixo da média: {belowMeanAssistsPercentage.toFixed(2)}%</Typography>
          </Box>
        </Stack>
      </Card>
      <Card sx={{ padding: 3, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gráfico de Distribuição de Pontos
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Card sx={{ padding: 3, backgroundColor: "#1e1e1e" }}>
          <DistributionChart
            label="Pontos"
            data={points}
            mean={meanPoints}
            median={medianPoints}
            mode={modePoints}
          />
        </Card>
      </Card>

      <Card sx={{ padding: 3, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gráfico de Distribuição de Rebotes
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Card sx={{ padding: 3, backgroundColor: "#1e1e1e" }}>
          <DistributionChart
            label="Rebotes"
            data={rebounds}
            mean={meanRebounds}
            median={medianRebounds}
            mode={modeRebounds}
          />
        </Card>
      </Card>

      <Card sx={{ padding: 3, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gráfico de Distribuição de Assistências
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Card sx={{ padding: 3, backgroundColor: "#1e1e1e" }}>
          <DistributionChart
            label="Assistências"
            data={assists}
            mean={meanAssists}
            median={medianAssists}
            mode={modeAssists}
          />
        </Card>
      </Card>

      <Card sx={{ padding: 3, backgroundColor: "#1e1e1e" }}>
        <Typography variant="h5" gutterBottom>
          Gráfico Box Plot
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <BoxPlot points={points} rebounds={rebounds} assists={assists} />
      </Card>
    </Box>
  );
}
