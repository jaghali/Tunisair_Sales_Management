import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "TND", name: "Tunisian Dinar" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "ZAR", name: "South African Rand" },
  { code: "KRW", name: "South Korean Won" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
];

const Devise = ({ value, onChange }) => {
  return (
    <div style={styles.container}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Devise</InputLabel>
        <Select value={value} onChange={onChange} label="Devise">
          {currencies.map((currency) => (
            <MenuItem key={currency.code} value={currency.code}>
              {currency.name} ({currency.code})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Devise;

const styles = {
  container: {
    padding: "2%",
    maxWidth: "1000px",
    margin: "0 auto",
  },
};