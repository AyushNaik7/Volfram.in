import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PipeWallThicknessCalculator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pipeType: "Seamless",
    materialGrade: "A335 P11",
    designPressure: "",
    operatingTemperature: "",
    nominalPipeSize: "4",
    pipeSchedule: "SCH 40",
    mechanicalAllowance: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // CALCULATE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/pipe-wall-thickness",
        {
          pipeType: formData.pipeType,
          materialGrade: formData.materialGrade,
          designPressure: Number(formData.designPressure),
          operatingTemperature: Number(
            formData.operatingTemperature
          ),
          nominalPipeSize: formData.nominalPipeSize,
          pipeSchedule: formData.pipeSchedule,
          mechanicalAllowance: Number(
            formData.mechanicalAllowance
          ),
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
      }

    } catch (err) {
      console.error(
        "Pipe Wall Thickness Calculator Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Something went wrong while calculating."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // RESET
  // =====================================

  const handleReset = () => {
    setFormData({
      pipeType: "Seamless",
      materialGrade: "A335 P11",
      designPressure: "",
      operatingTemperature: "",
      nominalPipeSize: "4",
      pipeSchedule: "SCH 40",
      mechanicalAllowance: "",
    });

    setResult(null);
    setError("");
  };

  // =====================================
  // SAFETY STATUS
  // =====================================

  const isSafe =
    result?.result?.safetyStatus?.value === "SAFE";

  return (
    <div style={styles.page}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Pipe Wall Thickness Calculator
          </h1>

          <p style={styles.subtitle}>
            Calculate the required pipe wall thickness
            according to ASME B31.3 and verify whether
            the selected pipe schedule is suitable.
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

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              Design Parameters
            </h2>

            <div style={styles.inputGrid}>


              {/* PIPE TYPE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Pipe Type
                </label>

                <select
                  name="pipeType"
                  value={formData.pipeType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Seamless">
                    Seamless
                  </option>

                  <option value="Welded">
                    Welded
                  </option>
                </select>

                <small style={styles.helpText}>
                  Select the type of pipe.
                </small>
              </div>


              {/* MATERIAL */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Material Grade
                </label>

                <select
                  name="materialGrade"
                  value={formData.materialGrade}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="A335 P11">
                    A335 P11
                  </option>

                  <option value="A335 P22">
                    A335 P22
                  </option>
                </select>

                <small style={styles.helpText}>
                  Select the pipe material grade.
                </small>
              </div>


              {/* DESIGN PRESSURE */}

              <InputField
                label="Design Pressure (bar)"
                name="designPressure"
                value={formData.designPressure}
                onChange={handleChange}
                placeholder="Example: 50"
                helpText="Internal design pressure"
              />


              {/* OPERATING TEMPERATURE */}

              <InputField
                label="Operating Temperature (°C)"
                name="operatingTemperature"
                value={formData.operatingTemperature}
                onChange={handleChange}
                placeholder="Example: 400"
                helpText="Operating temperature of the pipe"
              />


              {/* NOMINAL PIPE SIZE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Nominal Pipe Size (inch)
                </label>

                <select
                  name="nominalPipeSize"
                  value={formData.nominalPipeSize}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="1/2">1/2"</option>
                  <option value="3/4">3/4"</option>
                  <option value="1">1"</option>
                  <option value="1.25">1.25"</option>
                  <option value="1.5">1.5"</option>
                  <option value="2">2"</option>
                  <option value="2.5">2.5"</option>
                  <option value="3">3"</option>
                  <option value="4">4"</option>
                  <option value="5">5"</option>
                  <option value="6">6"</option>
                  <option value="8">8"</option>
                  <option value="10">10"</option>
                  <option value="12">12"</option>
                </select>

                <small style={styles.helpText}>
                  Nominal pipe size.
                </small>
              </div>


              {/* PIPE SCHEDULE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Pipe Schedule
                </label>

                <select
                  name="pipeSchedule"
                  value={formData.pipeSchedule}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="SCH 40">
                    SCH 40
                  </option>

                  <option value="SCH 80">
                    SCH 80
                  </option>

                  <option value="SCH 160">
                    SCH 160
                  </option>
                </select>

                <small style={styles.helpText}>
                  Selected pipe wall thickness schedule.
                </small>
              </div>


              {/* MECHANICAL ALLOWANCE */}

              <InputField
                label="Mechanical Allowance (mm)"
                name="mechanicalAllowance"
                value={formData.mechanicalAllowance}
                onChange={handleChange}
                placeholder="Example: 1"
                helpText="Additional mechanical/corrosion allowance"
              />

            </div>


            {/* ================= BUTTONS ================= */}

            <div style={styles.buttonContainer}>

              <button
                type="submit"
                style={styles.calculateButton}
                disabled={loading}
              >
                {loading
                  ? "Calculating..."
                  : "Calculate Thickness"}
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
          <div style={styles.errorBox}>
            {error}
          </div>
        )}


        {/* ================= RESULTS ================= */}

        {result && (

          <div style={styles.resultCard}>

            <h2 style={styles.resultHeading}>
              Calculation Results
            </h2>


            {/* SAFETY STATUS */}

            <div
              style={{
                ...styles.statusBox,
                ...(isSafe
                  ? styles.safeBox
                  : styles.notSafeBox),
              }}
            >
              <h2 style={styles.statusTitle}>
                {isSafe
                  ? "✓ PIPE DESIGN IS SAFE"
                  : "⚠ PIPE DESIGN IS NOT SAFE"}
              </h2>

              <p style={styles.statusText}>
                {result.result.designStatus.value}
              </p>
            </div>


            {/* ================= INPUT SUMMARY ================= */}

            <h3 style={styles.sectionTitle}>
              Input Summary
            </h3>

            <div style={styles.resultGrid}>

              {Object.entries(result.inputs).map(
                ([key, item]) => (
                  <ResultBox
                    key={key}
                    label={formatLabel(key)}
                    value={
                      item.unit
                        ? `${item.value} ${item.unit}`
                        : item.value
                    }
                  />
                )
              )}

            </div>


            {/* ================= MATERIAL PROPERTIES ================= */}

            <h3 style={styles.sectionTitle}>
              Material Properties
            </h3>

            <div style={styles.resultGrid}>

              {Object.entries(
                result.materialProperties
              ).map(([key, item]) => (
                <ResultBox
                  key={key}
                  label={formatLabel(key)}
                  value={
                    item.unit
                      ? `${item.value} ${item.unit}`
                      : item.value
                  }
                />
              ))}

            </div>


            {/* ================= PIPE PROPERTIES ================= */}

            <h3 style={styles.sectionTitle}>
              Pipe Properties
            </h3>

            <div style={styles.resultGrid}>

              {Object.entries(
                result.pipeProperties
              ).map(([key, item]) => (
                <ResultBox
                  key={key}
                  label={formatLabel(key)}
                  value={
                    item.unit
                      ? `${item.value} ${item.unit}`
                      : item.value
                  }
                />
              ))}

            </div>


            {/* ================= CALCULATION DETAILS ================= */}

            <h3 style={styles.sectionTitle}>
              Calculation Details
            </h3>

            <div style={styles.resultGrid}>

              {Object.entries(
                result.calculationSteps
              ).map(([key, item]) => (

                <ResultBox
                  key={key}
                  label={formatLabel(key)}
                  value={`${item.value} ${item.unit}`}
                  highlight={
                    key === "requiredWallThickness"
                  }
                />

              ))}

            </div>


            {/* ================= FINAL RESULT ================= */}

            <h3 style={styles.sectionTitle}>
              Final Design Result
            </h3>

            <div style={styles.finalResultGrid}>

              <ResultBox
                label="Safety Status"
                value={
                  result.result.safetyStatus.value
                }
                highlight={true}
              />

              <ResultBox
                label="Design Status"
                value={
                  result.result.designStatus.value
                }
                highlight={true}
              />

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


// =====================================
// INPUT FIELD COMPONENT
// =====================================

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  helpText,
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
        min="0"
        step="any"
        required
        style={styles.input}
      />

      <small style={styles.helpText}>
        {helpText}
      </small>

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

  header: {
    maxWidth: "1150px",
    margin: "0 auto 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  container: {
    maxWidth: "1150px",
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
    maxWidth: "750px",
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
    marginTop: 0,
    marginBottom: "25px",
    color: "#0f2d4d",
    fontFamily: "'Sora', sans-serif",
  },

  inputGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
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
    background: "#ffffff",
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
    marginTop: "35px",
    marginBottom: "15px",
    color: "#0f2d4d",
    fontSize: "20px",
  },

  statusBox: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },

  safeBox: {
    background: "#e8f7ee",
    border: "2px solid #2e9b5f",
  },

  notSafeBox: {
    background: "#fff0f0",
    border: "2px solid #d9534f",
  },

  statusTitle: {
    margin: 0,
    color: "#0f2d4d",
  },

  statusText: {
    marginBottom: 0,
    color: "#455b70",
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
      "repeat(auto-fit, minmax(280px, 1fr))",
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
    fontSize: "17px",
    lineHeight: "1.5",
  },

};


export default PipeWallThicknessCalculator;