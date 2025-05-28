"use client";
import { TextField , InputAdornment} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { PanelContextProvider, Content } from "./ResizablePanel";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Hash , Mail  } from 'lucide-react';
import { useToast } from "./toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState(""); // added matricule state
  const [state, setState] = useState("form"); // "form" or "success"
  const [errorMessage, setErrorMessage] = useState("");
    const { showToast } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/PN/forgot-password", {
        Email: email,
        Matricule: matricule,  // send matricule along with email
      });

      if (response.data.success) {
        setState("success");
      } else {
        showToast("Unable to reset password. Please try again.");
      }
    } catch (error) {
      showToast("Failed to send reset email. Please check your information.");
    }
  };

  const styles = {
    backgroundWrapper: {
      width: "80%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      background: "linear-gradient(to right, #c80505 50%, white 50%)",
    },
    container: {
      fontFamily: "Roboto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100vh",
    },
    formWrapper: {
      width: "100%",
      maxWidth: "400px",
      padding: "25px",
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    TextField: {
                width: "94%",
                marginBottom: "12px",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "left",
            },
    input: {
      marginBottom: "12px",
      width: "94%",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#c80505",
      color: "#fff",
      borderRadius: "20px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "5%",
      border: "none",
    },
    error: {
      marginTop: "12px",
      color: "red",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.backgroundWrapper}>
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#3D3D3D" }}>
            RESET PASSWORD
          </h2>

          <PanelContextProvider value={state}>
            <form onSubmit={handleReset}>
              <Content value="form">
  <TextField
    label="Matricule"
     variant="standard"
    onChange={(e) => setMatricule(e.target.value)}
        required
        style={styles.TextField}
        InputLabelProps={{
            style: { color: "#3D3D3D" },
        }}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <Hash  style={{ color: "gray" }} />
                </InputAdornment>
            ),
            sx: {
                "&:before": { borderBottom: "2px solid #3D3D3D" }, // Change default border to red
                "&:hover:before": { borderBottom: "2px solid red" }, // Darker red on hover
                "&:after": { borderBottom: "2px solid red" }, // Active state border
            },
        }}
    />

  <TextField
    label="Email address"
    type="email"
    value={email}
    variant="standard"
      onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.TextField}
        InputLabelProps={{
            style: { color: "#3D3D3D" },
        }}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <Mail  style={{ color: "gray" }} />
                </InputAdornment>
            ),
            sx: {
                "&:before": { borderBottom: "2px solid #3D3D3D" }, // Change default border to red
                "&:hover:before": { borderBottom: "2px solid red" }, // Darker red on hover
                "&:after": { borderBottom: "2px solid red" }, // Active state border
            },
        }}
    />


                <button type="submit" disabled={!email || !matricule} style={styles.button}>
                  Reset your password
                </button>
                {errorMessage && <p style={styles.error}>{errorMessage}</p>}
              </Content>

             <Content value="success">
                <div
                    style={{
                    minHeight: 50,
                    padding: "20px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    color: "green",
                    fontWeight: "600",
                    fontSize: 18,
                    }}
                >
                    <IoCheckmarkCircleOutline size={32} />
                    <p style={{ margin: 0 }}>Email sent ! Please check your inbox.</p>
                </div>
                </Content>


            </form>
          </PanelContextProvider>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
