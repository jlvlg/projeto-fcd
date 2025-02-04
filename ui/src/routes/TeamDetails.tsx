import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTeamDetails } from "hooks/useTeamDetails";
import TeamCharts from "components/teamCharts";
import SeasonSelect from "components/seasonSelect";
import TeamTables from "components/teamTables";
import GamesTable from "components/gamesTable";
import SidebarMenu from "components/menu";

const drawerWidth = 240;

export default function TeamDetailsPage() {
  const { data, loading, error } = useTeamDetails();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(2);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Erro ao carregar dados.</Typography>;

  const team = data?.teams?.[0] ?? null;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SidebarMenu 
        team={team} 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
        drawerWidth={drawerWidth} 
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: `calc(100% - ${drawerWidth}px)`,
          padding: 1,
        }}
      >
        <SeasonSelect selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason} />
        {selectedTab === 0 && <Box sx={{ width: "100%", height: "100%" }}><TeamCharts selectedSeason={selectedSeason} /></Box>}
        {selectedTab === 1 && <Box sx={{ p: 1, width: "100%", height: "100%" }}><TeamTables selectedSeason={selectedSeason} /></Box>}
        {selectedTab === 2 && <Box sx={{ p: 1, width: "100%", height: "100%" }}><GamesTable selectedSeason={selectedSeason} /></Box>}
      </Box>
    </Box>
  );
}