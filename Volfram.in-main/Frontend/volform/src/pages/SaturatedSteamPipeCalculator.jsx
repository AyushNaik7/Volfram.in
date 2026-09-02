import { useState } from "react";
import axios from "axios";

function SaturatedSteamPipeCalculator() {
    const [mode, setMode] = useState("diameter");

    const [formData, setFormData] = useState({
        steamFlowRate: "",
        steamPressure: "",
        velocity: "",
        pipeDiameter: ""
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setResult(null);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setResult(null);

        try {
            let url;
            let payload;

            // Calculate Pipe Diameter
            if (mode === "diameter") {
                url =
                    "http://localhost:7000/api/calculators/saturated-steam-pipe/diameter";

                payload = {
                    steamFlowRate: Number(formData.steamFlowRate),
                    steamPressure: Number(formData.steamPressure),
                    velocity: Number(formData.velocity)
                };
            }

            // Calculate Pipe Capacity
            else {
                url =
                    "http://localhost:7000/api/calculators/saturated-steam-pipe/capacity";

                payload = {
                    steamPressure: Number(formData.steamPressure),
                    pipeDiameter: Number(formData.pipeDiameter),
                    velocity: Number(formData.velocity)
                };
            }

            const response = await axios.post(url, payload);

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

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <button
                    style={styles.backButton}
                    onClick={() => window.history.back()}
                >
                    ← Back to Calculators
                </button>

                <h1 style={styles.title}>
                    Saturated Steam Pipe Size Calculator
                </h1>

                <p style={styles.subtitle}>
                    Calculate required pipe diameter or steam flow capacity.
                </p>

                {/* Calculator Mode */}
                <div style={styles.tabs}>
                    <button
                        style={{
                            ...styles.tabButton,
                            ...(mode === "diameter"
                                ? styles.activeTab
                                : {})
                        }}
                        onClick={() => changeMode("diameter")}
                    >
                        Calculate Pipe Size
                    </button>

                    <button
                        style={{
                            ...styles.tabButton,
                            ...(mode === "capacity"
                                ? styles.activeTab
                                : {})
                        }}
                        onClick={() => changeMode("capacity")}
                    >
                        Calculate Capacity
                    </button>
                </div>

                <div style={styles.grid}>

                    {/* Input Card */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>
                            Enter Values
                        </h2>

                        <form onSubmit={handleSubmit}>

                            {mode === "diameter" && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Steam Flow Rate (kg/hr)
                                    </label>

                                    <input
                                        type="number"
                                        name="steamFlowRate"
                                        value={formData.steamFlowRate}
                                        onChange={handleChange}
                                        placeholder="Example: 1000"
                                        style={styles.input}
                                        step="any"
                                        required
                                    />
                                </div>
                            )}

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Steam Pressure (bar g)
                                </label>

                                <input
                                    type="number"
                                    name="steamPressure"
                                    value={formData.steamPressure}
                                    onChange={handleChange}
                                    placeholder="Example: 10"
                                    style={styles.input}
                                    step="any"
                                    required
                                />
                            </div>

                            {mode === "capacity" && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Pipe Internal Diameter (mm)
                                    </label>

                                    <input
                                        type="number"
                                        name="pipeDiameter"
                                        value={formData.pipeDiameter}
                                        onChange={handleChange}
                                        placeholder="Example: 100"
                                        style={styles.input}
                                        step="any"
                                        required
                                    />
                                </div>
                            )}

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Steam Velocity (m/s)
                                </label>

                                <input
                                    type="number"
                                    name="velocity"
                                    value={formData.velocity}
                                    onChange={handleChange}
                                    placeholder="Example: 25"
                                    style={styles.input}
                                    step="any"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.calculateButton,
                                    ...(loading ? styles.disabledButton : {})
                                }}
                            >
                                {loading
                                    ? "Calculating..."
                                    : "Calculate"}
                            </button>

                        </form>

                        {error && (
                            <p style={styles.error}>
                                {error}
                            </p>
                        )}
                    </div>
                    {/* Result Card */}
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

            {/* Steam Properties */}

            <h3>Steam Properties</h3>

            <div style={styles.resultRow}>
                <span>Specific Volume</span>

                <strong>
                    {result.steamProperties?.specificVolume ?? "N/A"}{" "}
                    {result.steamProperties?.unit ?? ""}
                </strong>
            </div>


            {/* Calculation Steps */}

            <h3 style={{ marginTop: "25px" }}>
                Calculation Details
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

                <h3>Final Result</h3>


                {/* Diameter Mode */}

                {mode === "diameter" ? (

                    <>

                        <p>
                            Required Pipe Diameter
                        </p>

                        <strong style={styles.bigResult}>

                            {result.result?.pipeDiameterMm?.value ?? "N/A"}{" "}

                            {result.result?.pipeDiameterMm?.unit ?? ""}

                        </strong>

                    </>

                ) : (

                    <>

                        <div style={styles.resultRow}>

                            <span>
                                Volumetric Flow Capacity
                            </span>

                            <strong>

                                {result.result?.volumetricFlowCapacity?.value ??
                                    "N/A"}{" "}

                                {result.result?.volumetricFlowCapacity?.unit ??
                                    ""}

                            </strong>

                        </div>


                        <div style={styles.resultRow}>

                            <span>
                                Mass Flow Capacity
                            </span>

                            <strong>

                                {result.result?.massFlowCapacity?.value ??
                                    "N/A"}{" "}

                                {result.result?.massFlowCapacity?.unit ??
                                    ""}

                            </strong>

                        </div>

                    </>

                )}

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
        fontFamily: "'Barlow', sans-serif"
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto"
    },

    backButton: {
        border: "none",
        background: "transparent",
        color: "#0f2d4d",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginBottom: "20px"
    },

    title: {
        color: "#0f2d4d",
        fontFamily: "'Sora', sans-serif",
        marginBottom: "8px"
    },

    subtitle: {
        color: "#455b70",
        marginBottom: "25px"
    },

    tabs: {
        display: "flex",
        gap: "12px",
        marginBottom: "25px"
    },

    tabButton: {
        padding: "12px 20px",
        border: "1px solid #d5dee7",
        borderRadius: "8px",
        cursor: "pointer",
        background: "#ffffff",
        color: "#0f2d4d",
        fontWeight: "600"
    },

    activeTab: {
        background: "#0f2d4d",
        color: "#ffffff",
        borderColor: "#0f2d4d"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "25px"
    },

    card: {
        background: "#ffffff",
        padding: "28px",
        borderRadius: "12px",
        border: "1px solid #d5dee7",
        boxShadow: "0 4px 15px rgba(15,45,77,0.06)"
    },

    cardTitle: {
        color: "#0f2d4d",
        marginTop: 0,
        marginBottom: "25px",
        fontFamily: "'Sora', sans-serif"
    },

    formGroup: {
        marginBottom: "20px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        color: "#0f2d4d",
        fontWeight: "600"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #d5dee7",
        borderRadius: "8px",
        fontSize: "15px"
    },

    calculateButton: {
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: "8px",
        background: "#d9732d",
        color: "#ffffff",
        fontWeight: "700",
        fontSize: "16px",
        cursor: "pointer"
    },

    disabledButton: {
        opacity: 0.6,
        cursor: "not-allowed"
    },

    error: {
        color: "#c62828",
        marginTop: "15px"
    },

    emptyResult: {
        color: "#718096"
    },

    resultRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        padding: "12px 0",
        borderBottom: "1px solid #edf0f2"
    },

    finalResult: {
        marginTop: "25px",
        padding: "20px",
        background: "#fff7ed",
        borderRadius: "10px",
        border: "1px solid #fed7aa"
    },

    bigResult: {
        display: "block",
        color: "#d9732d",
        fontSize: "32px",
        marginTop: "8px"
    }
};


export default SaturatedSteamPipeCalculator;