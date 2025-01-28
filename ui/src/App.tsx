import { Box } from "@mui/material";
import NavBar from "components/navbar";
import { Outlet } from "react-router";

type Props = {};

export default function App({}: Props) {
  return (
    <>
      <NavBar />
      <Box sx={{ padding: 5 }}>
        <Outlet />
      </Box>
    </>
  );
}
