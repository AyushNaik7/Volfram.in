import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CondensateFlashSteamCalculator() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fuelGCV: "",
    fuelPrice: "",
    boilerEfficiency: "",
    operationalHoursPerDay: "",
    operationalDaysPerYear: "",
    condensateQuantity: "",
    condensatePressure: "",
    flashSteamPressure: "",
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


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
        import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000/api/calculators/condensate-flash-steam-saving",
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
      fuelGCV: "",
      fuelPrice: "",
      boilerEfficiency: "",
      operationalHoursPerDay: "",
      operationalDaysPerYear: "",
      condensateQuantity: "",
      condensatePressure: "",
      flashSteamPressure: "",
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


        <div>

          <h1 style={styles.title}>
            Condensate & Flash Steam Saving Calculator
          </h1>

          <p style={styles.subtitle}>
            Calculate flash steam generation and annual energy savings.
          </p>

        </div>

      </div>


      <div style={styles.container}>


        {/* INPUT SECTION */}

        <div style={styles.card}>

          <h2 style={styles.sectionTitle}>
            Input Values
          </h2>


          <form onSubmit={handleCalculate}>


            <h3 style={styles.groupTitle}>
              Fuel & Boiler Details
            </h3>


            <div style={styles.grid}>


              <div>

                <label style={styles.label}>
                  GCV of Fuel (Kcal/kg)
                </label>

                <input
                  type="number"
                  name="fuelGCV"
                  value={formData.fuelGCV}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 10000"
                />

              </div>


              <div>

                <label style={styles.label}>
                  Fuel Price (Rs/kg)
                </label>

                <input
                  type="number"
                  name="fuelPrice"
                  value={formData.fuelPrice}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 50"
                />

              </div>


              <div>

                <label style={styles.label}>
                  Boiler Efficiency (%)
                </label>

                <input
                  type="number"
                  name="boilerEfficiency"
                  value={formData.boilerEfficiency}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 80"
                />

              </div>

            </div>


            <h3 style={styles.groupTitle}>
              Operating Details
            </h3>


            <div style={styles.grid}>


              <div>

                <label style={styles.label}>
                  Operating Hours per Day
                </label>

                <input
                  type="number"
                  name="operationalHoursPerDay"
                  value={formData.operationalHoursPerDay}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 8"
                />

              </div>


              <div>

                <label style={styles.label}>
                  Operating Days per Year
                </label>

                <input
                  type="number"
                  name="operationalDaysPerYear"
                  value={formData.operationalDaysPerYear}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 300"
                />

              </div>

            </div>


            <h3 style={styles.groupTitle}>
              Condensate Details
            </h3>


            <div style={styles.grid}>


              <div>

                <label style={styles.label}>
                  Quantity of Condensate (kg/hr)
                </label>

                <input
                  type="number"
                  name="condensateQuantity"
                  value={formData.condensateQuantity}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 1000"
                />

              </div>


              <div>

                <label style={styles.label}>
                  Condensate Pressure (bar g)
                </label>

                <input
                  type="number"
                  name="condensatePressure"
                  value={formData.condensatePressure}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 5"
                />

              </div>


              <div>

                <label style={styles.label}>
                  Flash Steam Pressure (bar g)
                </label>

                <input
                  type="number"
                  name="flashSteamPressure"
                  value={formData.flashSteamPressure}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 1"
                />

              </div>

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


            {/* STEAM PROPERTIES */}

            <h3 style={styles.groupTitle}>
              Steam Properties
            </h3>


            <div style={styles.resultGrid}>

              <ResultItem
                label="Condensate Temperature"
                value={
                  result.steamProperties
                    .condensateTemperature.value
                }
                unit={
                  result.steamProperties
                    .condensateTemperature.unit
                }
              />


              <ResultItem
                label="Flash Steam Temperature"
                value={
                  result.steamProperties
                    .flashSteamTemperature.value
                }
                unit={
                  result.steamProperties
                    .flashSteamTemperature.unit
                }
              />


              <ResultItem
                label="Latent Heat"
                value={
                  result.steamProperties
                    .latentHeatAtFlashPressure.value
                }
                unit={
                  result.steamProperties
                    .latentHeatAtFlashPressure.unit
                }
              />


              <ResultItem
                label="Total Heat"
                value={
                  result.steamProperties
                    .totalHeatAtFlashPressure.value
                }
                unit={
                  result.steamProperties
                    .totalHeatAtFlashPressure.unit
                }
              />

            </div>


            {/* CALCULATION DETAILS */}

            <h3 style={styles.groupTitle}>
              Calculation Details
            </h3>


            <div style={styles.resultGrid}>

              <ResultItem
                label="Differential Temperature"
                value={
                  result.calculationSteps
                    .differentialTemperature.value
                }
                unit={
                  result.calculationSteps
                    .differentialTemperature.unit
                }
              />


              <ResultItem
                label="Flash Steam Percentage"
                value={
                  result.calculationSteps
                    .flashSteamPercentage.value
                }
                unit={
                  result.calculationSteps
                    .flashSteamPercentage.unit
                }
              />


              <ResultItem
                label="Flash Steam Quantity"
                value={
                  result.calculationSteps
                    .flashSteamQuantity.value
                }
                unit={
                  result.calculationSteps
                    .flashSteamQuantity.unit
                }
              />


              <ResultItem
                label="Heat in Flash Steam"
                value={
                  result.calculationSteps
                    .heatInFlashSteam.value
                }
                unit={
                  result.calculationSteps
                    .heatInFlashSteam.unit
                }
              />


              <ResultItem
                label="Balance Condensate"
                value={
                  result.calculationSteps
                    .balanceCondensate.value
                }
                unit={
                  result.calculationSteps
                    .balanceCondensate.unit
                }
              />

            </div>


            {/* SAVINGS */}

            <h3 style={styles.groupTitle}>
              Annual Savings
            </h3>


            <div style={styles.resultGrid}>

              <ResultItem
                label="Annual Saving from Flash Steam"
                value={
                  result.savings
                    .annualSavingFlash.value
                }
                unit={
                  result.savings
                    .annualSavingFlash.unit
                }
              />


              <ResultItem
                label="Annual Saving from Condensate"
                value={
                  result.savings
                    .annualSavingCondensate.value
                }
                unit={
                  result.savings
                    .annualSavingCondensate.unit
                }
              />

            </div>


            {/* FINAL RESULT */}

            <div style={styles.finalResult}>

              <h2>
                Total Annual Saving
              </h2>


              <div style={styles.finalValue}>

                ₹ {result.result.totalAnnualSaving.value.toLocaleString()}

              </div>


              <p>

                {result.result.totalAnnualSaving.unit}

              </p>

            </div>


          </div>

        )}

      </div>

    </div>

  );

}


/* RESULT COMPONENT */

function ResultItem({ label, value, unit }) {

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


export default CondensateFlashSteamCalculator;