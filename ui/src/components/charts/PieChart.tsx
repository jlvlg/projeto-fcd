import { Pie } from "react-chartjs-2";

interface PieChartProps {
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

export default function PieChart({ data, options }: PieChartProps) {
  return <Pie data={data} options={options} />;
}
