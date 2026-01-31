import { Outlet } from "react-router-dom";
import Navigation from "./Navigation.tsx";

function Layout() {
  return (
    <div style={styles.container}>
      <Navigation />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    padding: "24px",
    backgroundColor: "#f5f5f5",
  },
};

export default Layout;
