import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "👋 Welcome to Volfram Systems! I'm your engineering assistant. I can help you with PRDS Stations, Steam Pipe Sizing, and Boiler Systems. What are you looking for today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() =>
    Math.random().toString(36).substr(2, 9)
  );
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [calcResults, setCalcResults] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: userMsg,
        session_id: sessionId,
      });

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: res.data.reply },
      ]);

      if (res.data.calcResults) {
        setCalcResults(res.data.calcResults);
      }

      if (
        res.data.reply.toLowerCase().includes("submit inquiry") ||
        res.data.reply.toLowerCase().includes("your name")
      ) {
        setShowInquiryForm(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Something went wrong. Try again." },
      ]);
    }

    setLoading(false);
  };

  const submitInquiry = async () => {
    try {
      await axios.post("http://localhost:8000/api/inquiry", {
        session_id: sessionId,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        product_type: calcResults?.product,
        input_params: calcResults?.inputs,
        calc_results: calcResults?.results,
      });

      setShowInquiryForm(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "✅ Inquiry submitted! Our team will contact you within 24-48 hours.",
        },
      ]);
    } catch (err) {
      alert("Error submitting inquiry");
    }
  };

  return (
    <>
      {isOpen ? (
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.header}>
            <span style={styles.headerText}>
              Volfram Engineering Assistant
            </span>

            <span style={styles.onlineDot}>● Online</span>

            {/* Minimize */}
            <button
              style={styles.headerBtn}
              onClick={() => setIsOpen(false)}
            >
              −
            </button>
          </div>

          {/* MESSAGES */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  ...(msg.role === "user"
                    ? styles.userBubble
                    : styles.botBubble),
                }}
              >
                {msg.content}
              </div>
            ))}

            {/* CALC RESULT */}
            {calcResults && (
              <div style={styles.resultCard}>
                <h4>📊 Calculation Results</h4>

                {calcResults.results?.inlet && (
                  <>
                    <p>
                      <b>Inlet:</b>{" "}
                      {calcResults.results.inlet.lineSize}
                    </p>
                    <p>
                      <b>Outlet:</b>{" "}
                      {calcResults.results.outlet.lineSize}
                    </p>
                  </>
                )}

                {calcResults.results?.recommendedSize && (
                  <p>
                    <b>Recommended:</b>{" "}
                    {calcResults.results.recommendedSize}
                  </p>
                )}
              </div>
            )}

            {/* INQUIRY FORM */}
            {showInquiryForm && (
              <div style={styles.inquiryForm}>
                <h4>Submit Inquiry</h4>

                <input
                  style={styles.formInput}
                  placeholder="Name"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  style={styles.formInput}
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  style={styles.formInput}
                  placeholder="Phone"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      phone: e.target.value,
                    })
                  }
                />

                <button
                  style={styles.submitBtn}
                  onClick={submitInquiry}
                >
                  Submit →
                </button>
              </div>
            )}

            {loading && <div style={styles.botBubble}>Typing...</div>}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type message..."
            />

            <button style={styles.sendBtn} onClick={sendMessage}>
              Send →
            </button>
          </div>
        </div>
      ) : (
        /* FLOATING BUTTON */
        <button
          style={styles.floatingBtn}
          onClick={() => setIsOpen(true)}
        >
          💬
        </button>
      )}
    </>
  );
}

const styles = {
  container: {
    width: 420,
    height: 600,
    display: "flex",
    flexDirection: "column",
    borderRadius: 16,
    overflow: "hidden",
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    zIndex: 9999,
  },

  header: {
    background: "#1a365d",
    color: "#fff",
    padding: 12,
    display: "flex",
    alignItems: "center",
  },

  headerText: {
    flex: 1,
    fontWeight: 600,
  },

  headerBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
  },

  onlineDot: {
    color: "#68d391",
    fontSize: 12,
    marginRight: 10,
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
    background: "#f7fafc",
  },

  bubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: "80%",
  },

  botBubble: {
    background: "#fff",
  },

  userBubble: {
    background: "#2d6a9f",
    color: "#fff",
    marginLeft: "auto",
  },

  inputArea: {
    display: "flex",
    padding: 10,
  },

  input: {
    flex: 1,
    padding: 8,
  },

  sendBtn: {
    background: "#2d6a9f",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },

  floatingBtn: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#2d6a9f",
    color: "#fff",
    fontSize: 24,
    border: "none",
    cursor: "pointer",
  },
};