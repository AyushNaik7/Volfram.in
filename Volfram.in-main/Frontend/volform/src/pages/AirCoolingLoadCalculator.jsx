import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AirCoolingLoadCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    airFlow: "",
    airDensity: "",
    specificHeat: "",
    inletAirTemperature: "",
    outletAirTemperature: "",
    chilledWaterInletTemperature: "",
    chilledWaterOutletTemperature: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000";
      const response = await fetch(
        `${API_BASE_URL}/api/calculators/air-cooling-load`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Calculation failed"
        );
      }

      setResult(data.data);

    } catch (error) {
      console.error(error);
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      airFlow: "",
      airDensity: "",
      specificHeat: "",
      inletAirTemperature: "",
      outletAirTemperature: "",
      chilledWaterInletTemperature: "",
      chilledWaterOutletTemperature: "",
    });

    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>

      <div style={styles.header}>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin
        </button>

        <h1 style={styles.title}>
          Air Cooling Load Calculator
        </h1>

        <p style={styles.subtitle}>
          Calculate cooling load and required chilled water flow rate.
        </p>

      </div>


      <div style={styles.container}>

        {/* INPUT CARD */}

        <div style={styles.card}>

          <h2 style={styles.sectionTitle}>
            Input Values
          </h2>

          <form onSubmit={handleCalculate}>

            <div style={styles.grid}>

              <InputField
                label="Air Flow (Nm³/min)"
                name="airFlow"
                value={formData.airFlow}
                onChange={handleChange}
                placeholder="Example: 100"
              />

              <InputField
                label="Air Density (kg/m³)"
                name="airDensity"
                value={formData.airDensity}
                onChange={handleChange}
                placeholder="Example: 1.2"
                step="any"
              />

              <InputField
                label="Specific Heat (Kcal/kg°C)"
                name="specificHeat"
                value={formData.specificHeat}
                onChange={handleChange}
                placeholder="Example: 0.24"
                step="any"
              />

              <InputField
                label="Inlet Air Temperature (°C)"
                name="inletAirTemperature"
                value={formData.inletAirTemperature}
                onChange={handleChange}
                placeholder="Example: 35"
              />

              <InputField
                label="Outlet Air Temperature (°C)"
                name="outletAirTemperature"
                value={formData.outletAirTemperature}
                onChange={handleChange}
                placeholder="Example: 20"
              />

              <InputField
                label="Chilled Water Inlet Temperature (°C)"
                name="chilledWaterInletTemperature"
                value={formData.chilledWaterInletTemperature}
                onChange={handleChange}
                placeholder="Example: 7"
              />

              <InputField
                label="Chilled Water Outlet Temperature (°C)"
                name="chilledWaterOutletTemperature"
                value={formData.chilledWaterOutletTemperature}
                onChange={handleChange}
                placeholder="Example: 12"
              />

            </div>


            <div style={styles.buttonContainer}>

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

        </div>


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* RESULTS */}

        {result && (

          <div style={styles.resultCard}>

            <h2 style={styles.sectionTitle}>
              Calculation Results
            </h2>


            <h3 style={styles.groupTitle}>
              Calculation Details
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Air Temperature Difference"
                value={
                  result.calculationSteps
                    .airTemperatureDifference.value
                }
                unit={
                  result.calculationSteps
                    .airTemperatureDifference.unit
                }
              />


              <ResultItem
                label="Chilled Water Temperature Difference"
                value={
                  result.calculationSteps
                    .chilledWaterTemperatureDifference.value
                }
                unit={
                  result.calculationSteps
                    .chilledWaterTemperatureDifference.unit
                }
              />

            </div>


            {/* FINAL RESULTS */}

            <h3 style={styles.groupTitle}>
              Final Results
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Cooling Load"
                value={
                  result.result.coolingLoad.value
                }
                unit={
                  result.result.coolingLoad.unit
                }
              />


              <ResultItem
                label="Chilled Water Flow Rate"
                value={
                  result.result.chilledWaterFlowRate.value
                }
                unit={
                  result.result.chilledWaterFlowRate.unit
                }
              />

            </div>


            {/* HIGHLIGHT */}

            <div style={styles.finalResult}>

              <h2 style={styles.finalTitle}>
                Cooling Load
              </h2>

              <div style={styles.finalValue}>
                {result.result.coolingLoad.value}{" "}
                {result.result.coolingLoad.unit}
              </div>

              <p style={styles.finalText}>
                Required chilled water flow:{" "}
                <strong>
                  {result.result.chilledWaterFlowRate.value}{" "}
                  {result.result.chilledWaterFlowRate.unit}
                </strong>
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


/* INPUT FIELD */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  step = "any",
}) {

  return (

    <div>

      <label style={styles.label}>
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        style={styles.input}
      />

    </div>

  );
}


/* RESULT ITEM */

function ResultItem({
  label,
  value,
  unit,
}) {

  return (

    <div style={styles.resultItem}>

      <div style={styles.resultLabel}>
        {label}
      </div>

      <div style={styles.resultValue}>
        {value} {unit}
      </div>

    </div>

  );
}


/* STYLES */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f2f5f8",
    padding: "30px",
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
    marginBottom: "20px",
    fontWeight: "600",
  },

  title: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#455b70",
  },

  container: {
    maxWidth: "1200px",
    margin: "auto",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #d5dee7",
    marginBottom: "25px",
  },

  resultCard: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #d5dee7",
  },

  sectionTitle: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "25px",
  },

  groupTitle: {
    color: "#146c8a",
    marginTop: "25px",
    marginBottom: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#0f2d4d",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d5dee7",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  buttonContainer: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },

  calculateButton: {
    background: "#0f2d4d",
    color: "#ffffff",
    border: "none",
    padding: "12px 28px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  resetButton: {
    background: "#ffffff",
    color: "#0f2d4d",
    border: "1px solid #0f2d4d",
    padding: "12px 25px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "15px",
  },

  resultItem: {
    background: "#f2f5f8",
    padding: "18px",
    borderRadius: "8px",
    border: "1px solid #d5dee7",
  },

  resultLabel: {
    color: "#455b70",
    fontSize: "14px",
    marginBottom: "7px",
  },

  resultValue: {
    color: "#0f2d4d",
    fontWeight: "700",
    fontSize: "18px",
  },

  finalResult: {
    marginTop: "30px",
    padding: "30px",
    textAlign: "center",
    background: "#0f2d4d",
    color: "#ffffff",
    borderRadius: "12px",
  },

  finalTitle: {
    margin: 0,
  },

  finalValue: {
    fontSize: "35px",
    fontWeight: "700",
    marginTop: "15px",
  },

  finalText: {
    marginTop: "15px",
  },

  error: {
    background: "#ffe5e5",
    color: "#b42318",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

};


export default AirCoolingLoadCalculator;