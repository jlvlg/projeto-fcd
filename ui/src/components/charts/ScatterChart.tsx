import { Scatter } from "react-chartjs-2";

interface ScatterChartProps {
  data: {
    datasets: {
      label: string;
      data: { x: number; y: number }[];
      backgroundColor?: string;
    }[];
  };
  options?: Record<string, unknown>;
}

export default function ScatterChart({ data, options }: ScatterChartProps) {
  return <Scatter data={data} options={options} />;
}
