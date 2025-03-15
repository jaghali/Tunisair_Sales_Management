import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "TND", name: "Tunisian Dinar" },
  
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