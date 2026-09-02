import { useState } from "react";
import axios from "axios";

function SafetyValveOrificeCalculator() {
  const [formData, setFormData] = useState({
    setPressure: "",
    reliefCapacity: "",
    superheatFactor: "1",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/safety-valve/orifice",
        {
          setPressure: Number(formData.setPressure),
          reliefCapacity: Number(formData.reliefCapacity),
          superheatFactor: Number(formData.superheatFactor),
        }
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

  const handleReset = () => {
    setFormData({
      setPressure: "",
      reliefCapacity: "",
      superheatFactor: "1",
    });

    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back Button */}

        <button
          style={styles.backButton}
          onClick={() => window.history.back()}
        >
          ← Back to Calculators
        </button>


        {/* Heading */}

        <h1 style={styles.title}>
          Safety Valve Orifice Calculator
        </h1>

        <p style={styles.subtitle}>
          Calculate the required safety valve orifice area and diameter.
        </p>


        <div style={styles.grid}>

          {/* INPUT CARD */}

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              Enter Calculation Values
            </h2>

            <form onSubmit={handleSubmit}>

              {/* Set Pressure */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Set Pressure (bar g)
                </label>

                <input
                  type="number"
                  name="setPressure"
                  value={formData.setPressure}
                  onChange={handleChange}
                  placeholder="Example: 10"
                  style={styles.input}
                  step="any"
                  required
                />

              </div>


              {/* Relief Capacity */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Required Relief Capacity (kg/hr)
                </label>

                <input
                  type="number"
                  name="reliefCapacity"
                  value={formData.reliefCapacity}
                  onChange={handleChange}
                  placeholder="Example: 5000"
                  style={styles.input}
                  step="any"
                  required
                />

              </div>


              {/* Superheat Factor */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Superheat Correction Factor
                </label>

                <input
                  type="number"
                  name="superheatFactor"
                  value={formData.superheatFactor}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  style={styles.input}
                  step="any"
                  required
                />

                <small style={styles.helpText}>
                  Use 1 for saturated steam.
                </small>

              </div>


              {/* Buttons */}

              <div style={styles.buttonGroup}>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.calculateButton,
                    ...(loading ? styles.disabledButton : {}),
                  }}
                >
                  {loading ? "Calculating..." : "Calculate"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  style={styles.resetButton}
                >
                  Reset
                </button>

              </div>

            </form>


            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}

          </div>


          {/* RESULT CARD */}

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              Calculation Result
            </h2>


            {!result && (
              <p style={styles.emptyResult}>
                Enter values and click Calculate.
              </p>
            )}


            {result && (

              <div>

                {/* Inputs */}

                <h3 style={styles.sectionTitle}>
                  Input Values
                </h3>

                <div style={styles.resultRow}>
                  <span>Set Pressure</span>

                  <strong>
                    {result.inputs?.setPressure} bar(g)
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span>Relief Capacity</span>

                  <strong>
                    {result.inputs?.reliefCapacity} kg/hr
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span>Superheat Factor</span>

                  <strong>
                    {result.inputs?.superheatFactor}
                  </strong>
                </div>


                {/* Constants */}

                <h3 style={styles.sectionTitle}>
                  Constants Used
                </h3>

                <div style={styles.resultRow}>
                  <span>Steam Constant</span>

                  <strong>
                    {result.constants?.steamConstant?.value}
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span>Atmospheric Pressure</span>

                  <strong>
                    {result.constants?.atmosphericPressure?.value}{" "}
                    {result.constants?.atmosphericPressure?.unit}
                  </strong>
                </div>


                {/* Calculation Steps */}

                <h3 style={styles.sectionTitle}>
                  Calculation Steps
                </h3>

                {result.calculationSteps &&
                  Object.entries(result.calculationSteps).map(
                    ([key, item]) => (

                      <div
                        key={key}
                        style={styles.resultRow}
                      >

                        <span>
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) =>
                              str.toUpperCase()
                            )}
                        </span>

                        <strong>
                          {item.value} {item.unit}
                        </strong>

                      </div>

                    )
                  )}


                {/* Final Result */}

                <div style={styles.finalResult}>

                  <h3 style={{ marginTop: 0 }}>
                    Final Result
                  </h3>

                  <p>
                    Required Orifice Diameter
                  </p>

                  <strong style={styles.bigResult}>

                    {result.result?.orificeDiameter?.value}{" "}

                    {result.result?.orificeDiameter?.unit}

                  </strong>

                </div>

              </div>

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

  backButton: {
    border: "none",
    background: "transparent",
    color: "#0f2d4d",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  },

  title: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#455b70",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    border: "1px solid #d5dee7",
    boxShadow: "0 4px 15px rgba(15,45,77,0.06)",
  },

  cardTitle: {
    color: "#0f2d4d",
    marginTop: 0,
    marginBottom: "25px",
    fontFamily: "'Sora', sans-serif",
  },

  sectionTitle: {
    color: "#0f2d4d",
    marginTop: "25px",
    marginBottom: "10px",
    fontSize: "17px",
  },

  formGroup: {
    marginBottom: "20px",
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
    border: "1px solid #d5dee7",
    borderRadius: "8px",
    fontSize: "15px",
  },

  helpText: {
    display: "block",
    marginTop: "6px",
    color: "#718096",
  },

  buttonGroup: {
    display: "flex",
    gap: "12px",
  },

  calculateButton: {
    flex: 1,
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#d9732d",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  },

  resetButton: {
    padding: "13px 20px",
    border: "1px solid #d5dee7",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f2d4d",
    fontWeight: "600",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  error: {
    color: "#c62828",
    marginTop: "15px",
  },

  emptyResult: {
    color: "#718096",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "12px 0",
    borderBottom: "1px solid #edf0f2",
  },

  finalResult: {
    marginTop: "30px",
    padding: "22px",
    background: "#fff7ed",
    borderRadius: "10px",
    border: "1px solid #fed7aa",
  },

  bigResult: {
    display: "block",
    color: "#d9732d",
    fontSize: "34px",
    marginTop: "8px",
  },

};


export default SafetyValveOrificeCalculator;