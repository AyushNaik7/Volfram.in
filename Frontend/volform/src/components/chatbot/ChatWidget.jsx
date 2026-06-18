import { useState, useEffect, useRef } from "react";
import axios from "axios";

// ─── SUGGESTED QUESTIONS ─────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  { label: "What products do you offer?", category: "products" },
  { label: "What industries do you serve?", category: "company" },
  { label: "Where are your offices?", category: "company" },
  { label: "How do I contact Volfram?", category: "contact" },
  { label: "What is a PRDS station?", category: "technical" },
  { label: "Tell me about steam audit services", category: "services" },
  { label: "What is the Smart Boiler Controller?", category: "products" },
  { label: "What is condensate recovery?", category: "technical" },
  { label: "Who are your distribution partners?", category: "company" },
  { label: "What is your experience?", category: "company" },
  { label: "Do you offer maintenance support?", category: "services" },
  { label: "What boiler types do you supply?", category: "products" },
];

// ─── GUIDED QUOTATION FLOW ────────────────────────────────────────────────────
const FLOW = {
  start: {
    id: "start",
    message: "Which product do you need a quotation for?",
    type: "buttons",
    options: ["PRDS Station", "Steam Pipe Sizing", "Boiler System"],
    next: (val) => {
      if (val === "PRDS Station") return "prds_flow";
      if (val === "Steam Pipe Sizing") return "pipe_flow";
      if (val === "Boiler System") return "boiler_flow";
    },
  },

  // ── PRDS ──
  prds_flow: {
    id: "prds_flow",
    message: "What is the steam flow rate?",
    type: "number", placeholder: "e.g. 9000", unit: "kg/hr", param: "flowRate",
    next: "prds_inlet_pressure",
  },
  prds_inlet_pressure: {
    id: "prds_inlet_pressure",
    message: "What is the inlet pressure?",
    type: "number", placeholder: "e.g. 18", unit: "bar (g)", param: "inletPressure",
    next: "prds_steam_type",
  },
  prds_steam_type: {
    id: "prds_steam_type",
    message: "Is the inlet steam saturated or superheated?",
    type: "buttons", options: ["Saturated", "Superheated"], param: "steamType",
    next: (val) => val === "Superheated" ? "prds_inlet_temp" : "prds_outlet_pressure",
  },
  prds_inlet_temp: {
    id: "prds_inlet_temp",
    message: "What is the inlet steam temperature?",
    type: "number", placeholder: "e.g. 350", unit: "°C", param: "inletTemp",
    next: "prds_outlet_pressure",
  },
  prds_outlet_pressure: {
    id: "prds_outlet_pressure",
    message: "What is the required outlet pressure?",
    type: "number", placeholder: "e.g. 4", unit: "bar (g)", param: "outletPressure",
    next: "prds_outlet_temp_type",
  },
  prds_outlet_temp_type: {
    id: "prds_outlet_temp_type",
    message: "What outlet temperature do you require?",
    type: "buttons", options: ["Saturation temperature", "Custom temperature"], param: "outletTempType",
    next: (val) => val === "Custom temperature" ? "prds_outlet_temp" : "prds_water_temp",
  },
  prds_outlet_temp: {
    id: "prds_outlet_temp",
    message: "What is the required outlet temperature?",
    type: "number", placeholder: "e.g. 200", unit: "°C", param: "outletTemp",
    next: "prds_water_temp",
  },
  prds_water_temp: {
    id: "prds_water_temp",
    message: "What is the water injection temperature?\n(Default is 105°C if you're unsure)",
    type: "number_with_default", placeholder: "e.g. 105", defaultValue: "105", unit: "°C", param: "waterTemp",
    next: "prds_moc",
  },
  prds_moc: {
    id: "prds_moc",
    message: "What MOC (Material of Construction) do you prefer?",
    type: "buttons", options: ["Standard (A105 / A216 WCB / A106 Gr.B)", "Custom MOC"], param: "moc",
    next: "confirm",
  },

  // ── STEAM PIPE ──
  pipe_flow: {
    id: "pipe_flow",
    message: "What type of steam will flow through it?",
    type: "buttons", options: ["Saturated Steam", "Superheated Steam"], param: "steamType",
    next: "pipe_flowrate",
  },
  pipe_flowrate: {
    id: "pipe_flowrate",
    message: "What is the steam flow rate?",
    type: "number", placeholder: "e.g. 5000", unit: "kg/hr", param: "flowRate",
    next: "pipe_pressure",
  },
  pipe_pressure: {
    id: "pipe_pressure",
    message: "What is the operating pressure?",
    type: "number", placeholder: "e.g. 10", unit: "bar (g)", param: "pressure",
    next: (_, p) => p.steamType === "Superheated Steam" ? "pipe_temp" : "pipe_velocity",
  },
  pipe_temp: {
    id: "pipe_temp",
    message: "What is the steam temperature?",
    type: "number", placeholder: "e.g. 300", unit: "°C", param: "temp",
    next: "pipe_velocity",
  },
  pipe_velocity: {
    id: "pipe_velocity",
    message: "What allowable velocity do you want to use?",
    type: "buttons_with_custom",
    options: ["25 m/s (Saturated — standard)", "35 m/s (Superheated — standard)"],
    customLabel: "Enter custom velocity", customUnit: "m/s", param: "velocity",
    next: "confirm",
  },

  // ── BOILER ──
  boiler_flow: {
    id: "boiler_flow",
    message: "What is the required steam output?",
    type: "number", placeholder: "e.g. 2000", unit: "kg/hr", param: "steamOutput",
    next: "boiler_pressure",
  },
  boiler_pressure: {
    id: "boiler_pressure",
    message: "What is the required operating pressure?",
    type: "number", placeholder: "e.g. 10", unit: "bar (g)", param: "pressure",
    next: "boiler_fuel",
  },
  boiler_fuel: {
    id: "boiler_fuel",
    message: "What fuel type will be used?",
    type: "buttons",
    options: ["Natural Gas", "Furnace Oil", "Coal", "Briquette", "Rice Husk", "Petcoke", "Wood"],
    param: "fuelType",
    next: "boiler_efficiency",
  },
  boiler_efficiency: {
    id: "boiler_efficiency",
    message: "What boiler efficiency do you require?\n(Default is 85%)",
    type: "number_with_default", placeholder: "e.g. 85", defaultValue: "85", unit: "%", param: "efficiency",
    next: "boiler_fa",
  },
  boiler_fa: {
    id: "boiler_fa",
    message: "Is F&A (From and At) rating required?",
    type: "buttons", options: ["Yes", "No"], param: "faRating",
    next: "confirm",
  },

  confirm: { id: "confirm", type: "confirm", next: "done" },
  done: { id: "done", type: "end" },
};

function buildSummary(params) {
  const labels = {
    flowRate: "Flow Rate", steamOutput: "Steam Output", inletPressure: "Inlet Pressure",
    outletPressure: "Outlet Pressure", pressure: "Operating Pressure", steamType: "Steam Type",
    inletTemp: "Inlet Temp", outletTemp: "Outlet Temp", outletTempType: "Outlet Temp Type",
    waterTemp: "Water Injection Temp", moc: "MOC", fuelType: "Fuel Type",
    efficiency: "Efficiency", faRating: "F&A Rating", temp: "Temperature", velocity: "Velocity",
  };
  return Object.entries(params)
    .map(([k, v]) => `• ${labels[k] || k}: ${v}`)
    .join("\n");
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);

  // mode: null | "chat" | "quote"
  const [mode, setMode] = useState(null);

  // chat mode state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // quote mode state
  const [quoteMessages, setQuoteMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState("start");
  const [params, setParams] = useState({});
  const [numberInput, setNumberInput] = useState("");
  const [customVelocity, setCustomVelocity] = useState("");
  const [showCustomVelocity, setShowCustomVelocity] = useState(false);
  const [quoteDone, setQuoteDone] = useState(false);

  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, quoteMessages, chatLoading, mode]);

  // ── CHAT MODE: send to AI backend ─────────────────────────────────────────
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: userMsg,
        session_id: sessionId,
      });
      setChatMessages((prev) => [...prev, { role: "bot", content: res.data.reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Something went wrong. Please email steam@volfram.in directly." },
      ]);
    }
    setChatLoading(false);
  };

  // ── QUOTE MODE: advance guided flow ───────────────────────────────────────
  const advance = (value) => {
    const step = FLOW[currentStep];
    const newParams = step.param ? { ...params, [step.param]: value } : { ...params };
    let nextId = typeof step.next === "function" ? step.next(value, newParams) : step.next;
    const nextStep = FLOW[nextId];

    setParams(newParams);
    setCurrentStep(nextId);
    setNumberInput("");
    setShowCustomVelocity(false);
    setCustomVelocity("");

    let botMsg;
    if (nextStep.type === "confirm") {
      botMsg = `Here's a summary of what I've collected:\n\n${buildSummary(newParams)}\n\nShall I send this to our team for quotation?`;
    } else if (nextStep.type === "end") {
      botMsg = "✅ All details collected! Your quotation is being prepared and will be sent to your email within 24 hours.\n\nOur team may reach out if they need any clarification.";
      sendToBackend(newParams);
      setQuoteDone(true);
    } else {
      botMsg = nextStep.message;
    }

    setQuoteMessages((prev) => [
      ...prev,
      { role: "user", content: String(value) },
      { role: "bot", content: botMsg },
    ]);
  };

  const handleNumberSubmit = () => {
    if (!numberInput.trim()) return;
    const step = FLOW[currentStep];
    advance(`${numberInput} ${step.unit}`);
  };

  const sendToBackend = async (finalParams) => {
    try {
      await axios.post("http://localhost:8000/api/chat", {
        message: `Customer confirmed quotation parameters:\n${buildSummary(finalParams)}`,
        session_id: sessionId,
        customer_email: null,
      });
    } catch (e) {
      console.error("Backend error:", e);
    }
  };

  const resetAll = () => {
    setMode(null);
    setChatMessages([]);
    setQuoteMessages([]);
    setCurrentStep("start");
    setParams({});
    setQuoteDone(false);
    setNumberInput("");
  };

  // ── RENDER QUOTE STEP INPUT ───────────────────────────────────────────────
  const renderQuoteInput = () => {
    if (quoteDone) return null;
    const step = FLOW[currentStep];
    if (!step) return null;

    if (step.type === "buttons") {
      return (
        <div style={styles.buttonGrid}>
          {step.options.map((opt) => (
            <button key={opt} style={styles.optionBtn} onClick={() => advance(opt)}>{opt}</button>
          ))}
        </div>
      );
    }

    if (step.type === "number") {
      return (
        <div style={styles.numberRow}>
          <input
            style={styles.numberInput} type="number" value={numberInput}
            placeholder={step.placeholder}
            onChange={(e) => setNumberInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNumberSubmit()}
            autoFocus
          />
          <span style={styles.unitBadge}>{step.unit}</span>
          <button style={styles.sendBtn} onClick={handleNumberSubmit}>Next →</button>
        </div>
      );
    }

    if (step.type === "number_with_default") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px" }}>
          <div style={{ ...styles.numberRow, padding: 0 }}>
            <input
              style={styles.numberInput} type="number" value={numberInput}
              placeholder={step.placeholder}
              onChange={(e) => setNumberInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNumberSubmit()}
              autoFocus
            />
            <span style={styles.unitBadge}>{step.unit}</span>
            <button style={styles.sendBtn} onClick={handleNumberSubmit}>Next →</button>
          </div>
          <button style={styles.defaultBtn} onClick={() => advance(`${step.defaultValue} ${step.unit}`)}>
            Use default — {step.defaultValue} {step.unit}
          </button>
        </div>
      );
    }

    if (step.type === "buttons_with_custom") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px" }}>
          <div style={{ ...styles.buttonGrid, padding: 0 }}>
            {step.options.map((opt) => (
              <button key={opt} style={styles.optionBtn} onClick={() => advance(opt)}>{opt}</button>
            ))}
          </div>
          {!showCustomVelocity ? (
            <button style={styles.defaultBtn} onClick={() => setShowCustomVelocity(true)}>
              {step.customLabel}
            </button>
          ) : (
            <div style={{ ...styles.numberRow, padding: 0 }}>
              <input
                style={styles.numberInput} type="number" value={customVelocity}
                placeholder="Enter velocity"
                onChange={(e) => setCustomVelocity(e.target.value)}
                autoFocus
              />
              <span style={styles.unitBadge}>{step.customUnit}</span>
              <button style={styles.sendBtn} onClick={() => { if (customVelocity) advance(`${customVelocity} m/s`); }}>
                Next →
              </button>
            </div>
          )}
        </div>
      );
    }

    if (step.type === "confirm") {
      return (
        <div style={styles.buttonGrid}>
          <button
            style={{ ...styles.optionBtn, background: "#276749", color: "#fff", border: "none" }}
            onClick={() => advance("Confirmed")}>
            ✅ Yes, proceed
          </button>
          <button style={{ ...styles.optionBtn, color: "#c53030" }} onClick={resetAll}>
            ✏️ Start over
          </button>
        </div>
      );
    }

    return null;
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  const allMessages = mode === "chat" ? chatMessages : quoteMessages;

  return (
    <>
      {isOpen ? (
        <div style={styles.container}>

          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatar}>L</div>
              <div>
                <div style={styles.headerName}>Laxmi — Volfram Assistant</div>
                <div style={styles.onlineDot}>● Online</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {mode && (
                <button style={styles.resetBtn} onClick={resetAll} title="Back to start">↩</button>
              )}
              <button style={styles.headerBtn} onClick={() => setIsOpen(false)}>−</button>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={styles.messages}>

            {/* MODE SELECTION */}
            {!mode && (
              <>
                <div style={{ ...styles.bubble, ...styles.botBubble }}>
                  👋 Welcome to <strong>Volfram Systems</strong>! I'm Laxmi, your engineering assistant.{"\n\n"}I can answer questions about our products, services, steam engineering, company info, and more — or help you get a quotation.
                </div>
                <div style={styles.modeCards}>
                  <button style={styles.modeCard} onClick={() => {
                    setMode("chat");
                    setChatMessages([{
                      role: "bot",
                      content: "Great! Ask me anything — products, services, steam engineering, contact details, office locations, or technical questions. I'm here to help! �"
                    }]);
                  }}>
                    <div style={styles.modeIcon}>💬</div>
                    <div style={styles.modeTitle}>Ask a question</div>
                    <div style={styles.modeDesc}>Products, services, company info, technical details</div>
                  </button>
                  <button style={styles.modeCard} onClick={() => {
                    setMode("quote");
                    setQuoteMessages([{ role: "bot", content: FLOW["start"].message }]);
                  }}>
                    <div style={styles.modeIcon}>📋</div>
                    <div style={styles.modeTitle}>Get a quotation</div>
                    <div style={styles.modeDesc}>I know what I need — help me get a price</div>
                  </button>
                </div>
              </>
            )}

            {/* CONVERSATION MESSAGES */}
            {allMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  ...(msg.role === "user" ? styles.userBubble : styles.botBubble),
                  whiteSpace: "pre-line",
                }}
              >
                {msg.content}
              </div>
            ))}

            {/* Suggestion chips — shown inline after first bot message in chat mode */}
            {mode === "chat" && chatMessages.length === 1 && !chatLoading && (
              <div style={styles.suggestionsBlock}>
                <div style={styles.suggestionsLabel}>💡 Try asking:</div>
                <div style={styles.chipsWrapper}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q.label}
                      style={styles.chip}
                      onClick={() => {
                        const userMsg = q.label;
                        setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
                        setChatLoading(true);
                        axios.post("http://localhost:8000/api/chat", {
                          message: userMsg,
                          session_id: sessionId,
                        }).then((res) => {
                          setChatMessages((prev) => [...prev, { role: "bot", content: res.data.reply }]);
                        }).catch(() => {
                          setChatMessages((prev) => [...prev, { role: "bot", content: "❌ Something went wrong. Please email steam@volfram.in directly." }]);
                        }).finally(() => setChatLoading(false));
                      }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TYPING INDICATOR (chat mode only) */}
            {mode === "chat" && chatLoading && (
              <div style={{ ...styles.bubble, ...styles.botBubble, color: "#a0aec0", fontSize: 20, letterSpacing: 2 }}>
                •••
              </div>
            )}

            {/* QUOTE DONE — offer to continue chatting */}
            {mode === "quote" && quoteDone && (
              <div style={styles.doneCard}>
                <div>🎉 Quotation submitted! Our team will reach out within 24 hours.</div>
                <button style={styles.switchBtn} onClick={() => {
                  setMode("chat");
                  setQuoteDone(false);
                  setChatMessages([{ role: "bot", content: "Is there anything else you'd like to know? Feel free to ask! 😊" }]);
                }}>
                  Still have questions? Chat with me →
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT AREA */}
          <div style={styles.inputArea}>
            {mode === "chat" && (
              <>
                <div style={styles.numberRow}>
                  <input
                    style={styles.chatInput}
                    value={chatInput}
                    placeholder="Type your question here..."
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    disabled={chatLoading}
                    autoFocus
                  />
                  <button style={{ ...styles.sendBtn, opacity: chatLoading ? 0.5 : 1 }} onClick={sendChatMessage} disabled={chatLoading}>
                    ➤
                  </button>
                </div>
              </>
            )}
            {mode === "quote" && renderQuoteInput()}
          </div>

        </div>
      ) : (
        <button style={styles.floatingBtn} onClick={() => setIsOpen(true)}>💬</button>
      )}
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    width: 420, height: 640,
    display: "flex", flexDirection: "column",
    borderRadius: 16, overflow: "hidden",
    position: "fixed", bottom: 20, right: 20,
    background: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    zIndex: 9999,
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    background: "#1a365d", color: "#fff",
    padding: "12px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "#2d6a9f",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, color: "#fff",
  },
  headerName: { fontWeight: 600, fontSize: 14 },
  onlineDot: { color: "#68d391", fontSize: 11 },
  headerBtn: {
    background: "transparent", border: "none",
    color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1,
  },
  resetBtn: {
    background: "rgba(255,255,255,0.15)", border: "none",
    color: "#fff", fontSize: 15, cursor: "pointer",
    borderRadius: 6, padding: "3px 8px",
  },
  messages: {
    flex: 1, overflowY: "auto",
    padding: "12px 12px 4px",
    background: "#f7fafc",
    display: "flex", flexDirection: "column",
  },
  bubble: {
    padding: "10px 14px", borderRadius: 12,
    marginBottom: 8, maxWidth: "85%",
    fontSize: 14, lineHeight: 1.6,
  },
  botBubble: {
    background: "#fff", border: "1px solid #e2e8f0",
    alignSelf: "flex-start", borderBottomLeftRadius: 4,
  },
  userBubble: {
    background: "#2d6a9f", color: "#fff",
    alignSelf: "flex-end", borderBottomRightRadius: 4,
  },
  modeCards: {
    display: "flex", gap: 10, marginTop: 4, marginBottom: 8,
  },
  modeCard: {
    flex: 1, padding: "14px 12px",
    background: "#fff", border: "1.5px solid #e2e8f0",
    borderRadius: 12, cursor: "pointer",
    textAlign: "left",
    display: "flex", flexDirection: "column", gap: 4,
  },
  modeIcon: { fontSize: 22 },
  modeTitle: { fontWeight: 700, fontSize: 13, color: "#1a365d" },
  modeDesc: { fontSize: 12, color: "#718096", lineHeight: 1.4 },
  doneCard: {
    background: "#f0fff4", border: "1px solid #68d391",
    borderRadius: 12, padding: "12px 14px",
    fontSize: 14, color: "#276749", marginTop: 8,
    display: "flex", flexDirection: "column", gap: 10,
  },
  switchBtn: {
    background: "#276749", color: "#fff",
    border: "none", borderRadius: 8,
    padding: "8px 12px", fontSize: 13,
    cursor: "pointer", fontWeight: 600,
  },
  inputArea: {
    borderTop: "1px solid #e2e8f0",
    background: "#fff", minHeight: 60,
  },
  buttonGrid: {
    display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 12px",
  },
  optionBtn: {
    padding: "8px 14px", borderRadius: 20,
    border: "1.5px solid #2d6a9f",
    background: "#fff", color: "#2d6a9f",
    fontSize: 13, cursor: "pointer", fontWeight: 500,
  },
  numberRow: {
    display: "flex", alignItems: "center",
    gap: 6, padding: "10px 12px",
  },
  numberInput: {
    flex: 1, padding: "8px 10px",
    borderRadius: 8, border: "1.5px solid #e2e8f0",
    fontSize: 14, outline: "none",
  },
  chatInput: {
    flex: 1, padding: "8px 10px",
    borderRadius: 8, border: "1.5px solid #e2e8f0",
    fontSize: 14, outline: "none",
  },
  unitBadge: {
    background: "#edf2f7", color: "#4a5568",
    fontSize: 12, padding: "4px 8px",
    borderRadius: 6, whiteSpace: "nowrap",
  },
  sendBtn: {
    background: "#2d6a9f", color: "#fff",
    border: "none", padding: "8px 14px",
    borderRadius: 8, fontSize: 13,
    cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap",
  },
  defaultBtn: {
    background: "#edf2f7", color: "#4a5568",
    border: "none", padding: "7px 14px",
    borderRadius: 8, fontSize: 13,
    cursor: "pointer", textAlign: "left",
  },
  floatingBtn: {
    position: "fixed", bottom: 20, right: 20,
    width: 60, height: 60, borderRadius: "50%",
    background: "#2d6a9f", color: "#fff",
    fontSize: 24, border: "none", cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  chipsWrapper: {
    display: "flex", flexWrap: "wrap", gap: 6,
    marginTop: 6,
  },
  chip: {
    padding: "5px 11px", borderRadius: 16,
    border: "1.5px solid #bee3f8",
    background: "#ebf8ff", color: "#2b6cb0",
    fontSize: 12, cursor: "pointer", fontWeight: 500,
    whiteSpace: "nowrap", transition: "background 0.15s",
  },
  suggestionsBlock: {
    alignSelf: "flex-start",
    marginBottom: 8, maxWidth: "95%",
  },
  suggestionsLabel: {
    fontSize: 11, color: "#718096", marginBottom: 4, fontWeight: 500,
  },
};
