import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import RadarChart from "components/charts/RadarChart";
import LineChart from "components/charts/LineChart";
import ScatterChart from "components/charts/ScatterChart";
import { CircularProgress, Typography, Box } from "@mui/material";
import { useTeamDetails } from "hooks/useTeamDetails";
import { Team } from "types/Types";

export default function TeamCharts({selectedSeason} : {selectedSeason: number}) {
    const { data, loading, error } = useTeamDetails();
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Erro ao carregar dados.</Typography>;
    const team: Team | null = data?.teams?.[0] ?? null;
    const totalStats = team?.stats?.[selectedSeason] ?? null;
    const chartOptions = { responsive: true, maintainAspectRatio: false };

    const barData = {
        labels: ["Vitórias", "Derrotas"],
        datasets: [
          {label: "Todos os Jogos", data: [totalStats?.wins ?? 0, totalStats?.losses ?? 0], backgroundColor: ["green", "red"],},
        ],
      };
      const groupedBarData = {
        labels: ["Casa", "Fora"],
        datasets: [
          {label: "Vitórias", data: [totalStats?.winsHome ?? 0, totalStats?.winsRoad ?? 0], backgroundColor: ["green", "blue"],},
          {label: "Derrotas", data: [totalStats?.lossesHome ?? 0, totalStats?.lossesRoad ?? 0], backgroundColor: ["red", "#784008"],},],
      };
      const pieData = {
        labels: ["Vitórias Casa", "Vitórias Fora", "Derrotas Casa", "Derrotas Fora"],
        datasets: [
          {
            label: "Distribuição", data: [ totalStats?.winsHome ?? 0, totalStats?.winsRoad ?? 0, totalStats?.lossesHome ?? 0, totalStats?.lossesRoad ?? 0, ], backgroundColor: ["green", "blue", "red", "brown"],
          },
        ],
      };
      const radarData = {
        labels: [ "Pontos Casa", "Pontos Sofridos Casa", "Pontos Fora", "Pontos Sofridos Fora", ],
        datasets: [
          {
            label: "Média de Pontos",
            data: [  totalStats?.scorePerGame ?? 0, totalStats?.lossesHome ?? 0, totalStats?.winsRoad ?? 0, totalStats?.lossesRoad ?? 0, ],
            borderColor: "rgba(255, 255, 255, 1)", backgroundColor: "rgba(255, 255, 255, 0.2)", pointBackgroundColor: "rgba(255, 255, 255, 1)", pointBorderColor: "black", },
        ],
      };
    
      const stackedBarDataJogos = {
        labels: team?.games?.map((game) => new Date(game.date).toLocaleDateString("pt-BR")) ?? [],
        datasets: [
          {
            label: "Pontos do Time",
            data: team?.games?.map((game) => game.teamScore) ?? [],
            backgroundColor: team?.games?.map(() => "green") ?? [], 
          },
          {
            label: "Pontos do Adversário",
            data: team?.games?.map((game) => game.opponentScore) ?? [],
            backgroundColor: team?.games?.map(() => "red") ?? [], 
          },
        ],
      }; 
      
      const radarDataDefesa = {
        labels: ["Roubos de Bola", "Rebotes Defensivos", "Tocos", "Erros", "Faltas"],
        datasets: [
          {
            label: "Estatísticas Defensivas",
            data: [
              totalStats?.steals ?? 0,
              totalStats?.defensiveRebounds ?? 0,
              totalStats?.blocksPerGame ?? 0,
              totalStats?.turnoversPerGame ?? 0,
              totalStats?.foulsPerGame ?? 0,
            ],
            borderColor: "rgba(0, 123, 255, 1)", 
            backgroundColor: "rgba(0, 123, 255, 0.2)", 
            pointBackgroundColor: "rgba(0, 123, 255, 1)",
            pointBorderColor: "black",
          },
        ],
      };
      
      const pieDataDefesa = {
        labels: ["Tocos", "Erros", "Faltas"],
        datasets: [
          {
            label: "Distribuição de Defesa",
            data: [
              totalStats?.blocksPerGame ?? 0,
              totalStats?.turnoversPerGame ?? 0,
              totalStats?.foulsPerGame ?? 0,
            ],
            backgroundColor: ["blue", "green", "red",],
          },
        ],
      };
      
      const lineData = {
        labels:
          team?.games?.map((game) => new Date(game.date).toLocaleDateString("pt-BR") ) ?? [], 
          datasets: [
          { label: "Vitórias", data: team?.games?.map((game) => (game.result === "W" ? 1 : 0)) ?? [], borderColor: "green", fill: false, },
          { label: "Derrotas", data: team?.games?.map((game) => (game.result === "L" ? 1 : 0)) ?? [], borderColor: "red", fill: false, }, ],};

      const scatterData = {
        datasets: [
          { label: "Média de Pontos", data: team?.games?.map((game) => ({ x: game.teamScore, y: game.opponentScore, })) ?? [], backgroundColor: "#8884d8",}, ],};
    

  return (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
            <Box sx={{ flex: 1, height: 300 }}> <BarChart data={barData} options={chartOptions} /> </Box>
            <Box sx={{ flex: 1, height: 300 }}> <BarChart data={groupedBarData} options={chartOptions} /> </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, alignItems: "center", }} >
            <Box sx={{ flex: 1, height: 300 }}> <PieChart data={pieData} options={chartOptions} /> </Box>
            <Box sx={{ flex: 1, height: 550 }}> <RadarChart data={radarData} options={chartOptions} /> </Box>
          </Box>
          <Box sx={{ height: 300 }}> <LineChart data={lineData} options={chartOptions} /> </Box>
          <Box sx={{ height: 300 }}> <ScatterChart data={scatterData} options={chartOptions} /> </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, alignItems: "center", }} >
          <Box sx={{ flex: 1, height: 400 }}> <PieChart data={pieDataDefesa } options={chartOptions} /> </Box>
          <Box sx={{ flex: 1, height: 500 }}><RadarChart data={radarDataDefesa} options={chartOptions} /> </Box>

          </Box>
          <Box sx={{ height: 300 }}><BarChart data={stackedBarDataJogos} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} /></Box>
        </>
  );
}
