import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SteamRequirementProcessHeatingCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    processMediaFlowRate: "",
    initialTemperature: "",
    finalTemperature: "",
    specificHeat: "",
    steamPressure: "",
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
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/steam-requirement-process-heating",
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
      processMediaFlowRate: "",
      initialTemperature: "",
      finalTemperature: "",
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

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin
        </button>

        <h1 style={styles.title}>
          Steam Requirement for Process Heating
        </h1>

        <p style={styles.subtitle}>
          Calculate the amount of steam required for process heating.
        </p>

      </div>


      <div style={styles.container}>

        {/* INPUT SECTION */}

        <div style={styles.card}>

          <h2 style={styles.sectionTitle}>
            Input Values
          </h2>


          <form onSubmit={handleCalculate}>

            <div style={styles.grid}>

              <InputField
                label="Process Media Flow Rate (kg/hr)"
                name="processMediaFlowRate"
                value={formData.processMediaFlowRate}
                onChange={handleChange}
                placeholder="Example: 1000"
              />

              <InputField
                label="Initial Temperature (°C)"
                name="initialTemperature"
                value={formData.initialTemperature}
                onChange={handleChange}
                placeholder="Example: 30"
              />

              <InputField
                label="Final Temperature (°C)"
                name="finalTemperature"
                value={formData.finalTemperature}
                onChange={handleChange}
                placeholder="Example: 80"
              />

              <InputField
                label="Specific Heat (Kcal/kg°C)"
                name="specificHeat"
                value={formData.specificHeat}
                onChange={handleChange}
                placeholder="Example: 1"
              />

              <InputField
                label="Steam Pressure (bar g)"
                name="steamPressure"
                value={formData.steamPressure}
                onChange={handleChange}
                placeholder="Example: 5"
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
                  : "Calculate Steam Requirement"}
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


        {/* ERROR MESSAGE */}

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
                label="Latent Heat of Steam"
                value={
                  result.steamProperties
                    .latentHeat.value
                }
                unit={
                  result.steamProperties
                    .latentHeat.unit
                }
              />

            </div>


            {/* CALCULATION STEPS */}

            <h3 style={styles.groupTitle}>
              Calculation Details
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Temperature Rise"
                value={
                  result.calculationSteps
                    .temperatureRise.value
                }
                unit={
                  result.calculationSteps
                    .temperatureRise.unit
                }
              />


              <ResultItem
                label="Heat Required"
                value={
                  result.calculationSteps
                    .heatRequired.value
                }
                unit={
                  result.calculationSteps
                    .heatRequired.unit
                }
              />

            </div>


            {/* FINAL RESULT */}

            <div style={styles.finalResult}>

              <h2>
                Steam Required
              </h2>

              <div style={styles.finalValue}>

                {result.result.steamRequired.value}

                {" "}

                {result.result.steamRequired.unit}

              </div>

              <p>
                Required steam flow for the heating process
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


/* RESULT ITEM COMPONENT */

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


export default SteamRequirementProcessHeatingCalculator;