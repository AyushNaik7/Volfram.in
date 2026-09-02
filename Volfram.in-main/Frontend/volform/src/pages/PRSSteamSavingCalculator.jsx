import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PRSSteamSavingCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    inletPressure: "",
    outletPressure: "",
    flowRate: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================
  // HANDLE INPUT CHANGE
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // CALCULATE
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/prs-steam-saving",
        {
          inletPressure: Number(formData.inletPressure),
          outletPressure: Number(formData.outletPressure),
          flowRate: Number(formData.flowRate),
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      console.error("PRS Calculator Error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while calculating."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RESET
  // ============================

  const handleReset = () => {
    setFormData({
      inletPressure: "",
      outletPressure: "",
      flowRate: "",
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
            Steam Saving in PRS Calculator
          </h1>

          <p style={styles.subtitle}>
            Calculate steam flow requirement and steam savings
            using a Pressure Reducing Station (PRS).
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Calculators
        </button>
      </div>


      <div style={styles.container}>

        {/* CALCULATOR FORM */}

        <form onSubmit={handleSubmit}>

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              Enter Calculation Details
            </h2>

            <div style={styles.inputGrid}>

              {/* INLET PRESSURE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Inlet Pressure (bar)
                </label>

                <input
                  type="number"
                  name="inletPressure"
                  value={formData.inletPressure}
                  onChange={handleChange}
                  placeholder="Example: 5"
                  min="0"
                  step="any"
                  required
                  style={styles.input}
                />

                <small style={styles.helpText}>
                  Pressure before the PRS
                </small>
              </div>


              {/* OUTLET PRESSURE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Outlet Pressure (bar)
                </label>

                <input
                  type="number"
                  name="outletPressure"
                  value={formData.outletPressure}
                  onChange={handleChange}
                  placeholder="Example: 2"
                  min="0"
                  step="any"
                  required
                  style={styles.input}
                />

                <small style={styles.helpText}>
                  Pressure after the PRS
                </small>
              </div>


              {/* FLOW RATE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Steam Flow Rate Without PRS (kg/hr)
                </label>

                <input
                  type="number"
                  name="flowRate"
                  value={formData.flowRate}
                  onChange={handleChange}
                  placeholder="Example: 1000"
                  min="0"
                  step="any"
                  required
                  style={styles.input}
                />

                <small style={styles.helpText}>
                  Steam consumption before using PRS
                </small>
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
                  : "Calculate Steam Saving"}
              </button>

              <button
                type="button"
                style={styles.resetButton}
                onClick={handleReset}
              >
                Reset
              </button>

            </div>

          </div>

        </form>


        {/* ERROR MESSAGE */}

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}


        {/* RESULT */}

        {result && (
          <div style={styles.resultCard}>

            <h2 style={styles.resultHeading}>
              Calculation Results
            </h2>


            {/* INPUT SUMMARY */}

            <h3 style={styles.sectionTitle}>
              Input Summary
            </h3>

            <div style={styles.resultGrid}>

              {Object.entries(result.inputs).map(
                ([key, item]) => (
                  <ResultBox
                    key={key}
                    label={formatLabel(key)}
                    value={`${item.value} ${item.unit}`}
                  />
                )
              )}

            </div>


            {/* STEAM PROPERTIES */}

            {result.steamProperties && (
              <>
                <h3 style={styles.sectionTitle}>
                  Steam Properties
                </h3>

                <div style={styles.resultGrid}>

                  {Object.entries(result.steamProperties).map(
                    ([key, item]) => (
                      <ResultBox
                        key={key}
                        label={formatLabel(key)}
                        value={`${item.value} ${item.unit}`}
                      />
                    )
                  )}

                </div>
              </>
            )}


            {/* CALCULATION STEPS */}

            {result.calculationSteps && (
              <>
                <h3 style={styles.sectionTitle}>
                  Calculation Details
                </h3>

                <div style={styles.resultGrid}>

                  {Object.entries(result.calculationSteps).map(
                    ([key, item]) => (
                      <ResultBox
                        key={key}
                        label={formatLabel(key)}
                        value={`${item.value} ${item.unit}`}
                      />
                    )
                  )}

                </div>
              </>
            )}


            {/* FINAL RESULT */}

            <h3 style={styles.sectionTitle}>
              Final Result
            </h3>

            <div style={styles.finalResultGrid}>

              {Object.entries(result.result).map(
                ([key, item]) => (
                  <ResultBox
                    key={key}
                    label={formatLabel(key)}
                    value={`${item.value} ${item.unit}`}
                    highlight={true}
                  />
                )
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}


// ========================================
// RESULT BOX COMPONENT
// ========================================

function ResultBox({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      style={{
        ...styles.resultBox,
        ...(highlight ? styles.highlightBox : {}),
      }}
    >
      <span style={styles.resultLabel}>
        {label}
      </span>

      <strong style={styles.resultValue}>
        {value}
      </strong>
    </div>
  );
}


// ========================================
// FORMAT LABEL
// ========================================

function formatLabel(text) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}


// ========================================
// STYLES
// ========================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f5f8",
    padding: "35px",
    fontFamily: "'Barlow', sans-serif",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  title: {
    margin: 0,
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    fontSize: "30px",
  },

  subtitle: {
    color: "#617080",
    marginTop: "10px",
    maxWidth: "700px",
    lineHeight: "1.6",
  },

  backButton: {
    background: "#0f2d4d",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    border: "1px solid #d5dee7",
  },

  cardTitle: {
    color: "#0f2d4d",
    marginTop: 0,
    marginBottom: "25px",
    fontFamily: "'Sora', sans-serif",
  },

  inputGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "8px",
    color: "#0f2d4d",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #c8d2dc",
    fontSize: "15px",
  },

  helpText: {
    marginTop: "6px",
    color: "#718096",
    fontSize: "12px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "30px",
    flexWrap: "wrap",
  },

  calculateButton: {
    background: "#d9732d",
    color: "#ffffff",
    border: "none",
    padding: "14px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },

  resetButton: {
    background: "#ffffff",
    color: "#0f2d4d",
    border: "1px solid #0f2d4d",
    padding: "14px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },

  errorBox: {
    marginTop: "25px",
    padding: "15px",
    background: "#ffe5e5",
    color: "#b00020",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "500",
  },

  resultCard: {
    marginTop: "30px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    border: "1px solid #d5dee7",
  },

  resultHeading: {
    marginTop: 0,
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
  },

  sectionTitle: {
    marginTop: "30px",
    marginBottom: "15px",
    color: "#0f2d4d",
    fontSize: "20px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  finalResultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  resultBox: {
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #d5dee7",
    background: "#f8fafc",
  },

  highlightBox: {
    border: "2px solid #d9732d",
    background: "#fff7f1",
  },

  resultLabel: {
    display: "block",
    color: "#617080",
    fontSize: "14px",
    marginBottom: "8px",
  },

  resultValue: {
    color: "#0f2d4d",
    fontSize: "19px",
  },
};


export default PRSSteamSavingCalculator;