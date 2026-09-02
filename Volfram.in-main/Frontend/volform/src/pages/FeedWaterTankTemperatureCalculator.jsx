import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FeedWaterTankTemperatureCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    condensateQuantity: "",
    condensateTemperature: "",
    freshWaterQuantity: "",
    freshWaterTemperature: "",
    flashSteamQuantity: "",
    flashSteamPressure: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/feed-water-tank/final-temperature",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            condensateQuantity: Number(formData.condensateQuantity),
            condensateTemperature: Number(formData.condensateTemperature),
            freshWaterQuantity: Number(formData.freshWaterQuantity),
            freshWaterTemperature: Number(formData.freshWaterTemperature),
            flashSteamQuantity: Number(formData.flashSteamQuantity),
            flashSteamPressure: Number(formData.flashSteamPressure),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Calculation failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      condensateQuantity: "",
      condensateTemperature: "",
      freshWaterQuantity: "",
      freshWaterTemperature: "",
      flashSteamQuantity: "",
      flashSteamPressure: "",
    });

    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.topSection}>
          <button
            style={styles.backButton}
            onClick={() => navigate("/admin")}
          >
            ← Back to Calculators
          </button>

          <h1 style={styles.title}>
            Feed Water Tank Final Temperature Calculator
          </h1>

          <p style={styles.subtitle}>
            Calculate the final feed water temperature after mixing
            condensate, fresh water, and flash steam.
          </p>
        </div>

        <div style={styles.grid}>
          {/* INPUT SECTION */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Input Values</h2>

            <form onSubmit={handleCalculate}>
              {/* Condensate */}
              <h3 style={styles.sectionTitle}>Condensate</h3>

              <div style={styles.inputGroup}>
                <label>Condensate Quantity (kg)</label>

                <input
                  type="number"
                  name="condensateQuantity"
                  value={formData.condensateQuantity}
                  onChange={handleChange}
                  placeholder="Example: 1000"
                  required
                  min="0"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Condensate Temperature (°C)</label>

                <input
                  type="number"
                  name="condensateTemperature"
                  value={formData.condensateTemperature}
                  onChange={handleChange}
                  placeholder="Example: 80"
                  required
                  min="0"
                  style={styles.input}
                />
              </div>

              {/* Fresh Water */}
              <h3 style={styles.sectionTitle}>Fresh Water</h3>

              <div style={styles.inputGroup}>
                <label>Fresh Water Quantity (kg)</label>

                <input
                  type="number"
                  name="freshWaterQuantity"
                  value={formData.freshWaterQuantity}
                  onChange={handleChange}
                  placeholder="Example: 500"
                  required
                  min="0"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Fresh Water Temperature (°C)</label>

                <input
                  type="number"
                  name="freshWaterTemperature"
                  value={formData.freshWaterTemperature}
                  onChange={handleChange}
                  placeholder="Example: 30"
                  required
                  min="0"
                  style={styles.input}
                />
              </div>

              {/* Flash Steam */}
              <h3 style={styles.sectionTitle}>Flash Steam</h3>

              <div style={styles.inputGroup}>
                <label>Flash Steam Quantity (kg)</label>

                <input
                  type="number"
                  name="flashSteamQuantity"
                  value={formData.flashSteamQuantity}
                  onChange={handleChange}
                  placeholder="Example: 50"
                  required
                  min="0"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Flash Steam Pressure (bar(g))</label>

                <input
                  type="number"
                  name="flashSteamPressure"
                  value={formData.flashSteamPressure}
                  onChange={handleChange}
                  placeholder="Example: 3"
                  required
                  min="0"
                  step="1"
                  style={styles.input}
                />
              </div>

              {/* Buttons */}
              <div style={styles.buttonContainer}>
                <button
                  type="submit"
                  style={styles.calculateButton}
                  disabled={loading}
                >
                  {loading ? "Calculating..." : "Calculate"}
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
          </div>

          {/* RESULT SECTION */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Calculation Result</h2>

            {error && (
              <div style={styles.errorBox}>
                {error}
              </div>
            )}

            {!result && !error && (
              <div style={styles.emptyResult}>
                Enter the values and click Calculate.
              </div>
            )}

            {result && (
              <>
                {/* Final Result */}
                <div style={styles.resultBox}>
                  <p style={styles.resultLabel}>
                    Final Feed Water Temperature
                  </p>

                  <h1 style={styles.resultValue}>
                    {result.result.finalTemperature.value}{" "}
                    {result.result.finalTemperature.unit}
                  </h1>
                </div>

                {/* Steam Properties */}
                <h3 style={styles.resultHeading}>
                  Steam Properties
                </h3>

                <div style={styles.resultRow}>
                  <span>Flash Steam Total Heat</span>

                  <strong>
                    {
                      result.steamProperties
                        .flashSteamTotalHeat.value
                    }{" "}
                    {
                      result.steamProperties
                        .flashSteamTotalHeat.unit
                    }
                  </strong>
                </div>

                {/* Calculation Steps */}
                <h3 style={styles.resultHeading}>
                  Calculation Steps
                </h3>

                <div style={styles.resultRow}>
                  <span>Total Quantity</span>

                  <strong>
                    {result.calculationSteps.totalQuantity.value}{" "}
                    {result.calculationSteps.totalQuantity.unit}
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span>Condensate Heat</span>

                  <strong>
                    {result.calculationSteps.condensateHeat.value}{" "}
                    {result.calculationSteps.condensateHeat.unit}
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span>Fresh Water Heat</span>

                  <strong>
                    {result.calculationSteps.freshWaterHeat.value}{" "}
                    {result.calculationSteps.freshWaterHeat.unit}
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span>Flash Steam Heat</span>

                  <strong>
                    {result.calculationSteps.flashSteamHeat.value}{" "}
                    {result.calculationSteps.flashSteamHeat.unit}
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span>Total Heat</span>

                  <strong>
                    {result.calculationSteps.totalHeat.value}{" "}
                    {result.calculationSteps.totalHeat.unit}
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f5f8",
    padding: "30px",
    fontFamily: "'Barlow', sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  topSection: {
    marginBottom: "30px",
  },

  backButton: {
    background: "#ffffff",
    border: "1px solid #d5dee7",
    color: "#0f2d4d",
    padding: "10px 16px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "20px",
  },

  title: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#455b70",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    alignItems: "start",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #d5dee7",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 4px 12px rgba(15,45,77,0.06)",
  },

  cardTitle: {
    fontFamily: "'Sora', sans-serif",
    color: "#0f2d4d",
    marginTop: 0,
    marginBottom: "25px",
  },

  sectionTitle: {
    color: "#146c8a",
    marginTop: "22px",
    marginBottom: "15px",
    fontSize: "17px",
    fontFamily: "'Sora', sans-serif",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #cbd5df",
    marginTop: "7px",
    fontSize: "15px",
  },

  buttonContainer: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
  },

  calculateButton: {
    flex: 1,
    padding: "13px",
    border: "none",
    borderRadius: "7px",
    background: "#0f2d4d",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  resetButton: {
    padding: "13px 22px",
    border: "1px solid #d5dee7",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#0f2d4d",
    cursor: "pointer",
    fontWeight: "600",
  },

  resultBox: {
    background: "#f0f7fa",
    border: "1px solid #b8d7e3",
    borderRadius: "10px",
    padding: "25px",
    textAlign: "center",
    marginBottom: "25px",
  },

  resultLabel: {
    color: "#455b70",
    marginBottom: "10px",
  },

  resultValue: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    margin: 0,
    fontSize: "32px",
  },

  resultHeading: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginTop: "25px",
    marginBottom: "12px",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "13px 0",
    borderBottom: "1px solid #e4e9ed",
    color: "#455b70",
  },

  emptyResult: {
    padding: "50px 20px",
    textAlign: "center",
    color: "#7a8b99",
  },

  errorBox: {
    background: "#fff0f0",
    border: "1px solid #f0b5b5",
    color: "#c0392b",
    padding: "15px",
    borderRadius: "7px",
  },
};

export default FeedWaterTankTemperatureCalculator;