import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LiquidPipeCalculator() {
  const navigate = useNavigate();

  // ===============================
  // PIPE DIAMETER STATES
  // ===============================

  const [diameterForm, setDiameterForm] = useState({
    flowRate: "",
    velocity: "",
  });

  const [diameterResult, setDiameterResult] = useState(null);
  const [diameterError, setDiameterError] = useState("");
  const [diameterLoading, setDiameterLoading] = useState(false);


  // ===============================
  // PIPE CAPACITY STATES
  // ===============================

  const [capacityForm, setCapacityForm] = useState({
    pipeDiameter: "",
    velocity: "",
  });

  const [capacityResult, setCapacityResult] = useState(null);
  const [capacityError, setCapacityError] = useState("");
  const [capacityLoading, setCapacityLoading] = useState(false);


  // ===============================
  // HANDLE DIAMETER INPUT CHANGE
  // ===============================

  const handleDiameterChange = (e) => {
    const { name, value } = e.target;

    setDiameterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ===============================
  // HANDLE CAPACITY INPUT CHANGE
  // ===============================

  const handleCapacityChange = (e) => {
    const { name, value } = e.target;

    setCapacityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ===============================
  // CALCULATE PIPE DIAMETER
  // ===============================

  const calculateDiameter = async (e) => {
    e.preventDefault();

    setDiameterLoading(true);
    setDiameterError("");
    setDiameterResult(null);

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/liquid-pipe/diameter",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(diameterForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Calculation failed"
        );
      }

      setDiameterResult(data.data);

    } catch (error) {

      console.error(error);
      setDiameterError(error.message);

    } finally {

      setDiameterLoading(false);

    }
  };


  // ===============================
  // CALCULATE PIPE CAPACITY
  // ===============================

  const calculateCapacity = async (e) => {
    e.preventDefault();

    setCapacityLoading(true);
    setCapacityError("");
    setCapacityResult(null);

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/liquid-pipe/capacity",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(capacityForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Calculation failed"
        );
      }

      setCapacityResult(data.data);

    } catch (error) {

      console.error(error);
      setCapacityError(error.message);

    } finally {

      setCapacityLoading(false);

    }
  };


  // ===============================
  // RESET DIAMETER CALCULATOR
  // ===============================

  const resetDiameter = () => {
    setDiameterForm({
      flowRate: "",
      velocity: "",
    });

    setDiameterResult(null);
    setDiameterError("");
  };


  // ===============================
  // RESET CAPACITY CALCULATOR
  // ===============================

  const resetCapacity = () => {
    setCapacityForm({
      pipeDiameter: "",
      velocity: "",
    });

    setCapacityResult(null);
    setCapacityError("");
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
          Liquid Flow Pipe Calculator
        </h1>

        <p style={styles.subtitle}>
          Calculate required pipe diameter and liquid flow capacity.
        </p>

      </div>


      <div style={styles.container}>


        {/* ================================= */}
        {/* CALCULATOR 1: PIPE DIAMETER */}
        {/* ================================= */}

        <div style={styles.card}>

          <h2 style={styles.sectionTitle}>
            Calculate Required Pipe Diameter
          </h2>

          <p style={styles.description}>
            Enter liquid flow rate and desired velocity.
          </p>


          <form onSubmit={calculateDiameter}>

            <div style={styles.grid}>

              <InputField
                label="Liquid Flow Rate (m³/hr)"
                name="flowRate"
                value={diameterForm.flowRate}
                onChange={handleDiameterChange}
                placeholder="Example: 100"
              />

              <InputField
                label="Liquid Velocity (m/s)"
                name="velocity"
                value={diameterForm.velocity}
                onChange={handleDiameterChange}
                placeholder="Example: 2"
              />

            </div>


            <div style={styles.buttonContainer}>

              <button
                type="submit"
                style={styles.calculateButton}
                disabled={diameterLoading}
              >
                {diameterLoading
                  ? "Calculating..."
                  : "Calculate Diameter"}
              </button>


              <button
                type="button"
                style={styles.resetButton}
                onClick={resetDiameter}
              >
                Reset
              </button>

            </div>

          </form>


          {/* DIAMETER ERROR */}

          {diameterError && (
            <div style={styles.error}>
              {diameterError}
            </div>
          )}


          {/* DIAMETER RESULT */}

          {diameterResult && (

            <div style={styles.resultSection}>

              <h3 style={styles.resultHeading}>
                Calculation Details
              </h3>


              <div style={styles.resultGrid}>

                <ResultItem
                  label="Flow Rate per Second"
                  value={
                    diameterResult.calculationSteps
                      .flowRatePerSecond.value
                  }
                  unit={
                    diameterResult.calculationSteps
                      .flowRatePerSecond.unit
                  }
                />


                <ResultItem
                  label="Pipe Diameter"
                  value={
                    diameterResult.calculationSteps
                      .pipeDiameterMeter.value
                  }
                  unit={
                    diameterResult.calculationSteps
                      .pipeDiameterMeter.unit
                  }
                />

              </div>


              <div style={styles.finalResult}>

                <h3 style={styles.finalTitle}>
                  Required Pipe Diameter
                </h3>

                <div style={styles.finalValue}>

                  {
                    diameterResult.result
                      .pipeDiameterMm.value
                  }

                  {" "}

                  {
                    diameterResult.result
                      .pipeDiameterMm.unit
                  }

                </div>

              </div>

            </div>

          )}

        </div>


        {/* ================================= */}
        {/* CALCULATOR 2: PIPE CAPACITY */}
        {/* ================================= */}

        <div style={styles.card}>

          <h2 style={styles.sectionTitle}>
            Calculate Pipe Flow Capacity
          </h2>

          <p style={styles.description}>
            Enter pipe diameter and liquid velocity.
          </p>


          <form onSubmit={calculateCapacity}>

            <div style={styles.grid}>

              <InputField
                label="Pipe Diameter (mm)"
                name="pipeDiameter"
                value={capacityForm.pipeDiameter}
                onChange={handleCapacityChange}
                placeholder="Example: 133"
              />

              <InputField
                label="Liquid Velocity (m/s)"
                name="velocity"
                value={capacityForm.velocity}
                onChange={handleCapacityChange}
                placeholder="Example: 2"
              />

            </div>


            <div style={styles.buttonContainer}>

              <button
                type="submit"
                style={styles.calculateButton}
                disabled={capacityLoading}
              >
                {capacityLoading
                  ? "Calculating..."
                  : "Calculate Capacity"}
              </button>


              <button
                type="button"
                style={styles.resetButton}
                onClick={resetCapacity}
              >
                Reset
              </button>

            </div>

          </form>


          {/* CAPACITY ERROR */}

          {capacityError && (
            <div style={styles.error}>
              {capacityError}
            </div>
          )}


          {/* CAPACITY RESULT */}

          {capacityResult && (

            <div style={styles.resultSection}>

              <h3 style={styles.resultHeading}>
                Calculation Details
              </h3>


              <div style={styles.resultGrid}>

                <ResultItem
                  label="Pipe Diameter"
                  value={
                    capacityResult.calculationSteps
                      .pipeDiameterMeter.value
                  }
                  unit={
                    capacityResult.calculationSteps
                      .pipeDiameterMeter.unit
                  }
                />


                <ResultItem
                  label="Cross Sectional Area"
                  value={
                    capacityResult.calculationSteps
                      .crossSectionalArea.value
                  }
                  unit={
                    capacityResult.calculationSteps
                      .crossSectionalArea.unit
                  }
                />


                <ResultItem
                  label="Flow Capacity"
                  value={
                    capacityResult.calculationSteps
                      .flowCapacityPerSecond.value
                  }
                  unit={
                    capacityResult.calculationSteps
                      .flowCapacityPerSecond.unit
                  }
                />

              </div>


              <div style={styles.finalResult}>

                <h3 style={styles.finalTitle}>
                  Pipe Flow Capacity
                </h3>

                <div style={styles.finalValue}>

                  {
                    capacityResult.result
                      .flowCapacityPerHour.value
                  }

                  {" "}

                  {
                    capacityResult.result
                      .flowCapacityPerHour.unit
                  }

                </div>


                <p style={styles.finalSubValue}>

                  {
                    capacityResult.result
                      .flowCapacityPerSecond.value
                  }

                  {" "}

                  {
                    capacityResult.result
                      .flowCapacityPerSecond.unit
                  }

                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* ================================= */
/* INPUT FIELD COMPONENT */
/* ================================= */

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
        step="any"
        style={styles.input}
      />

    </div>

  );
}


/* ================================= */
/* RESULT ITEM COMPONENT */
/* ================================= */

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


/* ================================= */
/* STYLES */
/* ================================= */

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

  sectionTitle: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "8px",
  },

  description: {
    color: "#455b70",
    marginBottom: "25px",
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
    marginTop: "25px",
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

  error: {
    marginTop: "20px",
    background: "#ffe5e5",
    color: "#b42318",
    padding: "15px",
    borderRadius: "8px",
  },

  resultSection: {
    marginTop: "30px",
  },

  resultHeading: {
    color: "#146c8a",
    marginBottom: "15px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
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
    marginBottom: "8px",
  },

  resultValue: {
    color: "#0f2d4d",
    fontWeight: "700",
    fontSize: "18px",
  },

  finalResult: {
    marginTop: "25px",
    padding: "25px",
    textAlign: "center",
    background: "#0f2d4d",
    color: "#ffffff",
    borderRadius: "12px",
  },

  finalTitle: {
    margin: 0,
  },

  finalValue: {
    fontSize: "32px",
    fontWeight: "700",
    marginTop: "12px",
  },

  finalSubValue: {
    marginTop: "10px",
    opacity: 0.85,
  },

};


export default LiquidPipeCalculator;