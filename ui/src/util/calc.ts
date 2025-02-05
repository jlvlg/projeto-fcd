export const calculateMedian = (data: number[]) => {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  
  export const calculateMode = (data: number[]) => {
    const frequency: Record<number, number> = {};
    data.forEach((num) => (frequency[num] = (frequency[num] || 0) + 1));
    const maxFrequency = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter((key) => frequency[Number(key)] === maxFrequency)
      .map(Number);
  };
  
  export const calculateStandardDeviation = (data: number[]) => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squaredDiffs = data.map((value) => Math.pow(value - mean, 2));
    const meanSquareDiff = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(meanSquareDiff);
  };