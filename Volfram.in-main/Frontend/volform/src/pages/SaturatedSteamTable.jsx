import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SaturatedSteamTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";
    fetch(`${base}/api/calculators/saturated-steam-table`)
      .then((response) => response.json())
      .then((data) => { if (!data.success) throw new Error("Unable to load steam table"); setRows(data.data); })
      .catch((loadError) => setError(loadError.message));
  }, []);
  const visible = rows.filter((row) => String(row.pressure).includes(filter));
  return <main style={styles.page}>
    <button style={styles.back} onClick={() => navigate("/admin")}>← Back to Calculators</button>
    <h1 style={styles.title}>Saturated Steam Table</h1>
    <p style={styles.subtitle}>Reference values loaded directly from the Excel Sheet4 dataset.</p>
    <input type="number" step="any" min="0" placeholder="Filter gauge pressure" value={filter} onChange={(event) => setFilter(event.target.value)} style={styles.filter} />
    {error && <p style={styles.error}>{error}</p>}
    <div style={styles.card}><div style={styles.tableWrap}><table style={styles.table}><thead><tr>{["Gauge Pressure (bar(g))", "Boiling Point (°C)", "Specific Volume (m³/kg)", "Density (kg/m³)", "Sensible Heat (kcal/kg)", "Latent Heat (kcal/kg)", "Total Heat (kcal/kg)"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{visible.map((row) => <tr key={row.pressure}>{[row.pressure, row.temperature, row.specificVolume, row.density, row.sensibleHeat, row.latentHeat, row.totalHeat].map((value, index) => <td key={`${row.pressure}-${index}`}>{value}</td>)}</tr>)}</tbody></table></div></div>
  </main>;
}
const styles = { page: { padding: 28, minHeight: "100vh", background: "#f1f5f8", color: "#16324a" }, back: { background: "#12324d", color: "#fff", border: 0, borderRadius: 4, padding: "10px 16px" }, title: { margin: "24px 0 6px", fontSize: 28 }, subtitle: { color: "#607487" }, filter: { padding: 11, border: "1px solid #bcc9d3", borderRadius: 4, margin: "16px 0", width: 260 }, card: { background: "#fff", border: "1px solid #d4dde4", borderRadius: 8, padding: 16 }, tableWrap: { overflow: "auto", maxHeight: "70vh" }, table: { borderCollapse: "collapse", width: "100%", minWidth: 900 }, error: { color: "#a33d3d", background: "#fde7e7", padding: 12 } };
export default SaturatedSteamTable;

