import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TankDimensionsWeightCalculator() {
  const navigate = useNavigate();

  const [tankType, setTankType] = useState("rectangular");

  const [formData, setFormData] = useState({
    capacity: "",
    length: "",
    width: "",
    diameter: "",
    thickness: "",
    steelDensity: "7850",
    numberOfEndPlates: "2",
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

  const handleTankTypeChange = (type) => {
    setTankType(type);
    setResult(null);
    setError("");
  };

  const handleCalculate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const requestBody = {
        tankType,
        capacity: Number(formData.capacity),
        thickness: Number(formData.thickness),
        steelDensity: Number(formData.steelDensity),
      };

      // Rectangular tank inputs
      if (tankType === "rectangular") {
        requestBody.length = Number(formData.length);
        requestBody.width = Number(formData.width);
      }

      // Circular tank inputs
      if (tankType === "circular") {
        requestBody.diameter = Number(formData.diameter);
        requestBody.numberOfEndPlates = Number(
          formData.numberOfEndPlates
        );
      }

      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/tank-dimensions-weight",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Calculation failed"
        );
      }

      setResult(data.data);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      capacity: "",
      length: "",
      width: "",
      diameter: "",
      thickness: "",
      steelDensity: "7850",
      numberOfEndPlates: "2",
    });

    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

        <h1 style={styles.title}>
          Tank Dimensions & Weight Calculator
        </h1>

        <p style={styles.subtitle}>
          Calculate tank dimensions, volume, surface area,
          and estimated steel weight.
        </p>


        {/* TANK TYPE BUTTONS */}

        <div style={styles.typeContainer}>

          <button
            type="button"
            onClick={() =>
              handleTankTypeChange("rectangular")
            }
            style={{
              ...styles.typeButton,
              ...(tankType === "rectangular"
                ? styles.activeTypeButton
                : {}),
            }}
          >
            ▭ Rectangular Tank
          </button>

          <button
            type="button"
            onClick={() =>
              handleTankTypeChange("circular")
            }
            style={{
              ...styles.typeButton,
              ...(tankType === "circular"
                ? styles.activeTypeButton
                : {}),
            }}
          >
            ◯ Circular Tank
          </button>

        </div>


        <div style={styles.grid}>

          {/* INPUT SECTION */}

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              Input Values
            </h2>

            <form onSubmit={handleCalculate}>

              <div style={styles.inputGroup}>
                <label>Tank Capacity (m³)</label>

                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Example: 20"
                  min="0"
                  step="any"
                  required
                  style={styles.input}
                />
              </div>


              {/* RECTANGULAR INPUTS */}

              {tankType === "rectangular" && (
                <>
                  <div style={styles.inputGroup}>
                    <label>Tank Length (m)</label>

                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      placeholder="Example: 5"
                      min="0"
                      step="any"
                      required
                      style={styles.input}
                    />
                  </div>


                  <div style={styles.inputGroup}>
                    <label>Tank Width (m)</label>

                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleChange}
                      placeholder="Example: 2"
                      min="0"
                      step="any"
                      required
                      style={styles.input}
                    />
                  </div>
                </>
              )}


              {/* CIRCULAR INPUTS */}

              {tankType === "circular" && (
                <>
                  <div style={styles.inputGroup}>
                    <label>Tank Diameter (m)</label>

                    <input
                      type="number"
                      name="diameter"
                      value={formData.diameter}
                      onChange={handleChange}
                      placeholder="Example: 2"
                      min="0"
                      step="any"
                      required
                      style={styles.input}
                    />
                  </div>


                  <div style={styles.inputGroup}>
                    <label>Number of End Plates</label>

                    <input
                      type="number"
                      name="numberOfEndPlates"
                      value={
                        formData.numberOfEndPlates
                      }
                      onChange={handleChange}
                      min="1"
                      required
                      style={styles.input}
                    />
                  </div>
                </>
              )}


              {/* COMMON INPUTS */}

              <div style={styles.inputGroup}>
                <label>Shell Thickness (mm)</label>

                <input
                  type="number"
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleChange}
                  placeholder="Example: 5"
                  min="0"
                  step="any"
                  required
                  style={styles.input}
                />
              </div>


              <div style={styles.inputGroup}>
                <label>Steel Density (kg/m³)</label>

                <input
                  type="number"
                  name="steelDensity"
                  value={formData.steelDensity}
                  onChange={handleChange}
                  required
                  min="0"
                  style={styles.input}
                />
              </div>


              {/* BUTTONS */}

              <div style={styles.buttonContainer}>

                <button
                  type="submit"
                  disabled={loading}
                  style={styles.calculateButton}
                >
                  {loading
                    ? "Calculating..."
                    : "Calculate"}
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

          </div>


          {/* RESULT SECTION */}

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              Calculation Result
            </h2>


            {error && (
              <div style={styles.errorBox}>
                {error}
              </div>
            )}


            {!result && !error && (
              <div style={styles.emptyBox}>
                Select tank type, enter values,
                and click Calculate.
              </div>
            )}


            {result && (
              <>
                {/* MAIN RESULT */}

                <div style={styles.resultBox}>

                  <p style={styles.resultLabel}>
                    Total Estimated Tank Weight
                  </p>

                  <h1 style={styles.resultValue}>
                    {
                      result.result
                        .totalTankWeight.value
                    }{" "}
                    {
                      result.result
                        .totalTankWeight.unit
                    }
                  </h1>

                </div>


                <h3 style={styles.resultHeading}>
                  Calculation Details
                </h3>


                {/* RECTANGULAR RESULTS */}

                {result.tankType === "rectangular" && (
                  <>
                    <ResultRow
                      label="Tank Height"
                      value={`${result.calculationSteps.tankHeight.value} ${result.calculationSteps.tankHeight.unit}`}
                    />

                    <ResultRow
                      label="Calculated Volume"
                      value={`${result.calculationSteps.calculatedVolume.value} ${result.calculationSteps.calculatedVolume.unit}`}
                    />

                    <ResultRow
                      label="Length × Width Plate Weight"
                      value={`${result.calculationSteps.lengthWidthPairWeight.value} ${result.calculationSteps.lengthWidthPairWeight.unit}`}
                    />

                    <ResultRow
                      label="Length × Height Plate Weight"
                      value={`${result.calculationSteps.lengthHeightPairWeight.value} ${result.calculationSteps.lengthHeightPairWeight.unit}`}
                    />

                    <ResultRow
                      label="Width × Height Plate Weight"
                      value={`${result.calculationSteps.widthHeightPairWeight.value} ${result.calculationSteps.widthHeightPairWeight.unit}`}
                    />
                  </>
                )}


                {/* CIRCULAR RESULTS */}

                {result.tankType === "circular" && (
                  <>
                    <ResultRow
                      label="Tank Length"
                      value={`${result.calculationSteps.tankLength.value} ${result.calculationSteps.tankLength.unit}`}
                    />

                    <ResultRow
                      label="Calculated Volume"
                      value={`${result.calculationSteps.calculatedVolume.value} ${result.calculationSteps.calculatedVolume.unit}`}
                    />

                    <ResultRow
                      label="Circumference"
                      value={`${result.calculationSteps.circumference.value} ${result.calculationSteps.circumference.unit}`}
                    />

                    <ResultRow
                      label="Shell Weight"
                      value={`${result.calculationSteps.shellWeight.value} ${result.calculationSteps.shellWeight.unit}`}
                    />

                    <ResultRow
                      label="End Plate Weight"
                      value={`${result.calculationSteps.endPlateWeight.value} ${result.calculationSteps.endPlateWeight.unit}`}
                    />

                    <ResultRow
                      label="Surface Area"
                      value={`${result.calculationSteps.surfaceArea.value} ${result.calculationSteps.surfaceArea.unit}`}
                    />
                  </>
                )}

              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}


function ResultRow({ label, value }) {
  return (
    <div style={styles.resultRow}>
      <span>{label}</span>
      <strong>{value}</strong>
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
    padding: "10px 18px",
    background: "#ffffff",
    border: "1px solid #d5dee7",
    borderRadius: "7px",
    cursor: "pointer",
    color: "#0f2d4d",
    fontWeight: "600",
    marginBottom: "25px",
  },

  title: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#455b70",
    marginBottom: "25px",
  },

  typeContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
  },

  typeButton: {
    padding: "12px 22px",
    border: "1px solid #d5dee7",
    borderRadius: "8px",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
    color: "#455b70",
  },

  activeTypeButton: {
    background: "#0f2d4d",
    color: "#ffffff",
    borderColor: "#0f2d4d",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    alignItems: "start",
  },

  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    border: "1px solid #d5dee7",
  },

  cardTitle: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginTop: 0,
    marginBottom: "25px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "18px",
  },

  input: {
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #cbd5df",
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
    fontWeight: "600",
    cursor: "pointer",
  },

  resetButton: {
    padding: "13px 22px",
    borderRadius: "7px",
    border: "1px solid #d5dee7",
    background: "#ffffff",
    cursor: "pointer",
  },

  resultBox: {
    background: "#f0f7fa",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "25px",
  },

  resultLabel: {
    color: "#455b70",
  },

  resultValue: {
    color: "#0f2d4d",
    margin: 0,
    fontSize: "34px",
  },

  resultHeading: {
    color: "#0f2d4d",
    marginBottom: "10px",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "13px 0",
    borderBottom: "1px solid #e4e9ed",
    color: "#455b70",
  },

  emptyBox: {
    textAlign: "center",
    padding: "70px 20px",
    color: "#7a8b99",
  },

  errorBox: {
    padding: "15px",
    background: "#fff0f0",
    color: "#c0392b",
    borderRadius: "7px",
  },
};

export default TankDimensionsWeightCalculator;