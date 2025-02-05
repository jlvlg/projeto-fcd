import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTeamDetails } from "hooks/useTeamDetails";
import TeamCharts from "components/teamCharts";
import SeasonSelect from "components/seasonSelect";
import TeamTables from "components/teamTables";
import GamesTable from "components/gamesTable";
import SidebarMenu from "components/menu";
import TeamPlayersTable from "components/teamPlayers";

const drawerWidth = 240;

export default function TeamDetailsPage() {
  const { data, loading, error } = useTeamDetails();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(2);
  const menuItems = ["Gráficos", "Tabelas", "Jogos", "Jogadores"];

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Erro ao carregar dados.</Typography>;

  const team = data?.teams?.[0] ?? null;
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SidebarMenu 
        menuItems = {menuItems}
        team={team} 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
        drawerWidth={drawerWidth} 
      />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", width: `calc(100% - ${drawerWidth}px)`, padding: 1, }}>
        {selectedTab < 3 && <SeasonSelect selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason} />}
        <Box sx={{ p: 1, width: "100%", height: "100%" }}>
          {selectedTab === 0 && <TeamCharts selectedSeason={selectedSeason} />}
          {selectedTab === 1 && <TeamTables selectedSeason={selectedSeason} />}
          {selectedTab === 2 && <GamesTable selectedSeason={selectedSeason} />}
          {selectedTab === 3 && <TeamPlayersTable teamId={1610612760}/>}
        </Box>
      </Box>
    </Box>
  );
}