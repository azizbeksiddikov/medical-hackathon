import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/hospitals", label: "Hospitals" },
  { path: "/reports", label: "Reports" },
  { path: "/profile", label: "Profile" },
  { path: "/onboarding", label: "Onboarding" },
  { path: "/login", label: "Login" },
];

function Navigation() {
  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>ASCENT</div>
      <ul style={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    padding: "16px 24px",
    backgroundColor: "#1a1a2e",
    color: "white",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: 700,
  },
  navList: {
    display: "flex",
    gap: "8px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    display: "block",
    padding: "8px 16px",
    color: "rgba(255, 255, 255, 0.7)",
    textDecoration: "none",
    borderRadius: "4px",
    transition: "background-color 0.2s, color 0.2s",
  },
  navLinkActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
};

export default Navigation;
