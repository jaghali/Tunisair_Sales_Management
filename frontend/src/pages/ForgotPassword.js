import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setSuccessMessage("A new password has been sent to your email.");
        } catch (error) {
            setErrorMessage("Error sending email. Please try again.");
        }
    };

    const styles = {
        container: {
            fontFamily: "Roboto",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            color: "white",
            position: "relative",
            marginTop: "10%",
            maxheight: "200",
            marginLeft: "-10%",
        },
        formWrapper: {
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
            padding: "25px",
            height: "30%",
            maxheight: "200",
            backgroundColor: "#3D3D3D",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
        },
        input: {
            width: "94%",
            marginBottom: "12px",
            padding: "12px",
            color: "#1a202c",
            borderRadius: "8px",
            border: "1px solid #4a5568",
            outline: "none",
        },
        button: {
            width: "100%",
            padding: "12px",
            backgroundColor: "#c80505",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
        },
        message: {
            marginTop: "12px",
            color: "green",
            textAlign: "center",
        },
        error: {
            marginTop: "12px",
            color: "red",
            textAlign: "center",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Forgot Password</h2>
                <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column" }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>
                        Reset Password
                    </button>
                    {successMessage && <p style={styles.message}>{successMessage}</p>}
                    {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
