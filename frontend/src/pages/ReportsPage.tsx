import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reportsApi, SavedReport } from "../services/reportsApi";

function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      if (token) {
        const data = await reportsApi.getReports(token);
        setReports(data);
      } else {
        // For demo, show empty state without token
        setReports([]);
      }
    } catch (err) {
      // API might not be implemented yet, show empty state
      console.log("Reports API not available yet:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await reportsApi.deleteReport(id, token);
        setReports(reports.filter((r) => r.id !== id));
      }
    } catch (err) {
      setError("Failed to delete report");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>MY REPORTS</h1>
        <Link to="/reports/add" style={styles.addButton}>
          Add Report +
        </Link>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading reports...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📋</div>
          <h2 style={styles.emptyTitle}>No Reports Yet</h2>
          <p style={styles.emptyText}>
            Upload your medical prescriptions to extract and translate important
            information.
          </p>
          <Link to="/reports/add" style={styles.emptyAddButton}>
            Add Your First Report
          </Link>
        </div>
      ) : (
        <div style={styles.reportsList}>
          {reports.map((report) => (
            <div key={report.id} style={styles.reportCard}>
              <div style={styles.reportHeader}>
                <div style={styles.reportInfo}>
                  <h3 style={styles.reportTitle}>
                    {report.disease_name || "Medical Report"}
                  </h3>
                  {report.disease_icd_code && (
                    <span style={styles.icdBadge}>
                      ICD: {report.disease_icd_code}
                    </span>
                  )}
                </div>
                <span style={styles.reportDate}>
                  {formatDate(report.created_at)}
                </span>
              </div>

              {report.medicine_name && (
                <p style={styles.medicineName}>
                  <strong>Medicine:</strong> {report.medicine_name}
                </p>
              )}

              {report.full_description && (
                <p style={styles.reportDescription}>
                  {report.full_description.slice(0, 150)}
                  {report.full_description.length > 150 && "..."}
                </p>
              )}

              <div style={styles.reportActions}>
                <Link to={`/reports/${report.id}`} style={styles.viewButton}>
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(report.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    minHeight: "80vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  loadingText: {
    color: "#666",
    fontSize: "1rem",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: "1rem",
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    textAlign: "center",
    padding: "40px",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#666",
    fontSize: "1rem",
    maxWidth: "400px",
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  emptyAddButton: {
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
  },
  reportsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  reportCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid #eee",
  },
  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  reportInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  reportTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  icdBadge: {
    backgroundColor: "#e8f5e9",
    color: "#2E7D32",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  reportDate: {
    color: "#888",
    fontSize: "0.85rem",
  },
  medicineName: {
    color: "#444",
    fontSize: "0.95rem",
    marginBottom: "8px",
  },
  reportDescription: {
    color: "#666",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    marginBottom: "16px",
  },
  reportActions: {
    display: "flex",
    gap: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #eee",
  },
  viewButton: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: "8px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "transparent",
    color: "#e74c3c",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e74c3c",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
};

export default ReportsPage;
