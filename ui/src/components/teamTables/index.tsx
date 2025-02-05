import { Box, Typography,CircularProgress } from "@mui/material";
import Table from "components/table/index";
import { useTeamDetails } from "hooks/useTeamDetails";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transpose(matrix: any[][]): any[][] {
    if (!matrix.length) return [];
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export default function TeamTables({selectedSeason}:{selectedSeason: number}){
    const { data, loading, error } = useTeamDetails();
    const team = data?.teams?.[0] ?? null;
    const totalStats = team?.stats?.[selectedSeason] ?? null;
    
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Erro ao carregar dados.</Typography>;

    const TABLE_HEADERS = [
        ["Resultados do Time", "Total de Vitórias", "Vitórias Casa", "Vitórias Fora", "Total de Derrotas", "Derrotas Casa", "Derrotas Fora"],
        ["Total de Dados", "Pontos por Jogo", "Assistências", "Rebotes", "Cestas de 3 pontos", "Derrotas Casa", "Derrotas Fora"],
        ["Rebotes", "Total de rebotes", "Ofensivos", "Defensivos", "Pontos Totais", "Cestas 2 Pontos", "Cestas 3 pontos", "Lances Livres"],
        ["Defesa", "Roubos de bola", "Rebotes Defensivos", "Tocos", "Erros", "Faltas"],
        ["Jogos", "Data", "Adversário", "Resultado", "Local", "Placar"],
      ];
    
      const columns = [
        ["Resultados do Time", totalStats?.wins ?? 0, totalStats?.winsHome ?? 0, totalStats?.winsRoad ?? 0, totalStats?.losses ?? 0, totalStats?.lossesHome ?? 0, totalStats?.lossesRoad ?? 0],
        ["Total de Dados", totalStats?.scorePerGame?.toFixed(2) ?? "0.00", totalStats?.assistsPerGame?.toFixed(2) ?? "0.00", totalStats?.reboundsPerGame?.toFixed(2) ?? "0.00", totalStats?.threePointFieldGoals?.toFixed(2) ?? "0.00", totalStats?.lossesHome ?? 0, totalStats?.lossesRoad ?? 0],
        ["Rebotes", totalStats?.rebounds?.toFixed(2) ?? "0.00", totalStats?.offensiveRebounds?.toFixed(2) ?? "0.00", totalStats?.defensiveRebounds?.toFixed(2) ?? "0.00", totalStats?.scorePerGame?.toFixed(2) ?? "0.00", totalStats?.twoPointFieldGoals?.toFixed(2) ?? "0.00", totalStats?.threePointFieldGoals?.toFixed(2) ?? "0.00", totalStats?.freeThrows?.toFixed(2) ?? "0.00"],
        ["Defesa", totalStats?.steals?.toFixed(2) ?? "0.00", totalStats?.defensiveRebounds?.toFixed(2) ?? "0.00", totalStats?.blocksPerGame?.toFixed(2) ?? "0.00", totalStats?.turnoversPerGame?.toFixed(2) ?? "0.00", totalStats?.foulsPerGame?.toFixed(2) ?? "0.00"],
      ];
    
    return(
        <div>
      {TABLE_HEADERS.slice(0, 4).map((header, i) => {
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
        </div>
    )
}

