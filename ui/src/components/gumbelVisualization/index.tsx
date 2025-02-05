import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { GET_GUMBLE_DATA } from "queries/getGumbelData";
import { Box, Card, Typography, TextField, Button, Tabs, Tab } from "@mui/material";
import { LoadingComponent } from "components/loading";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

interface Props{
  teamId: number
  playerId: number
  season: string
}

const GumbelVisualization = ({ teamId, playerId, season }: Props) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [hasFetched, setHasFetched] = useState(false);
  const [column, setColumn] = useState("score");
  const [tabIndex, setTabIndex] = useState(0);

  const [fetchData, { loading, error, data }] = useLazyQuery(GET_GUMBLE_DATA);

  useEffect(() => {
    fetchData({ variables: { teamId, playerId, season, start, end, column } });
    setHasFetched(true);
  }, [column]);

  const handleFetchData = () => {
    fetchData({ variables: { teamId, playerId, season, start, end , column} });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const columns = ["score", "assists", "rebounds"];
    setColumn(columns[newValue]);
  };

  if (loading) return <LoadingComponent/>;
  if (error) return <Typography color="error">Erro: {error.message}</Typography>;

  if (!hasFetched) {
    return <Typography>Clique em "Buscar Dados" para carregar as informações</Typography>;
  }

  const player = data?.teams?.[0]?.players?.[0];
  const team = data?.teams[0];
  const gumbelData = player?.ai?.gumbel;

  if (!gumbelData) {
    return <Typography color="warning">Nenhum dado disponível</Typography>;
  }

  const createChartData = (label: string, points: { x: number; y: number }[]) => ({
    labels: points.map((point) => point.x), 
    datasets: [
      {
        label,
        data: points.map((point) => point.y),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const probGreaterThanData = createChartData("Probabilidade Maior Que", gumbelData.probGreaterThan);
  const probLessThanData = createChartData("Probabilidade Menor Que", gumbelData.probLessThan);
  const probGreaterThanOrEqualToData = createChartData("Probabilidade Maior ou Igual a", gumbelData.probGreaterThanOrEqualTo);
  const probLessThanOrEqualToData = createChartData("Probabilidade Menor ou Igual a", gumbelData.probLessThanOrEqualTo);

  return (
    <Box>
      <Typography variant="h6" color="white" sx={{ fontWeight: "bold" }}>
        Análise de Gumbel
      </Typography>

      <Card
        sx={{
          padding: 3,
          backgroundColor: "#1e1e1e",
          marginBottom: 3,
          borderRadius: 2,
          boxShadow: 3,
          mt: 2,
        }}
      >
        <Typography variant="h6" color="white" sx={{ fontWeight: "bold" }}>
          Jogador: {player.name} | Time: {team?.full_name} | Temporada: {season}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}>
          <TextField
            label="Início"
            type="number"
            variant="outlined"
            size="small"
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            sx={{ input: { color: "white" }, label: { color: "white" }, backgroundColor: "#333", borderRadius: 1 }}
          />
          <TextField
            label="Fim"
            type="number"
            variant="outlined"
            size="small"
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
            sx={{ input: { color: "white" }, label: { color: "white" }, backgroundColor: "#333", borderRadius: 1 }}
          />
          <Button variant="contained" color="primary" onClick={handleFetchData}>
            Atualizar Dados
          </Button>
        </Box>
      </Card>
      <Typography variant="body2" fontSize="0.875rem" color="textSecondary">Visualização das probabilidades de eventos com base no método de Gumbel, 
        analisando a ocorrência de valores acima, abaixo, ou iguais a determinados pontos de referência, como pontos, rebotes e assistências. </Typography>


      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        centered
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Pontos" />
        <Tab label="Assistências" />
        <Tab label="Rebotes" />
      </Tabs>

      
      <Box sx={{ Width: "100%", margin: "auto", marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Probabilidade Maior Que
        </Typography>
        <Line data={probGreaterThanData} />
      </Box>

      <Box sx={{ width: "100%", margin: "auto", marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Probabilidade Menor Que
        </Typography>
        <Bar data={probLessThanData} />
      </Box>

      <Box sx={{ width: "100%", margin: "auto", marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Probabilidade Maior ou Igual a
        </Typography>
        <Line data={probGreaterThanOrEqualToData} />
      </Box>

      <Box sx={{ width: "100%", margin: "auto", marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Probabilidade Menor ou Igual a
        </Typography>
        <Bar data={probLessThanOrEqualToData} />
      </Box>
    </Box>
  );
};

export default GumbelVisualization;
