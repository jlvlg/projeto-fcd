import { useQuery } from "@apollo/client";
import { Box, Card, Tab, Tabs, TextField, Typography } from "@mui/material";
import { LoadingComponent } from "components/loading";
import * as _ from "lodash-es";
import { GET_REGRESSION_PLAYER } from "queries/getRegressionPlayer";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import RegressionCard from "./components/regressionCard";

export enum RegressionMode {
  LINEAR,
  LOGISTIC,
  GAMLINEAR,
  GAMPOISSON,
}
type Props = { mode: RegressionMode };

export default function RegressionVisualization({ mode }: Props) {
  const { id, playerid } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [x, setX] = useState(0);
  const [xTemp, setXTemp] = useState(x);
  const column = ["score", "assists", "rebounds"][tabIndex];
  const { data, loading, error } = useQuery(GET_REGRESSION_PLAYER, {
    variables: {
      teamId: Number(id),
      playerId: Number(playerid),
      column,
      isLinear: mode === RegressionMode.LINEAR,
      isLogistic: mode === RegressionMode.LOGISTIC,
      isGAMLinear: mode === RegressionMode.GAMLINEAR,
      isGAMPoisson: mode === RegressionMode.GAMPOISSON,
      x,
    },
  });
  const team = data?.teams[0];
  const player = team?.players[0];
  const ai = player?.ai;
  const stats = player?.stats;

  const regression = useMemo(() => {
    const regression = _.omit(
      ai?.linearRegression ??
        ai?.logisticRegression ??
        ai?.linearGAM?.regression ??
        ai?.poissonGAM?.regression,
      ["__typename"]
    );
    return Object.fromEntries(
      Object.entries(regression).map(([key, value]) => {
        const fieldPieces = key.split(/(?=[A-Z])/);
        let label =
          fieldPieces[0] === "greater" ? "maior que" : "menor ou igual a";
        switch (fieldPieces.at(-1)) {
          case "Mean":
            label += " média";
            break;
          case "Median":
            label += " mediana";
            break;
          case "Mode":
            label += " moda";
            break;
          case "Max":
            label += " máximo";
            break;
          case "Min":
            label += " mínimo";
            break;
        }
        const stat = (stats?.at(-1) as unknown as { [key: string]: number })[
          fieldPieces.at(-1)?.toLowerCase() +
            column[0].toUpperCase() +
            column.slice(1)
        ];
        return [
          key,
          {
            ...value,
            x: stat,
            label,
          },
        ];
      })
    );
  }, [ai, stats, column]);

  const probX =
    (mode === RegressionMode.GAMLINEAR
      ? ai?.linearGAM?.probability
      : ai?.poissonGAM?.probability) ?? 0;

  useEffect(() => {
    const timer = setTimeout(() => setX(xTemp), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [xTemp]);

  if (loading) return <LoadingComponent />;
  if (error)
    return <Typography color="error">Erro: {error.message}</Typography>;

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
          Jogador: {player?.name} | Time: {team?.full_name}
        </Typography>
      </Card>
      <Typography variant="body2" fontSize="0.875rem" color="textSecondary">
        Visualização das probabilidades de eventos com base em regressão,
        analisando a ocorrência de valores acima, abaixo, ou iguais a
        determinados pontos de referência, como pontos, rebotes e assistências.
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(_, value) => setTabIndex(value)}
        textColor="secondary"
        indicatorColor="secondary"
        centered
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Pontos" />
        <Tab label="Assistências" />
        <Tab label="Rebotes" />
      </Tabs>
      {(mode === RegressionMode.GAMLINEAR ||
        mode === RegressionMode.GAMPOISSON) && (
        <Card
          sx={{
            padding: 2,
            backgroundColor: "#1e1e1e",
            marginBottom: 3,
            borderRadius: 2,
            boxShadow: 3,
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h6">Probabilidade de um valor X:</Typography>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={xTemp}
              onChange={(e) => setXTemp(Number(e.target.value))}
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                backgroundColor: "#333",
                borderRadius: 1,
              }}
            />
            <Typography variant="h4">{Math.round(probX * 100)}%</Typography>
          </Box>
        </Card>
      )}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {Object.entries(regression ?? {}).map(([key, value]) => (
          <RegressionCard key={key} airesult={value} />
        ))}
      </Box>
    </Box>
  );
}
