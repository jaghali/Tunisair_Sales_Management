import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { TextField, InputAdornment } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const ForgotPassword = () => {
    const [matricule, setMatricule] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showEmail, setShowEmail] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
           const response = await axios.post("http://localhost:5000/api/PN/forgot-password", {
    Matricule: matricule,
    Email: email,
});



            if (response.data.success) {
                setSuccessMessage("A new password has been sent to your email.");
            } else {
                setErrorMessage("Unable to reset password. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Failed to send reset email. Please check your information.");
        }
    };

    const styles = {
        container: {
            fontFamily: "Roboto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
        },
        backgroundWrapper: {
            width: "80%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "linear-gradient(to right, #c80505 50%, white 50%)",
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
        },
        error: {
            marginTop: "12px",
            color: "red",
            textAlign: "center",
        },
        success: {
            marginTop: "12px",
            color: "green",
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
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                        <TextField
                            type="text"
                            variant="standard"
                            label="Matricule"
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
                            required
                            style={styles.TextField}
                            InputLabelProps={{ style: { color: "#3D3D3D" } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <PersonOutlineIcon style={{ color: "gray" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            type={showEmail ? "text" : "email"}
                            variant="standard"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.TextField}
                            InputLabelProps={{ style: { color: "#3D3D3D" } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span onClick={() => setShowEmail(!showEmail)} style={{ cursor: "pointer" }}>
                                            {showEmail ? <EyeOff style={{ color: "gray" }} /> : <Eye style={{ color: "gray" }} />}
                                        </span>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <button type="submit" style={styles.button}>Send Email</button>
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                        {successMessage && <p style={styles.success}>{successMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
