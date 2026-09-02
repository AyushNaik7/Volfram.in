import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WeightCalculator() {
  const navigate = useNavigate();

  const [shape, setShape] = useState("pipe");

  const [formData, setFormData] = useState({
    density: 7850,
    length: "",

    outerDiameter: "",
    thickness: "",
    diameter: "",

    width: "",
    height: "",

    webHeight: "",
    flangeLength: "",
    flangeThickness: "",
    webThickness: "",

    side: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // HANDLE SHAPE CHANGE
  // ===============================

  const handleShapeChange = (e) => {
    setShape(e.target.value);

    setResult(null);
    setError("");
  };

  // ===============================
  // CALCULATE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const requestData = {
        shape,
      };

      // Convert only filled values to Number
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== "" &&
          formData[key] !== null
        ) {
          requestData[key] = Number(formData[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:7000/api/calculators/weight-calculator",
        requestData
      );

      if (response.data.success) {
        setResult(response.data.data);
      }

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while calculating weight."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RESET
  // ===============================

  const handleReset = () => {
    setShape("pipe");

    setFormData({
      density: 7850,
      length: "",

      outerDiameter: "",
      thickness: "",
      diameter: "",

      width: "",
      height: "",

      webHeight: "",
      flangeLength: "",
      flangeThickness: "",
      webThickness: "",

      side: "",
    });

    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Material Weight Calculator
          </h1>

          <p style={styles.subtitle}>
            Calculate the weight of pipes, bars, plates,
            tubes and structural sections.
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Calculators
        </button>
      </div>


      {/* ================= CALCULATOR ================= */}

      <div style={styles.container}>

        <form onSubmit={handleSubmit}>

          <div style={styles.card}>

            {/* SHAPE SELECT */}

            <div style={styles.field}>
              <label style={styles.label}>
                Select Material Shape
              </label>

              <select
                value={shape}
                onChange={handleShapeChange}
                style={styles.input}
              >
                <option value="pipe">
                  Pipe
                </option>

                <option value="roundBar">
                  Round Bar
                </option>

                <option value="plate">
                  Plate
                </option>

                <option value="tube">
                  Square / Rectangular Tube
                </option>

                <option value="channel">
                  Channel Section
                </option>

                <option value="iSection">
                  I Section
                </option>

                <option value="angle">
                  Equal Angle
                </option>

              </select>
            </div>


            {/* ================= COMMON INPUTS ================= */}

            <div style={styles.inputGrid}>

              {/* DENSITY */}

              <InputField
                label="Material Density (kg/m³)"
                name="density"
                value={formData.density}
                onChange={handleChange}
                placeholder="7850"
              />

              {/* LENGTH */}

              <InputField
                label="Length (m)"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Example: 6"
              />

            </div>


            {/* ================= PIPE ================= */}

            {shape === "pipe" && (

              <div style={styles.inputGrid}>

                <InputField
                  label="Outer Diameter (mm)"
                  name="outerDiameter"
                  value={formData.outerDiameter}
                  onChange={handleChange}
                  placeholder="Example: 100"
                />

                <InputField
                  label="Wall Thickness (mm)"
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleChange}
                  placeholder="Example: 5"
                />

              </div>

            )}


            {/* ================= ROUND BAR ================= */}

            {shape === "roundBar" && (

              <div style={styles.inputGrid}>

                <InputField
                  label="Diameter (mm)"
                  name="diameter"
                  value={formData.diameter}
                  onChange={handleChange}
                  placeholder="Example: 50"
                />

              </div>

            )}


            {/* ================= PLATE ================= */}

            {shape === "plate" && (

              <div style={styles.inputGrid}>

                <InputField
                  label="Width (mm)"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Example: 500"
                />

                <InputField
                  label="Thickness (mm)"
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleChange}
                  placeholder="Example: 10"
                />

              </div>

            )}


            {/* ================= TUBE ================= */}

            {shape === "tube" && (

              <div style={styles.inputGrid}>

                <InputField
                  label="Width (mm)"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Example: 100"
                />

                <InputField
                  label="Height (mm)"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Example: 50"
                />

                <InputField
                  label="Wall Thickness (mm)"
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleChange}
                  placeholder="Example: 5"
                />

              </div>

            )}


            {/* ================= CHANNEL ================= */}

            {shape === "channel" && (

              <div style={styles.inputGrid}>

                <InputField
                  label="Web Height (mm)"
                  name="webHeight"
                  value={formData.webHeight}
                  onChange={handleChange}
                  placeholder="Example: 150"
                />

                <InputField
                  label="Flange Length (mm)"
                  name="flangeLength"
                  value={formData.flangeLength}
                  onChange={handleChange}
                  placeholder="Example: 75"
                />

                <InputField
                  label="Thickness (mm)"
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleChange}
                  placeholder="Example: 8"
                />

              </div>

            )}


            {/* ================= I SECTION ================= */}

            {shape === "iSection" && (

              <div style={styles.inputGrid}>

                <InputField
                  label="Section Height (mm)"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Example: 200"
                />

                <InputField
                  label="Section Width (mm)"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Example: 100"
                />

                <InputField
                  label="Flange Thickness (mm)"
                  name="flangeThickness"
                  value={formData.flangeThickness}
                  onChange={handleChange}
                  placeholder="Example: 10"
                />

                <InputField
                  label="Web Thickness (mm)"
                  name="webThickness"
                  value={formData.webThickness}
                  onChange={handleChange}
                  placeholder="Example: 8"
                />

              </div>

            )}


            {/* ================= ANGLE ================= */}

            {shape === "angle" && (

              <div style={styles.inputGrid}>

                <InputField
                  label="Side Length (mm)"
                  name="side"
                  value={formData.side}
                  onChange={handleChange}
                  placeholder="Example: 100"
                />

                <InputField
                  label="Thickness (mm)"
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleChange}
                  placeholder="Example: 10"
                />

              </div>

            )}


            {/* ================= BUTTONS ================= */}

            <div style={styles.buttonContainer}>

              <button
                type="submit"
                style={styles.calculateButton}
                disabled={loading}
              >
                {loading
                  ? "Calculating..."
                  : "Calculate Weight"}
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


        {/* ================= ERROR ================= */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* ================= RESULTS ================= */}

        {result && (

          <div style={styles.resultCard}>

            <h2 style={styles.resultHeading}>
              Calculation Result
            </h2>


            <div style={styles.resultGrid}>

              <ResultBox
                label="Shape"
                value={result.shape}
              />

              <ResultBox
                label="Material Density"
                value={`${result.density.value} ${result.density.unit}`}
              />

              <ResultBox
                label="Length"
                value={`${result.length.value} ${result.length.unit}`}
              />

              <ResultBox
                label="Total Volume"
                value={`${result.result.volume.value} ${result.result.volume.unit}`}
              />

              <ResultBox
                label="Total Weight"
                value={`${result.result.weight.value} ${result.result.weight.unit}`}
                highlight
              />

              <ResultBox
                label="Weight Per Meter"
                value={`${result.result.weightPerMeter.value} ${result.result.weightPerMeter.unit}`}
                highlight
              />

            </div>


            {/* CALCULATION DETAILS */}

            {result.calculationDetails && (

              <div style={styles.detailsSection}>

                <h3 style={styles.detailsHeading}>
                  Calculation Details
                </h3>

                <div style={styles.detailsGrid}>

                  {Object.entries(
                    result.calculationDetails
                  ).map(([key, item]) => (

                    <ResultBox
                      key={key}
                      label={formatLabel(key)}
                      value={`${item.value} ${item.unit}`}
                    />

                  ))}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}


// =====================================
// INPUT COMPONENT
// =====================================

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div style={styles.field}>

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
        required
      />

    </div>
  );
}


// =====================================
// RESULT BOX COMPONENT
// =====================================

function ResultBox({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      style={{
        ...styles.resultBox,
        ...(highlight
          ? styles.highlightBox
          : {}),
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


// =====================================
// FORMAT LABEL
// =====================================

function formatLabel(text) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) =>
      str.toUpperCase()
    );
}


// =====================================
// STYLES
// =====================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f2f5f8",
    padding: "35px",
    fontFamily: "'Barlow', sans-serif",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
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

  title: {
    margin: 0,
    color: "#0f2d4d",
    fontSize: "30px",
    fontFamily: "'Sora', sans-serif",
  },

  subtitle: {
    color: "#617080",
    marginTop: "10px",
  },

  backButton: {
    background: "#0f2d4d",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    border: "1px solid #d5dee7",
  },

  field: {
    marginBottom: "18px",
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
    borderRadius: "8px",
    border: "1px solid #c8d2dc",
    fontSize: "15px",
  },

  inputGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "25px",
  },

  calculateButton: {
    background: "#d9732d",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  resetButton: {
    background: "#fff",
    color: "#0f2d4d",
    border: "1px solid #0f2d4d",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    marginTop: "25px",
    padding: "15px",
    background: "#ffe5e5",
    color: "#b00020",
    borderRadius: "8px",
    textAlign: "center",
  },

  resultCard: {
    marginTop: "30px",
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    border: "1px solid #d5dee7",
  },

  resultHeading: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
    marginTop: 0,
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
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
    marginBottom: "8px",
    fontSize: "14px",
  },

  resultValue: {
    color: "#0f2d4d",
    fontSize: "18px",
  },

  detailsSection: {
    marginTop: "30px",
  },

  detailsHeading: {
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
  },

};


export default WeightCalculator;