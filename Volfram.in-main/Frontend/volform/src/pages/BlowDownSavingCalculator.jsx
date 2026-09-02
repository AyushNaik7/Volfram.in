import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BlowDownSavingCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    steamGeneration: "",
    fuelPrice: "",
    fuelGCV: "",
    boilerEfficiency: "",
    feedWaterTDS: "",
    boilerAllowableTDS: "",
    blowDownDuration: "",
    blowDownsPerDay: "",
    valveFlowRate: "",
    heatContent: "",
    operationalDaysPerMonth: "",
    operationalMonthsPerYear: "",
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
        "http://localhost:7000/api/calculators/blow-down-saving",
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
      fuelPrice: "",
      fuelGCV: "",
      boilerEfficiency: "",
      feedWaterTDS: "",
      boilerAllowableTDS: "",
      blowDownDuration: "",
      blowDownsPerDay: "",
      valveFlowRate: "",
      heatContent: "",
      operationalDaysPerMonth: "",
      operationalMonthsPerYear: "",
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
          Blow Down Saving Calculator
        </h1>

        <p style={styles.subtitle}>
          Calculate potential savings by reducing excess boiler blow down.
        </p>
      </div>


      <div style={styles.container}>

        {/* INPUT CARD */}

        <div style={styles.card}>

          <h2 style={styles.sectionTitle}>
            Input Values
          </h2>

          <form onSubmit={handleCalculate}>

            {/* BOILER DETAILS */}

            <h3 style={styles.groupTitle}>
              Boiler Details
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
                label="Boiler Efficiency (%)"
                name="boilerEfficiency"
                value={formData.boilerEfficiency}
                onChange={handleChange}
                placeholder="Example: 80"
              />

            </div>


            {/* FUEL DETAILS */}

            <h3 style={styles.groupTitle}>
              Fuel Details
            </h3>

            <div style={styles.grid}>

              <InputField
                label="Fuel Price (Rs/kg)"
                name="fuelPrice"
                value={formData.fuelPrice}
                onChange={handleChange}
                placeholder="Example: 50"
              />

              <InputField
                label="GCV of Fuel (Kcal/kg)"
                name="fuelGCV"
                value={formData.fuelGCV}
                onChange={handleChange}
                placeholder="Example: 10000"
              />

            </div>


            {/* TDS DETAILS */}

            <h3 style={styles.groupTitle}>
              Water & TDS Details
            </h3>

            <div style={styles.grid}>

              <InputField
                label="Feed Water TDS (ppm)"
                name="feedWaterTDS"
                value={formData.feedWaterTDS}
                onChange={handleChange}
                placeholder="Example: 500"
              />

              <InputField
                label="Boiler Allowable TDS (ppm)"
                name="boilerAllowableTDS"
                value={formData.boilerAllowableTDS}
                onChange={handleChange}
                placeholder="Example: 3000"
              />

            </div>


            {/* BLOW DOWN DETAILS */}

            <h3 style={styles.groupTitle}>
              Blow Down Details
            </h3>

            <div style={styles.grid}>

              <InputField
                label="Blow Down Duration (seconds)"
                name="blowDownDuration"
                value={formData.blowDownDuration}
                onChange={handleChange}
                placeholder="Example: 180"
              />

              <InputField
                label="Blow Downs per Day"
                name="blowDownsPerDay"
                value={formData.blowDownsPerDay}
                onChange={handleChange}
                placeholder="Example: 10"
              />

              <InputField
                label="Valve Flow Rate (kg/sec)"
                name="valveFlowRate"
                value={formData.valveFlowRate}
                onChange={handleChange}
                placeholder="Example: 5"
              />

              <InputField
                label="Heat Content (Kcal/kg)"
                name="heatContent"
                value={formData.heatContent}
                onChange={handleChange}
                placeholder="Example: 650"
              />

            </div>


            {/* OPERATION DETAILS */}

            <h3 style={styles.groupTitle}>
              Operational Details
            </h3>

            <div style={styles.grid}>

              <InputField
                label="Operational Days per Month"
                name="operationalDaysPerMonth"
                value={formData.operationalDaysPerMonth}
                onChange={handleChange}
                placeholder="Example: 30"
              />

              <InputField
                label="Operational Months per Year"
                name="operationalMonthsPerYear"
                value={formData.operationalMonthsPerYear}
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
                  : "Calculate Savings"}
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
              Blow Down Calculation
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Required Blow Down"
                value={
                  result.calculationSteps
                    .requiredBlowDown.value
                }
                unit={
                  result.calculationSteps
                    .requiredBlowDown.unit
                }
              />

              <ResultItem
                label="Present Manual Blow Down"
                value={
                  result.calculationSteps
                    .presentManualBlowDown.value
                }
                unit={
                  result.calculationSteps
                    .presentManualBlowDown.unit
                }
              />

              <ResultItem
                label="Excess Blow Down"
                value={
                  result.calculationSteps
                    .excessBlowDown.value
                }
                unit={
                  result.calculationSteps
                    .excessBlowDown.unit
                }
              />

            </div>


            <h3 style={styles.groupTitle}>
              Savings
            </h3>

            <div style={styles.resultGrid}>

              <ResultItem
                label="Daily Saving"
                value={
                  result.savings.dailySaving.value
                }
                unit={
                  result.savings.dailySaving.unit
                }
              />

              <ResultItem
                label="Monthly Saving"
                value={
                  result.savings.monthlySaving.value
                }
                unit={
                  result.savings.monthlySaving.unit
                }
              />

            </div>


            {/* FINAL RESULT */}

            <div style={styles.finalResult}>

              <h2>
                Total Annual Saving
              </h2>

              <div style={styles.finalValue}>
                ₹{" "}
                {result.result.annualSaving.value.toLocaleString()}
              </div>

              <p>
                {result.result.annualSaving.unit}
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
  placeholder
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


/* RESULT ITEM */

function ResultItem({
  label,
  value,
  unit
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
    fontSize: "32px",
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


export default BlowDownSavingCalculator;