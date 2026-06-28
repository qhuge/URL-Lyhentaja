import Background from "./Background.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Background>
      <Outlet />
    </Background>
  );
}