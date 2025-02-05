import Plot from "react-plotly.js";

type BoxPlotProps = {
  points: number[];
  rebounds: number[];
  assists: number[];
};

export function BoxPlot({ points, rebounds, assists }: BoxPlotProps) {
  return (
    <Plot
      data={[
        {
          y: points,
          type: "box",
          name: "Pontos",
          marker: { color: "#90caf9" },
          boxmean: true, 
        },
        {
          y: rebounds,
          type: "box",
          name: "Rebotes",
          marker: { color: "#66bb6a" },
          boxmean: true,
        },
        {
          y: assists,
          type: "box",
          name: "Assistências",
          marker: { color: "#ffa726" },
          boxmean: true,
        },
      ]}
      layout={{
        title: "Distribuição de Pontos, Rebotes e Assistências",
        yaxis: { title: "Valores", zeroline: false },
        xaxis: { title: "Categorias" },
        paper_bgcolor: "#121212",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" },
      }}
      style={{ width: "100%", height: "400px" }}
      config={{ responsive: true }}
    />
  );
}
