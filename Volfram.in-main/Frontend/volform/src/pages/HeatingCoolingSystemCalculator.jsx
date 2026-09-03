import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HeatingCoolingSystemCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hotWaterFlowRate: "",
    hotWaterInletTemp: "",
    hotWaterOutletTemp: "",
    steamPressure: "",
    steamVelocity: "",
    hotWaterVelocity: "",

    coolingWaterFlowRate: "",
    coolingWaterInletTemp: "",
    coolingWaterOutletTemp: "",

    chilledWaterInletTemp: "",
    chilledWaterOutletTemp: "",
    coolingWaterVelocity: "",
    chilledWaterVelocity: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const requestData = {};

      Object.keys(formData).forEach((key) => {
        requestData[key] = Number(formData[key]);
      });

      const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000";
      const response = await axios.post(
        `${API_BASE_URL}/api/calculators/heating-cooling-system`,
        requestData
      );

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while calculating."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset Calculator
  const handleReset = () => {
    setFormData({
      hotWaterFlowRate: "",
      hotWaterInletTemp: "",
      hotWaterOutletTemp: "",
      steamPressure: "",
      steamVelocity: "",
      hotWaterVelocity: "",

      coolingWaterFlowRate: "",
      coolingWaterInletTemp: "",
      coolingWaterOutletTemp: "",

      chilledWaterInletTemp: "",
      chilledWaterOutletTemp: "",
      coolingWaterVelocity: "",
      chilledWaterVelocity: "",
    });

    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Heating & Cooling System Calculator
          </h1>

          <p style={styles.subtitle}>
            Calculate steam requirement, chilled water flow,
            and required pipeline sizes.
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Calculators
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.mainGrid}>
          {/* ================= HEATING SYSTEM ================= */}

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              🔥 Heating System
            </h2>

            <p style={styles.sectionDescription}>
              Enter hot water and steam operating conditions.
            </p>

            {/* Hot Water Flow */}

            <div style={styles.field}>
              <label style={styles.label}>
                Hot Water Flow Rate (m³/hr)
              </label>

              <input
                type="number"
                name="hotWaterFlowRate"
                value={formData.hotWaterFlowRate}
                onChange={handleChange}
                placeholder="Example: 10"
                style={styles.input}
                required
              />
            </div>

            {/* Hot Water Inlet */}

            <div style={styles.field}>
              <label style={styles.label}>
                Hot Water Inlet Temperature (°C)
              </label>

              <input
                type="number"
                name="hotWaterInletTemp"
                value={formData.hotWaterInletTemp}
                onChange={handleChange}
                placeholder="Example: 30"
                style={styles.input}
                required
              />
            </div>

            {/* Hot Water Outlet */}

            <div style={styles.field}>
              <label style={styles.label}>
                Hot Water Outlet Temperature (°C)
              </label>

              <input
                type="number"
                name="hotWaterOutletTemp"
                value={formData.hotWaterOutletTemp}
                onChange={handleChange}
                placeholder="Example: 80"
                style={styles.input}
                required
              />
            </div>

            {/* Steam Pressure */}

            <div style={styles.field}>
              <label style={styles.label}>
                Steam Pressure (bar(g))
              </label>

              <input
                type="number"
                name="steamPressure"
                value={formData.steamPressure}
                onChange={handleChange}
                placeholder="Example: 3"
                style={styles.input}
                required
              />
            </div>

            {/* Steam Velocity */}

            <div style={styles.field}>
              <label style={styles.label}>
                Steam Velocity (m/s)
              </label>

              <input
                type="number"
                name="steamVelocity"
                value={formData.steamVelocity}
                onChange={handleChange}
                placeholder="Example: 25"
                style={styles.input}
                required
              />
            </div>

            {/* Hot Water Velocity */}

            <div style={styles.field}>
              <label style={styles.label}>
                Hot Water Velocity (m/s)
              </label>

              <input
                type="number"
                name="hotWaterVelocity"
                value={formData.hotWaterVelocity}
                onChange={handleChange}
                placeholder="Example: 2"
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* ================= COOLING SYSTEM ================= */}

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              ❄️ Cooling System
            </h2>

            <p style={styles.sectionDescription}>
              Enter cooling water and chilled water conditions.
            </p>

            {/* Cooling Water Flow */}

            <div style={styles.field}>
              <label style={styles.label}>
                Cooling Water Flow Rate (m³/hr)
              </label>

              <input
                type="number"
                name="coolingWaterFlowRate"
                value={formData.coolingWaterFlowRate}
                onChange={handleChange}
                placeholder="Example: 20"
                style={styles.input}
                required
              />
            </div>

            {/* Cooling Water Inlet */}

            <div style={styles.field}>
              <label style={styles.label}>
                Cooling Water Inlet Temperature (°C)
              </label>

              <input
                type="number"
                name="coolingWaterInletTemp"
                value={formData.coolingWaterInletTemp}
                onChange={handleChange}
                placeholder="Example: 30"
                style={styles.input}
                required
              />
            </div>

            {/* Cooling Water Outlet */}

            <div style={styles.field}>
              <label style={styles.label}>
                Cooling Water Outlet Temperature (°C)
              </label>

              <input
                type="number"
                name="coolingWaterOutletTemp"
                value={formData.coolingWaterOutletTemp}
                onChange={handleChange}
                placeholder="Example: 40"
                style={styles.input}
                required
              />
            </div>

            {/* Chilled Water Inlet */}

            <div style={styles.field}>
              <label style={styles.label}>
                Chilled Water Inlet Temperature (°C)
              </label>

              <input
                type="number"
                name="chilledWaterInletTemp"
                value={formData.chilledWaterInletTemp}
                onChange={handleChange}
                placeholder="Example: 7"
                style={styles.input}
                required
              />
            </div>

            {/* Chilled Water Outlet */}

            <div style={styles.field}>
              <label style={styles.label}>
                Chilled Water Outlet Temperature (°C)
              </label>

              <input
                type="number"
                name="chilledWaterOutletTemp"
                value={formData.chilledWaterOutletTemp}
                onChange={handleChange}
                placeholder="Example: 12"
                style={styles.input}
                required
              />
            </div>

            {/* Cooling Water Velocity */}

            <div style={styles.field}>
              <label style={styles.label}>
                Cooling Water Velocity (m/s)
              </label>

              <input
                type="number"
                name="coolingWaterVelocity"
                value={formData.coolingWaterVelocity}
                onChange={handleChange}
                placeholder="Example: 2"
                style={styles.input}
                required
              />
            </div>

            {/* Chilled Water Velocity */}

            <div style={styles.field}>
              <label style={styles.label}>
                Chilled Water Velocity (m/s)
              </label>

              <input
                type="number"
                name="chilledWaterVelocity"
                value={formData.chilledWaterVelocity}
                onChange={handleChange}
                placeholder="Example: 2"
                style={styles.input}
                required
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}

        <div style={styles.buttonContainer}>
          <button
            type="submit"
            style={styles.calculateButton}
            disabled={loading}
          >
            {loading
              ? "Calculating..."
              : "Calculate System"}
          </button>

          <button
            type="button"
            style={styles.resetButton}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {/* ERROR */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* ================= RESULTS ================= */}

      {result && (
        <div style={styles.resultsContainer}>
          <h2 style={styles.resultsTitle}>
            Calculation Results
          </h2>

          <div style={styles.resultGrid}>
            {/* HEATING RESULTS */}

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>
                🔥 Heating System Results
              </h3>

              <ResultRow
                label="Hot Water Flow"
                value={result.heatingSystem.hotWaterFlowRate}
              />

              <ResultRow
                label="Temperature Difference"
                value={result.heatingSystem.temperatureDifference}
              />

              <ResultRow
                label="Steam Required"
                value={result.heatingSystem.steamRequired}
              />

              <ResultRow
                label="Steam Line Size"
                value={result.heatingSystem.steamLineSize}
              />

              <ResultRow
                label="Hot Water Line Size"
                value={result.heatingSystem.hotWaterLineSize}
              />
            </div>

            {/* COOLING RESULTS */}

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>
                ❄️ Cooling System Results
              </h3>

              <ResultRow
                label="Cooling Water Flow"
                value={result.coolingSystem.coolingWaterFlowRate}
              />

              <ResultRow
                label="Chilled Water Flow"
                value={result.coolingSystem.chilledWaterFlowRate}
              />

              <ResultRow
                label="Cooling Water Line Size"
                value={result.coolingSystem.coolingWaterLineSize}
              />

              <ResultRow
                label="Chilled Water Line Size"
                value={result.coolingSystem.chilledWaterLineSize}
              />
            </div>
          </div>

          {/* STEAM PROPERTIES */}

          <div style={styles.steamProperties}>
            <h3 style={styles.resultTitle}>
              Steam Properties Used
            </h3>

            <div style={styles.propertyGrid}>
              <div>
                <span style={styles.propertyLabel}>
                  Steam Pressure
                </span>

                <strong style={styles.propertyValue}>
                  {result.steamProperties.pressure} bar(g)
                </strong>
              </div>

              <div>
                <span style={styles.propertyLabel}>
                  Latent Heat
                </span>

                <strong style={styles.propertyValue}>
                  {result.steamProperties.latentHeat} kcal/kg
                </strong>
              </div>

              <div>
                <span style={styles.propertyLabel}>
                  Specific Volume
                </span>

                <strong style={styles.propertyValue}>
                  {result.steamProperties.specificVolume} m³/kg
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ================= RESULT ROW COMPONENT =================

function ResultRow({ label, value }) {
  return (
    <div style={styles.resultRow}>
      <span>{label}</span>

      <strong>
        {value.value} {value.unit}
      </strong>
    </div>
  );
}


// ================= STYLES =================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f5f8",
    padding: "35px",
    fontFamily: "'Barlow', sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    fontSize: "30px",
  },

  subtitle: {
    color: "#455b70",
    marginTop: "10px",
    fontSize: "16px",
  },

  backButton: {
    background: "#0f2d4d",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #d5dee7",
    borderRadius: "12px",
    padding: "28px",
  },

  sectionTitle: {
    marginTop: 0,
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
  },

  sectionDescription: {
    color: "#617080",
    marginBottom: "25px",
  },

  field: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#0f2d4d",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #c8d2dc",
    fontSize: "15px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "30px",
  },

  calculateButton: {
    padding: "14px 30px",
    background: "#d9732d",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },

  resetButton: {
    padding: "14px 30px",
    background: "#ffffff",
    color: "#0f2d4d",
    border: "1px solid #0f2d4d",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },

  error: {
    marginTop: "25px",
    padding: "15px",
    borderRadius: "8px",
    background: "#ffe5e5",
    color: "#b00020",
    textAlign: "center",
  },

  resultsContainer: {
    marginTop: "35px",
  },

  resultsTitle: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "20px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
  },

  resultCard: {
    background: "#ffffff",
    border: "1px solid #d5dee7",
    borderRadius: "12px",
    padding: "25px",
  },

  resultTitle: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginTop: 0,
    marginBottom: "20px",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    padding: "14px 0",
    borderBottom: "1px solid #e2e8ee",
    color: "#455b70",
  },

  steamProperties: {
    marginTop: "25px",
    background: "#ffffff",
    border: "1px solid #d5dee7",
    borderRadius: "12px",
    padding: "25px",
  },

  propertyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },

  propertyLabel: {
    display: "block",
    color: "#617080",
    marginBottom: "7px",
  },

  propertyValue: {
    color: "#0f2d4d",
    fontSize: "17px",
  },
};


export default HeatingCoolingSystemCalculator;