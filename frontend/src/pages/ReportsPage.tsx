function ReportsPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>This is Reports page</h1>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  title: {
    fontSize: "2rem",
    color: "#1a1a2e",
  },
};

export default ReportsPage;
