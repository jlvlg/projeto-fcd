import { useState } from "react";
import { Box, Typography, CircularProgress, Tabs, Tab } from "@mui/material";
import { useTeamDetails } from "hooks/useTeamDetails";
import Table from "components/table/table";
import { Team } from "types/Types";
import TeamCharts from "components/teamCharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transpose(matrix: any[][]): any[][] {
  if (!matrix.length) return [];
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export default function TeamDetailsPage() {
  const { data, loading, error } = useTeamDetails();
  const [selectedTab, setSelectedTab] = useState(0);
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Erro ao carregar dados.</Typography>;
  const team: Team | null = data?.teams?.[0] ?? null;
  const totalStats = team?.stats?.[0] ?? null;

  const TABLE_HEADERS = [
    ["Resultados do Time", "Total de Vitórias", "Vitórias Casa", "Vitórias Fora", "Total de Derrotas", "Derrotas Casa", "Derrotas Fora",],
    ["Total de Dados", "Pontos por Jogo", "Assistências", "Rebotes", "Cestas de 3 pontos", "Derrotas Casa", "Derrotas Fora",],
    ["Rebotes", "Total de rebotes", "Ofensivos", "Defensivos", "Pontos Totais", "Cestas 2 Pontos", "Cestas 3 pontos", "Lances Livres", ],
    ["Defesa", "Roubos de bola", "Rebotes Defensivos", "Tocos", "Erros", "Faltas"],
    ["Jogos", "Data", "Adversário", "Resultado", "Local", "Placar"],
  ];

  const columns = [
    [ "Resultados do Time", totalStats?.wins ?? 0, totalStats?.winsHome ?? 0, totalStats?.winsRoad ?? 0, totalStats?.losses ?? 0, totalStats?.lossesHome ?? 0, totalStats?.lossesRoad ?? 0 ],
    [ "Total de Dados", totalStats?.scorePerGame?.toFixed(2) ?? "0.00", totalStats?.assistsPerGame?.toFixed(2) ?? "0.00", totalStats?.reboundsPerGame?.toFixed(2) ?? "0.00", totalStats?.threePointFieldGoals?.toFixed(2) ?? "0.00", totalStats?.lossesHome ?? 0, totalStats?.lossesRoad ?? 0  ],
    [ "Rebotes", totalStats?.rebounds?.toFixed(2) ?? "0.00", totalStats?.offensiveRebounds?.toFixed(2) ?? "0.00", totalStats?.defensiveRebounds?.toFixed(2) ?? "0.00", totalStats?.scorePerGame?.toFixed(2) ?? "0.00", totalStats?.twoPointFieldGoals?.toFixed(2) ?? "0.00", totalStats?.threePointFieldGoals?.toFixed(2) ?? "0.00", totalStats?.freeThrows?.toFixed(2) ?? "0.00" ],
    [ "Defesa", totalStats?.steals?.toFixed(2) ?? "0.00", totalStats?.defensiveRebounds?.toFixed(2) ?? "0.00", totalStats?.blocksPerGame?.toFixed(2) ?? "0.00", totalStats?.turnoversPerGame?.toFixed(2) ?? "0.00", totalStats?.foulsPerGame?.toFixed(2) ?? "0.00" ],
  ];
  
  const games = team?.games?.map((game) => [ 
    "Jogos", 
    new Date(game.date).toLocaleDateString("pt-BR"),
    game.opponent.full_name, 
    game.result === "W" ? "Vitória" : "Derrota",
    game.location === "home" ? "Casa" : "Fora",
    `${game.teamScore} - ${game.opponentScore}`
  ]) ?? [["Sem jogos disponíveis"]];

    return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h3" sx={{ textAlign: "center", fontWeight: "bold" }}> {team?.full_name} </Typography>
      <Typography variant="h5" sx={{ textAlign: "center" }}> Conferência: {team?.conference} </Typography>

      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} centered >
        <Tab label="Gráficos" />
        <Tab label="Tabelas" />
        <Tab label="Jogos" />
      </Tabs>

      {selectedTab === 0 && ( <TeamCharts/> )}
      {selectedTab === 1 &&
      TABLE_HEADERS.slice(0, 4).map((header, i) => {
        const tableTitle = columns[i][0]; 
        const singleRow = [columns[i].slice(1)]; 
        const transposed = transpose(singleRow);
        return (
          <Box key={i}>
            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mt: 2 }}>
              {tableTitle} 
            </Typography>
            <Table
              headers={header.slice(1).map((h) => ({ label: h }))} 
              columns={transposed}
            />
          </Box>
        );
      })}
      {selectedTab === 2 && (
        <>
          <h3>Jogos das temporadas 2023/2024 e 2024/2025</h3>
          <Table
            headers={TABLE_HEADERS[4].slice(1).map((h) => ({ label: h }))} 
            columns={transpose(games.map(row => row.slice(1)))} 
          />
        </>
      )}
    </Box>
  );
}