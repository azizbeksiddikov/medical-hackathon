import { useParams, Link } from "react-router-dom";

function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>This is Hospital {id} page</h1>
      <Link to="/hospitals" style={styles.backLink}>
        ← Back to Hospitals
      </Link>
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
  backLink: {
    marginTop: "24px",
    color: "#1a1a2e",
    textDecoration: "underline",
  },
};

export default HospitalDetailPage;
