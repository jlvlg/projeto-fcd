import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

type SeasonSelectProps = {
  selectedSeason: number;
  setSelectedSeason: (season: number) => void;
};

export default function SeasonSelect({ selectedSeason, setSelectedSeason }: SeasonSelectProps) {
  return (
    <FormControl fullWidth variant="outlined" sx={{ minWidth: 200 }}>
      <InputLabel>Temporada</InputLabel>
      <Select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(Number(e.target.value))}
        label="Temporada"
      >
        <MenuItem value={2}>Todas (total)</MenuItem>
        <MenuItem value={0}>Temporada 2023/2024</MenuItem>
        <MenuItem value={1}>Temporada 2024/2025</MenuItem>
      </Select>
    </FormControl>
  );
}