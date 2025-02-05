import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type DistributionChartProps = {
  label: string; 
  data: number[]; 
  mean: number; 
  median: number; 
  mode: number[]; 
};

export function DistributionChart({ label, data, mean, median, mode }: DistributionChartProps) {
  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => `Jogo ${i + 1}`),
    datasets: [
      {
        label,
        data,
        borderColor: "#90caf9",
        backgroundColor: "rgba(144, 202, 249, 0.5)",
        fill: true,
      },
      {
        label: `Média de ${label}`,
        data: Array(data.length).fill(mean),
        borderColor: "#66bb6a",
        borderDash: [10, 5],
      },
      {
        label: `Mediana de ${label}`,
        data: Array(data.length).fill(median),
        borderColor: "#ffa726",
        borderDash: [10, 5],
      },
      {
        label: `Moda de ${label}`,
        data: Array(data.length).fill(mode[0] || 0),
        borderColor: "#ef5350",
        borderDash: [10, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Jogos", color: "#e0e0e0" },
        ticks: { color: "#e0e0e0" },
      },
      y: {
        title: { display: true, text: "Valores", color: "#e0e0e0" },
        ticks: { color: "#e0e0e0" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
