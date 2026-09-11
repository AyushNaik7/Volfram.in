import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  steamFlowRate: "8000",
  inletPressure: "10",
  inletTemperature: "184.123",
  outletPressure: "6",
  requiredOutletTemperature: "165",
  waterTemperature: "105",
  waterPressure: "10",
  outletSuperheatedTemperature: "221",
  inletVelocity: "9.6",
  prsOutletVelocity: "19.23",
  desuperheaterOutletVelocity: "17.15",
  waterInjectionVelocity: "1.5",
};

const fields = [
  ["steamFlowRate", "Steam Flow Rate (kg/hr)"],
  ["inletPressure", "Inlet Steam Pressure (bar(g))"],
  ["inletTemperature", "Inlet Steam Temperature (°C)"],
  ["outletPressure", "Outlet Steam Pressure (bar(g))"],
  ["requiredOutletTemperature", "Required Outlet Temperature (°C)"],
  ["waterTemperature", "Water Temperature (°C)"],
  ["waterPressure", "Water Pressure (bar(g))"],
  ["outletSuperheatedTemperature", "Outlet Superheated Temperature (°C)"],
  ["inletVelocity", "Inlet Steam Velocity (m/s)"],
  ["prsOutletVelocity", "PRS Outlet Velocity (m/s)"],
  ["desuperheaterOutletVelocity", "De-superheater Outlet Velocity (m/s)"],
  ["waterInjectionVelocity", "Water Injection Velocity (m/s)"],
];

function PRDSCalculator() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const base = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";
      const response = await fetch(`${base}/api/calculators/prds`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Number(value)]))) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Calculation failed");
      setResult(data.data);
    } catch (calculationError) { setError(calculationError.message); }
    finally { setLoading(false); }
  };
  return <main style={styles.page}>
    <button style={styles.back} onClick={() => navigate("/admin")}>← Back to Calculators</button>
    <h1 style={styles.title}>PRDS / De-superheating Station Calculator</h1>
    <p style={styles.subtitle}>Calculate steam heat balance, water injection, and line sizes from the reference calculation flow.</p>
    <div style={styles.grid}>
      <form style={styles.card} onSubmit={submit}><h2 style={styles.heading}>PRDS Inputs</h2>{fields.map(([name, label]) => <label key={name} style={styles.field}>{label}<input type="number" step="any" min="0" required name={name} value={form[name]} onChange={update} style={styles.input} /></label>)}<button style={styles.calculate} disabled={loading}>{loading ? "Calculating..." : "Calculate PRDS"}</button>{error && <p style={styles.error}>{error}</p>}</form>
      <section style={styles.card}><h2 style={styles.heading}>Calculation Results</h2>{!result && !error && <p style={styles.muted}>Enter the values and click Calculate.</p>}{result && <><h3>Steam Properties</h3><Result label="Inlet Enthalpy" value={result.steamProperties.inlet.enthalpyKcalKg.toFixed(3)} unit="kcal/kg" /><Result label="PRS Outlet Enthalpy" value={result.steamProperties.prsOutlet.enthalpyKcalKg.toFixed(3)} unit="kcal/kg" /><Result label="Required Outlet Enthalpy" value={result.steamProperties.requiredOutlet.enthalpyKcalKg.toFixed(3)} unit="kcal/kg" /><h3>Heat Balance</h3><Result label="Required Water Quantity" value={result.calculationSteps.requiredWaterQuantity.value.toFixed(3)} unit="kg/hr" /><h3>Calculated Line Sizes</h3>{Object.entries(result.pipeSizing).map(([key, value]) => <Result key={key} label={key} value={value.value.toFixed(3)} unit={value.unit} />)}</>}</section>
    </div>
  </main>;
}
function Result({ label, value, unit }) { return <div style={styles.result}><span>{label}</span><strong>{value} {unit}</strong></div>; }
const styles = { page: { padding: 28, minHeight: "100vh", background: "#f1f5f8", color: "#16324a" }, back: { background: "#12324d", color: "#fff", border: 0, borderRadius: 4, padding: "10px 16px" }, title: { margin: "24px 0 6px", fontSize: 28 }, subtitle: { color: "#607487" }, grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18, marginTop: 24 }, card: { background: "#fff", border: "1px solid #d4dde4", borderRadius: 8, padding: 24 }, heading: { marginTop: 0 }, field: { display: "grid", gap: 7, margin: "14px 0", fontWeight: 600, fontSize: 14 }, input: { padding: 10, border: "1px solid #bcc9d3", borderRadius: 4 }, calculate: { marginTop: 14, background: "#d9782b", color: "#fff", border: 0, borderRadius: 4, padding: "11px 20px" }, result: { display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "1px solid #dbe3e8", padding: "12px 0" }, muted: { color: "#71808d" }, error: { color: "#a33d3d", background: "#fde7e7", padding: 12, borderRadius: 4 } };
export default PRDSCalculator;

