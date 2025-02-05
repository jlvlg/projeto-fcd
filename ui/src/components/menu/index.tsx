import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Player, Team } from "__generated__/graphql";
import { useNavigate } from "react-router-dom";

interface SidebarMenuProps {
  team?: Partial<Team> | null;
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  drawerWidth: number;
  menuItems: string[];
  player?: Partial<Player>;
  backButtonPath?: string;
}

const SidebarMenu = ({
  team,
  selectedTab,
  setSelectedTab,
  drawerWidth,
  menuItems,
  player,
  backButtonPath,
}: SidebarMenuProps) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        top: "64px",
        height: "calc(100vh - 64px)",
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          top: "64px",
          height: "calc(100vh - 64px)",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {backButtonPath && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(backButtonPath)}
            sx={{ mb: 2, textTransform: "none", alignSelf: "center" }}
          >
            Voltar
          </Button>
        )}

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
            mb: 2,
          }}
        >
          {player?.name}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
            mb: 2,
          }}
        >
          {team?.full_name}
        </Typography>

        {team?.conference && (
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", textAlign: "center", mb: 2 }}
          >
            Conferência: {team.conference}
          </Typography>
        )}

        <List>
          {menuItems.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={selectedTab === index}
                onClick={() => setSelectedTab(index)}
              >
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
