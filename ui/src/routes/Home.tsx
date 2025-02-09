import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { GET_TEAM_PLAYERS } from "queries/getTeamPlayers";
import { useNavigate } from "react-router-dom";

const CHICAGO_BULLS_ID = 1610612741;
const CHICAGO_BULLS_IMAGE =
  "https://c4.wallpaperflare.com/wallpaper/171/7/742/basketball-michael-jordan-chicago-bulls-hd-wallpaper-preview.jpg";

export const Home = () => {
  const navigate = useNavigate();
  const {
    data: playersData,
    loading: loading,
    error: error,
  } = useQuery(GET_TEAM_PLAYERS, {
    variables: { teamIds: [CHICAGO_BULLS_ID] },
  });

  const players = playersData?.teams?.[0]?.players || [];

  return (
    <Box
      sx={{
        textAlign: "center",
        color: "white",
        padding: 4,
        background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)",
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
        Chicago Bulls
      </Typography>
      <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
        Um dos times mais icônicos da NBA, conhecido por sua história vitoriosa
        e por lendas como Michael Jordan.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Card
          sx={{
            flex: 1,
            backgroundColor: "#121212",
            borderRadius: 3,
            boxShadow: 5,
            display: "flex",
            flexDirection: "column",
            height: "500px",
          }}
        >
          <Box sx={{ flex: 1, display: "flex" }}>
            <img
              src={CHICAGO_BULLS_IMAGE}
              alt="Chicago Bulls"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px 10px 0 0",
              }}
            />
          </Box>
          {loading && <CircularProgress color="inherit" />}
          {error && (
            <Typography color="error">Erro ao carregar os dados</Typography>
          )}
        </Card>

        <Card
          sx={{
            flex: 1,
            backgroundColor: "#121212",
            padding: 3,
            borderRadius: 3,
            boxShadow: 5,
            display: "flex",
            flexDirection: "column",
            height: "500px",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Jogadores
          </Typography>
          {loading && <CircularProgress color="inherit" />}
          {error && (
            <Typography color="error">Erro ao carregar os jogadores</Typography>
          )}
          {!loading && !error && (
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <List
                sx={{
                  maxHeight: "100%",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {players.map((player) => (
                  <ListItem
                    key={player.id}
                    component="div"
                    sx={{
                      borderBottom: "1px solid #333",
                      cursor: "pointer",
                      "&:last-child": { borderBottom: "none" },
                    }}
                    onClick={() =>
                      navigate(
                        `/teams/${CHICAGO_BULLS_ID}/${player.id.toString()}`
                      )
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#fff" }}
                        >
                          {player.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: "#bbb" }}>
                          {player.position} | {player.age} anos |{" "}
                          {player.height.toFixed(2)}m |{" "}
                          {player.weight.toFixed(2)}kg
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Card>
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ paddingX: 3, fontSize: "1rem" }}
          onClick={() => navigate(`/teams/${CHICAGO_BULLS_ID}`)}
        >
          Ver Detalhes do Time
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ paddingX: 3, fontSize: "1rem" }}
          onClick={() => navigate("/teams")}
        >
          Escolher Outro Time
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
