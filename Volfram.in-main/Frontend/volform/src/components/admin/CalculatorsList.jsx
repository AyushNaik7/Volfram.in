import { useNavigate } from "react-router-dom";

function CalculatorsList() {
    const navigate = useNavigate();

    const calculators = [
        {
            id: 1,
            name: "Saturated Steam Pipe Size Calculator",
            description:
                "Calculate required pipe size and steam flow capacity.",
            path: "/admin/calculators/saturated-steam-pipe"
        },
        {
        id: 2,
        name: "Safety Valve Orifice Calculator",
        description:
            "Calculate required safety valve orifice area and diameter.",
        path: "/admin/calculators/safety-valve-orifice",
        icon: "🛡️"
    },{
    id: 3,
    name: "Condensate & Flash Steam Saving Calculator",
    description:
        "Calculate flash steam generation and annual energy savings.",
    path: "/admin/calculators/condensate-flash-steam-saving",
    icon: "💧"
},
{
    id: 4,
    name: "Boiler Direct Efficiency Calculator",
    description:
        "Calculate boiler efficiency and steam generation cost.",
    path: "/admin/calculators/boiler-direct-efficiency"
},
{
  id: 5,
  name: "Blow Down Saving Calculator",
  description:
    "Calculate potential fuel and energy savings by reducing excess boiler blow down.",
  path: "/admin/calculators/blow-down-saving"
},
{
  id: 6,
  name: "Steam Requirement for Process Heating",
  description:
    "Calculate the steam required for heating a process medium.",
  path: "/admin/calculators/steam-requirement-process-heating"
},
{
  id: 7,
  name: "Air Cooling Load Calculator",
  description:
    "Calculate cooling load and required chilled water flow rate.",
  path: "/admin/calculators/air-cooling-load"
},
{
  id: 8,
  name: "Liquid Flow Pipe Calculator",
  description:
    "Calculate required pipe diameter and liquid flow capacity.",
  path: "/admin/calculators/liquid-pipe"
},
{
  id: 9,
  name: "Steam Required for Evaporation",
  description:
    "Calculate steam consumption required for heating and evaporation.",
  path: "/admin/calculators/steam-required-evaporation"
},
{
  id: 10,
  name: "Feed Water Tank Final Temperature Calculator",
  description:
    "Calculate the final feed water temperature after mixing condensate, fresh water, and flash steam.",
  path: "/admin/calculators/feed-water-tank-temperature"
},
{
  id: 11,
  name: "Tank Dimensions & Weight Calculator",
  description:
    "Calculate rectangular or circular tank dimensions and estimated steel weight.",
  path: "/admin/calculators/tank-dimensions-weight"
},
{
  id: 12,
  name: "Heating & Cooling System Calculator",
  description:
    "Calculate steam requirements, chilled water flow and pipeline sizes.",
  path: "/admin/calculators/heating-cooling-system"
},
{
  id: 13,
  name: "Material Weight Calculator",
  description:
    "Calculate the weight of pipes, bars, plates, tubes and structural sections.",
  path: "/admin/calculators/weight-calculator"
}
,
{
  id: 14,
  name: "Steam Saving in PRS Calculator",
  description:
    "Calculate steam flow requirements and potential steam savings using a Pressure Reducing Station.",
  path: "/admin/calculators/prs-steam-saving"
},
{
  id: 15,
  name: "Superheated Steam Pipe Size Calculator",
  description:
    "Calculate the required pipe diameter for superheated steam based on pressure, temperature, flow rate, and velocity.",
  path: "/admin/calculators/superheated-steam-pipe"
},
{
  id: 16,
  name: "Pipe Wall Thickness Calculator",
  description:
    "Calculate required pipe wall thickness according to ASME B31.3 and verify whether the selected schedule is safe.",
  path: "/admin/calculators/pipe-wall-thickness"
}
    
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Calculators</h2>

                    <p style={styles.subtitle}>
                        Select a calculator to perform engineering calculations.
                    </p>
                </div>
            </div>

            <div style={styles.grid}>
                {calculators.map((calculator) => (
                    <div
                        key={calculator.id}
                        style={styles.card}
                    >
                        <div style={styles.icon}>
                            🧮
                        </div>

                        <h3 style={styles.cardTitle}>
                            {calculator.name}
                        </h3>

                        <p style={styles.description}>
                            {calculator.description}
                        </p>

                        <button
                            style={styles.button}
                            onClick={() =>
                                navigate(calculator.path)
                            }
                        >
                            Open Calculator →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "10px"
    },

    header: {
        marginBottom: "30px"
    },

    title: {
        fontFamily: "'Sora', sans-serif",
        color: "#0f2d4d",
        marginBottom: "8px"
    },

    subtitle: {
        color: "#455b70",
        fontFamily: "'Barlow', sans-serif"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px"
    },

    card: {
        background: "#ffffff",
        border: "1px solid #d5dee7",
        borderRadius: "12px",
        padding: "25px",
        transition: "0.2s"
    },

    icon: {
        fontSize: "35px",
        marginBottom: "15px"
    },

    cardTitle: {
        fontFamily: "'Sora', sans-serif",
        color: "#0f2d4d",
        marginBottom: "10px"
    },

    description: {
        color: "#455b70",
        lineHeight: "1.6",
        marginBottom: "20px"
    },

    button: {
        background: "#0f2d4d",
        color: "#ffffff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontFamily: "'Barlow', sans-serif",
        fontWeight: "600"
    }
};

export default CalculatorsList;