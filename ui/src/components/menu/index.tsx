import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Team } from "types/Types";

interface SidebarMenuProps {
    team: Team | null;
    selectedTab: number;
    setSelectedTab: (index: number) => void;
    drawerWidth: number;
  }
const SidebarMenu = ({ team, selectedTab, setSelectedTab, drawerWidth }: SidebarMenuProps) => {
  const menuItems = ["Gráficos", "Tabelas", "Jogos"];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        top: "64px",
        height: "calc(100vh - 64px)",
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", top: "64px", height: "calc(100vh - 64px)" },
      }}
    >
      <Box sx={{ p: 2, bgcolor: "background.paper", height: "100%" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center", mb: 2 }}>
          {team?.full_name}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center", mb: 2 }}>
          Conferência: {team?.conference}
        </Typography>
        <List>
          {menuItems.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton selected={selectedTab === index} onClick={() => setSelectedTab(index)}>
                <ListItemText primary={text} sx={{ textAlign: "center" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarMenu;
