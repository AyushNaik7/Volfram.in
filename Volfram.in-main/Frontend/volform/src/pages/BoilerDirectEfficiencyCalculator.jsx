import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BoilerDirectEfficiencyCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    steamGeneration: "",
    boilerPressure: "",
    fuelGCV: "",
    fuelPrice: "",
    fuelConsumption: "",
    feedWaterTemperature: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleCalculate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000";
      const response = await fetch(
        `${API_BASE_URL}/api/calculators/boiler-direct-efficiency`,
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
      steamGeneration: "",
      boilerPressure: "",
      fuelGCV: "",
      fuelPrice: "",
      fuelConsumption: "",
      feedWaterTemperature: "",
    });

    setResult(null);
    setError("");
  };


  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin
        </button>

        <h1 style={styles.title}>
          Boiler Direct Efficiency Calculator
        </h1>

        <p style={styles.subtitle}>
          Calculate boiler direct efficiency and steam generation cost.
        </p>

      </div>


      <div style={styles.container}>

        {/* INPUT SECTION */}

        <div style={styles.card}>

          <h2 style={styles.sectionTitle}>
            Input Values
          </h2>


          <form onSubmit={handleCalculate}>


            {/* STEAM DETAILS */}

            <h3 style={styles.groupTitle}>
              Steam Details
            </h3>

            <div style={styles.grid}>

              <InputField
                label="Steam Generation (kg/hr)"
                name="steamGeneration"
                value={formData.steamGeneration}
                onChange={handleChange}
                placeholder="Example: 1000"
              />

              <InputField
                label="Boiler Pressure (bar g)"
                name="boilerPressure"
                value={formData.boilerPressure}
                onChange={handleChange}
                placeholder="Example: 5"
              />

              <InputField
                label="Feed Water Temperature (°C)"
                name="feedWaterTemperature"
                value={formData.feedWaterTemperature}
                onChange={handleChange}
                placeholder="Example: 30"
              />

            </div>


            {/* FUEL DETAILS */}

            <h3 style={styles.groupTitle}>
              Fuel Details
            </h3>

            <div style={styles.grid}>

              <InputField
                label="GCV of Fuel (Kcal/kg)"
                name="fuelGCV"
                value={formData.fuelGCV}
                onChange={handleChange}
                placeholder="Example: 10000"
              />

              <InputField
                label="Fuel Price (Rs/kg)"
                name="fuelPrice"
                value={formData.fuelPrice}
                onChange={handleChange}
                placeholder="Example: 50"
              />

              <InputField
                label="Fuel Consumption (kg/hr)"
                name="fuelConsumption"
                value={formData.fuelConsumption}
                onChange={handleChange}
                placeholder="Example: 80"
              />

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
                  : "Calculate Efficiency"}
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


            {/* STEAM PROPERTIES */}

            <h3 style={styles.groupTitle}>
              Steam Properties
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Total Heat of Steam"
                value={
                  result.steamProperties
                    .totalHeat.value
                }
                unit={
                  result.steamProperties
                    .totalHeat.unit
                }
              />

            </div>


            {/* CALCULATION DETAILS */}

            <h3 style={styles.groupTitle}>
              Calculation Details
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Heat Added per kg of Steam"
                value={
                  result.calculationSteps
                    .heatAddedPerKg.value
                }
                unit={
                  result.calculationSteps
                    .heatAddedPerKg.unit
                }
              />


              <ResultItem
                label="Total Heat Added"
                value={
                  result.calculationSteps
                    .totalHeatAdded.value
                }
                unit={
                  result.calculationSteps
                    .totalHeatAdded.unit
                }
              />


              <ResultItem
                label="Heat Input from Fuel"
                value={
                  result.calculationSteps
                    .heatInputFromFuel.value
                }
                unit={
                  result.calculationSteps
                    .heatInputFromFuel.unit
                }
              />

            </div>


            {/* FINAL RESULTS */}

            <h3 style={styles.groupTitle}>
              Final Results
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Boiler Direct Efficiency"
                value={
                  result.result
                    .boilerEfficiency.value
                }
                unit={
                  result.result
                    .boilerEfficiency.unit
                }
              />


              <ResultItem
                label="Steam Generation Cost"
                value={
                  result.result
                    .steamCost.value
                }
                unit={
                  result.result
                    .steamCost.unit
                }
              />

            </div>


            {/* MAIN RESULT */}

            <div style={styles.finalResult}>

              <h2>
                Boiler Direct Efficiency
              </h2>

              <div style={styles.finalValue}>

                {result.result.boilerEfficiency.value} %

              </div>

              <p>
                Calculated Boiler Efficiency
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


/* INPUT FIELD COMPONENT */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
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
        style={styles.input}
      />

    </div>
  );
}


/* RESULT COMPONENT */

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
    padding: "12px 25px",
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


  finalValue: {
    fontSize: "35px",
    fontWeight: "700",
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


export default BoilerDirectEfficiencyCalculator;