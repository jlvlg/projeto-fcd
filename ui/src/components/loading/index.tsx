import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingComponent = () => {
  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "black", color: "white", pl: 30 }}>
      <CircularProgress size={80} sx={{ color: "blue" }} />
      <Typography sx={{ mt: 4, fontFamily: "monospace", fontSize: "lg", color: "gray.400" }}>Carregando...</Typography>
    </Box>
  );
};