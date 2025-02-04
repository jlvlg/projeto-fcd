import { Line } from "react-chartjs-2";

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor?: string;
      fill?: boolean;
    }[];
  };
  options?: Record<string, unknown>;
}

export default function LineChart({ data, options }: LineChartProps) {
  return <Line data={data} options={options} />;
}
