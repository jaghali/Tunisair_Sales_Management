import { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, Euro, BadgePoundSterling } from "lucide-react";

function Devise() {
  const [currency, setCurrency] = useState("TND");
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Appel API
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/ExchangeRate/${currency}`)
      .then((res) => {
        const fetchedRate = res.data.rate;
        setRate(fetchedRate);
        setConverted((amount * fetchedRate).toFixed(2));
      })
      .catch((err) => console.error("Erreur:", err));
  }, [currency]);

  // Recalcul conversion si le montant change
  useEffect(() => {
    if (rate) {
      setConverted((amount * rate).toFixed(2));
    }
  }, [amount]);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          minWidth: "320px",
          fontFamily: "Arial",
          textAlign: "center",
        }}
      >
        <h2>Convertisseur de devises</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label>Montant (EUR):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Converti en {currency}:</label>
            <input
              type="text"
              value={converted}
              readOnly
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginTop: "5px",
                backgroundColor: "#f0f0f0",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Choisir la devise :</label>
          <div
            onClick={() => setIsOpen(!isOpen)}
            style={{
              padding: "8px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "5px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <span>{currency}</span>
            <span>{isOpen ? "▲" : "▼"}</span>
          </div>

          {isOpen && (
            <div
              style={{
                marginTop: "10px",
                borderRadius: "6px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ccc",
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "#fff",
              }}
            >
              <div
                onClick={() => handleCurrencyChange("TND")}
                style={optionStyle}
              >
                TND
              </div>
              <div
                onClick={() => handleCurrencyChange("USD")}
                style={optionStyle}
              >
                USD <DollarSign size={18} style={{ marginLeft: "8px" }} />
              </div>
              <div
                onClick={() => handleCurrencyChange("EUR")}
                style={optionStyle}
              >
                EUR <Euro size={18} style={{ marginLeft: "8px" }} />
              </div>
              <div
                onClick={() => handleCurrencyChange("GBP")}
                style={optionStyle}
              >
                GBP <BadgePoundSterling size={18} style={{ marginLeft: "8px" }}/>
              </div>
            </div>
          )}
        </div>

        {rate && (
          <p style={{ marginTop: "10px", color: "#555" }}>
            Taux : 1 EUR = <strong>{rate}</strong> {currency}
          </p>
        )}
      </div>
    </div>
  );
}

const optionStyle = {
  padding: "10px ",
  borderBottom: "1px solid #eee",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default Devise;
