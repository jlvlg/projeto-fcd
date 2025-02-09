import { Card, Typography } from "@mui/material";
import { Chart as ChartJS } from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import chroma from "chroma-js";
import { Chart } from "react-chartjs-2";

type Props = {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
};

ChartJS.register(MatrixController, MatrixElement);

export default function ConfusionMatrix({
  truePositives,
  falsePositives,
  trueNegatives,
  falseNegatives,
}: Props) {
  return (
    <Card elevation={5} sx={{ padding: 1 }}>
      <Typography variant="h6">
        Acurácia:{" "}
        {Math.round(
          ((trueNegatives + truePositives) /
            (trueNegatives + truePositives + falseNegatives + falsePositives)) *
            100
        )}
        %
      </Typography>
      <Chart
        type="matrix"
        data={{
          datasets: [
            {
              data: [
                { x: "Falso", y: "Falso", v: trueNegatives },
                { x: "Falso", y: "Verdadeiro", v: falseNegatives },
                { x: "Verdadeiro", y: "Falso", v: falsePositives },
                { x: "Verdadeiro", y: "Verdadeiro", v: truePositives },
              ],
              backgroundColor(context) {
                const value = (
                  context.dataset.data[context.dataIndex] as unknown as {
                    v: number;
                  }
                ).v;
                const alpha =
                  value /
                  Math.max(
                    trueNegatives,
                    falseNegatives,
                    falsePositives,
                    truePositives
                  );
                return chroma("green").alpha(alpha).hex();
              },
              borderColor: "white",
              borderWidth: 1,
              width: ({ chart }) => chart.chartArea?.width / 2,
              height: ({ chart }) => chart.chartArea?.height / 2,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label(context) {
                  const v = context.dataset.data[
                    context.dataIndex
                  ] as unknown as { x: string; y: string; v: number };
                  return [
                    "Predição: " + v.x,
                    "Real: " + v.y,
                    "Quantidade: " + v.v,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              type: "category",
              title: {
                display: true,
                text: "Predição",
              },
              labels: ["Falso", "Verdadeiro"],
              offset: true,
              ticks: {
                display: true,
              },
              grid: {
                display: false,
              },
            },
            y: {
              type: "category",
              title: {
                display: true,
                text: "Real",
              },
              labels: ["Verdadeiro", "Falso"],
              offset: true,
              ticks: {
                display: true,
              },
              grid: {
                display: false,
              },
            },
          },
        }}
      ></Chart>
    </Card>
  );
}
