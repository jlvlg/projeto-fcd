import { Home } from "@mui/icons-material";
import { AppBar, Toolbar } from "@mui/material";
import { Outlet } from "react-router";

type Props = {};

export default function App({}: Props) {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Home />
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
