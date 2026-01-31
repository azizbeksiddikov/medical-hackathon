import { Link } from "react-router-dom";

function HospitalsPage() {
  // Sample hospital IDs for demonstration
  const sampleHospitalIds = ["1", "2", "3"];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>This is Hospitals page</h1>
      <div style={styles.links}>
        <p style={styles.subtitle}>Sample hospital links:</p>
        {sampleHospitalIds.map((id) => (
          <Link key={id} to={`/hospital/${id}`} style={styles.link}>
            Hospital {id}
          </Link>
        ))}
      </div>
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
  links: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "8px",
  },
  link: {
    color: "#1a1a2e",
    textDecoration: "underline",
  },
};

export default HospitalsPage;
