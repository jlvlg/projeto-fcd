import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router";

type Props = {};

const PAGES = ["teams"];

export default function NavBar({}: Props) {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 2 }}>
        <Link to="/">
          <Typography
            variant="h5"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              paddingX: 2,
              paddingY: 0.5,
              border: 1,
            }}
          >
            NBA AI
          </Typography>
        </Link>
        <Box>
          {PAGES.map((page) => (
            <Typography
              variant="h6"
              component={NavLink}
              to={`/${page}`}
              sx={(theme) => ({
                "&.active": { color: theme.palette.action.active },
                "&:hover": { color: theme.palette.grey[400] },
                "&:active": { color: theme.palette.action.active },
                color: "gray",
                transition: "color",
                transitionDuration: "100ms",
              })}
            >
              {page.toUpperCase()}
            </Typography>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
