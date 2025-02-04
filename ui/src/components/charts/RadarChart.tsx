import { Radar } from "react-chartjs-2";

interface RadarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      pointBackgroundColor?: string;
      pointBorderColor?: string;
    }[];
  };
  options?: Record<string, unknown>;
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      grid: { color: "rgba(255, 255, 255, 0.2)" }, 
      angleLines: { color: "rgba(255, 255, 255, 0.5)" }, 
      ticks: { color: "black" }, 
    },
  },
  plugins: {
    legend: { labels: { color: "white" } }, 
  },
};

export default function RadarChart({ data, options }: RadarChartProps) {
  return <Radar data={data} options={{ ...defaultOptions, ...options }} />;
}
