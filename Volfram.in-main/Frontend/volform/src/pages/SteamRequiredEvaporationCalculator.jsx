import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SteamRequiredEvaporationCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    totalQuantity: "",
    evaporationQuantity: "",
    evaporationPressure: "",
    initialTemperature: "",
    specificHeat: "",
    steamPressure: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/steam-required-evaporation",
        {
          totalQuantity: Number(formData.totalQuantity),
          evaporationQuantity: Number(formData.evaporationQuantity),
          evaporationPressure: Number(formData.evaporationPressure),
          initialTemperature: Number(formData.initialTemperature),
          specificHeat: Number(formData.specificHeat),
          steamPressure: Number(formData.steamPressure),
        }
      );

      setResult(response.data.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      totalQuantity: "",
      evaporationQuantity: "",
      evaporationPressure: "",
      initialTemperature: "",
      specificHeat: "",
      steamPressure: "",
    });

    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <button
            onClick={() => navigate("/admin")}
            style={styles.backButton}
          >
            ← Back to Calculators
          </button>

          <h1 style={styles.title}>
            Steam Required for Evaporation
          </h1>

          <p style={styles.subtitle}>
            Calculate steam consumption required for process evaporation.
          </p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* INPUT SECTION */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Input Parameters
          </h2>

          <form onSubmit={handleSubmit}>
            {/* TOTAL QUANTITY */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Process Media Total Quantity (kg)
              </label>

              <input
                type="number"
                name="totalQuantity"
                value={formData.totalQuantity}
                onChange={handleChange}
                style={styles.input}
                placeholder="Example: 1000"
                required
              />
            </div>

            {/* EVAPORATION QUANTITY */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Quantity for Evaporation (kg)
              </label>

              <input
                type="number"
                name="evaporationQuantity"
                value={formData.evaporationQuantity}
                onChange={handleChange}
                style={styles.input}
                placeholder="Example: 200"
                required
              />
            </div>

            {/* EVAPORATION PRESSURE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Evaporation Pressure (bar g)
              </label>

              <input
                type="number"
                name="evaporationPressure"
                value={formData.evaporationPressure}
                onChange={handleChange}
                style={styles.input}
                placeholder="Example: 2"
                required
              />
            </div>

            {/* INITIAL TEMPERATURE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Initial Temperature (°C)
              </label>

              <input
                type="number"
                name="initialTemperature"
                value={formData.initialTemperature}
                onChange={handleChange}
                style={styles.input}
                placeholder="Example: 30"
                required
              />
            </div>

            {/* SPECIFIC HEAT */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Specific Heat (Kcal/kg°C)
              </label>

              <input
                type="number"
                step="0.01"
                name="specificHeat"
                value={formData.specificHeat}
                onChange={handleChange}
                style={styles.input}
                placeholder="Example: 1"
                required
              />
            </div>

            {/* STEAM PRESSURE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Steam Supply Pressure (bar g)
              </label>

              <input
                type="number"
                name="steamPressure"
                value={formData.steamPressure}
                onChange={handleChange}
                style={styles.input}
                placeholder="Example: 4"
                required
              />
            </div>

            {/* BUTTONS */}
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={styles.calculateButton}
                disabled={loading}
              >
                {loading
                  ? "Calculating..."
                  : "Calculate"}
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

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
        </div>

        {/* RESULT SECTION */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Calculation Result
          </h2>

          {!result && (
            <p style={styles.emptyText}>
              Enter the input values and click Calculate.
            </p>
          )}

          {result && (
            <div>
              {/* STEAM PROPERTIES */}
              <h3 style={styles.resultHeading}>
                Steam Properties
              </h3>

              <div style={styles.resultRow}>
                <span>Boiling Temperature</span>

                <strong>
                  {
                    result.steamProperties
                      .evaporationPressure
                      .boilingTemperature.value
                  } °C
                </strong>
              </div>

              <div style={styles.resultRow}>
                <span>Latent Heat for Evaporation</span>

                <strong>
                  {
                    result.steamProperties
                      .evaporationPressure
                      .latentHeat.value
                  } Kcal/kg
                </strong>
              </div>

              <div style={styles.resultRow}>
                <span>Steam Latent Heat</span>

                <strong>
                  {
                    result.steamProperties
                      .steamPressure
                      .latentHeat.value
                  } Kcal/kg
                </strong>
              </div>

              {/* CALCULATION STEPS */}
              <h3 style={styles.resultHeading}>
                Calculation Steps
              </h3>

              <div style={styles.resultRow}>
                <span>Energy to Boiling Point</span>

                <strong>
                  {
                    result.calculationSteps
                      .energyToBoilingPoint.value
                  } Kcal
                </strong>
              </div>

              <div style={styles.resultRow}>
                <span>Energy Required for Evaporation</span>

                <strong>
                  {
                    result.calculationSteps
                      .energyToEvaporate.value
                  } Kcal
                </strong>
              </div>

              <div style={styles.resultRow}>
                <span>Total Energy Required</span>

                <strong>
                  {
                    result.calculationSteps
                      .totalEnergyRequired.value
                  } Kcal
                </strong>
              </div>

              {/* FINAL RESULT */}
              <div style={styles.finalResult}>
                <h3 style={styles.finalTitle}>
                  Final Result
                </h3>

                <div style={styles.finalRow}>
                  <span>
                    Required Steam
                  </span>

                  <strong>
                    {
                      result.result
                        .steamRequired.value
                    } kg/hr
                  </strong>
                </div>

                <div style={styles.finalRow}>
                  <span>
                    Equivalent Electrical Load
                  </span>

                  <strong>
                    {
                      result.result
                        .equivalentElectricalLoad.value
                    } kW
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f5f8",
    padding: "40px",
    fontFamily: "'Barlow', sans-serif",
  },

  header: {
    maxWidth: "1200px",
    margin: "0 auto 30px auto",
  },

  backButton: {
    background: "transparent",
    border: "none",
    color: "#0f2d4d",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "15px",
    padding: 0,
  },

  title: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#455b70",
    fontSize: "17px",
  },

  layout: {
    maxWidth: "1200px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #d5dee7",
    borderRadius: "14px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(15,45,77,0.05)",
  },

  sectionTitle: {
    fontFamily: "'Sora', sans-serif",
    color: "#0f2d4d",
    marginTop: 0,
    marginBottom: "25px",
  },

  inputGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    color: "#334e68",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccd6dd",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
  },

  calculateButton: {
    flex: 1,
    padding: "13px",
    background: "#0f2d4d",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  resetButton: {
    padding: "13px 25px",
    background: "#ffffff",
    color: "#0f2d4d",
    border: "1px solid #0f2d4d",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },

  error: {
    marginTop: "20px",
    padding: "12px",
    background: "#ffe5e5",
    color: "#c0392b",
    borderRadius: "7px",
  },

  emptyText: {
    color: "#718096",
    textAlign: "center",
    paddingTop: "50px",
  },

  resultHeading: {
    color: "#0f2d4d",
    marginTop: "25px",
    marginBottom: "12px",
    fontFamily: "'Sora', sans-serif",
    fontSize: "17px",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "12px 0",
    borderBottom: "1px solid #e5eaee",
    color: "#455b70",
  },

  finalResult: {
    marginTop: "30px",
    background: "#eef5f8",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #c9dce5",
  },

  finalTitle: {
    color: "#0f2d4d",
    marginTop: 0,
    fontFamily: "'Sora', sans-serif",
  },

  finalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    color: "#0f2d4d",
    fontSize: "16px",
  },
};

export default SteamRequiredEvaporationCalculator;