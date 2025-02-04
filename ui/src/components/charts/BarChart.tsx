import { Bar } from "react-chartjs-2";

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  options?: Record<string, unknown>;
}

export default function BarChart({ data, options }: BarChartProps) {
  return <Bar data={data} options={options} />;
}
