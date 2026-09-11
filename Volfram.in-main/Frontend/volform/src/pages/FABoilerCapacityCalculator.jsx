import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  boilerOperatingPressure: "17",
  boilerCapacity: "12000",
  feedWaterTemperature: "60",
  atmosphericLatentHeat: "540",
};

function FABoilerCapacityCalculator() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const calculate = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/calculators/fa-boiler-capacity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(form).map(([key, value]) => [key, Number(value)])
          )
        ),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Calculation failed");
      setResult(data.data);
    } catch (calculationError) {
      setError(calculationError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <button style={styles.back} onClick={() => navigate("/admin")}>← Back to Calculators</button>
      <h1 style={styles.title}>F&amp;A Boiler Capacity Calculator</h1>
      <p style={styles.subtitle}>Calculate net steam delivery from the From-and-At boiler rating.</p>
      <div style={styles.grid}>
        <form style={styles.card} onSubmit={calculate}>
          <h2 style={styles.heading}>Input Values</h2>
          <Field label="Boiler Operating Pressure (bar(g))" name="boilerOperatingPressure" value={form.boilerOperatingPressure} onChange={handleChange} />
          <Field label="Boiler Capacity (kg/hr)" name="boilerCapacity" value={form.boilerCapacity} onChange={handleChange} />
          <Field label="Feed Water Temperature (°C)" name="feedWaterTemperature" value={form.feedWaterTemperature} onChange={handleChange} />
          <Field label="Latent Heat at Atmospheric Pressure (kcal/kg)" name="atmosphericLatentHeat" value={form.atmosphericLatentHeat} onChange={handleChange} />
          <div style={styles.actions}>
            <button style={styles.calculate} disabled={loading}>{loading ? "Calculating..." : "Calculate"}</button>
            <button type="button" style={styles.reset} onClick={() => { setForm(initialForm); setResult(null); setError(""); }}>Reset</button>
          </div>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <section style={styles.card}>
          <h2 style={styles.heading}>Calculation Result</h2>
          {!result && !error && <p style={styles.muted}>Enter the values and click Calculate.</p>}
          {result && (
            <>
              <Result label="Total Heat in Steam" value={result.steamProperties.totalHeat.value} unit={result.steamProperties.totalHeat.unit} />
              <Result label="F&A Difference × Boiler Capacity" value={result.calculationSteps.capacityDifference.value.toFixed(5)} unit={result.calculationSteps.capacityDifference.unit} />
              <div style={styles.result}><span>Net Steam Delivery</span><strong>{result.result.netSteamDelivery.value.toFixed(5)} {result.result.netSteamDelivery.unit}</strong></div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, name, value, onChange }) {
  return <label style={styles.field}>{label}<input type="number" step="any" min="0" required name={name} value={value} onChange={onChange} style={styles.input} /></label>;
}

function Result({ label, value, unit }) {
  return <div style={styles.result}><span>{label}</span><strong>{value} {unit}</strong></div>;
}

const styles = {
  page: { padding: "28px", minHeight: "100vh", background: "#f1f5f8", color: "#16324a" },
  back: { background: "#12324d", color: "#fff", border: 0, borderRadius: 4, padding: "10px 16px", cursor: "pointer" },
  title: { margin: "24px 0 6px", fontSize: 28 },
  subtitle: { color: "#607487" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginTop: 24 },
  card: { background: "#fff", border: "1px solid #d4dde4", borderRadius: 8, padding: 24 },
  heading: { fontSize: 18, marginTop: 0 },
  field: { display: "grid", gap: 7, margin: "18px 0", fontWeight: 600, fontSize: 14 },
  input: { padding: 11, border: "1px solid #bcc9d3", borderRadius: 4, fontSize: 15 },
  actions: { display: "flex", gap: 10, marginTop: 22 },
  calculate: { background: "#d9782b", color: "#fff", border: 0, borderRadius: 4, padding: "11px 20px", cursor: "pointer" },
  reset: { background: "#fff", color: "#16324a", border: "1px solid #16324a", borderRadius: 4, padding: "11px 20px", cursor: "pointer" },
  result: { display: "flex", justifyContent: "space-between", gap: 20, borderBottom: "1px solid #dbe3e8", padding: "16px 0" },
  muted: { color: "#71808d" },
  error: { color: "#a33d3d", background: "#fde7e7", padding: 12, borderRadius: 4 },
};

export default FABoilerCapacityCalculator;

