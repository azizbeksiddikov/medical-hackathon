import { Outlet } from "react-router-dom";
import Navigation from "./Navigation.tsx";

function Layout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navigation />
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
