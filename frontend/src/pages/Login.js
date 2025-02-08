import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const LoginPage = () => {
    const [matricule, setMatricule] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate(); // Initialize navigate hook

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");  // Reset error message
        setSuccessMessage(""); // Reset success message

        // If the entered matricule and password are "0000" and "admin", redirect to admin-users
        if (matricule === "0000" && password === "admin") {
            navigate("/admin-users");  // Redirect to admin-users route
        } else {
            try {
                const response = await axios.post("http://localhost:5000/api/auth/login", {
                    matricule: matricule,
                    password: password,
                });

                console.log("Login successful:", response.data);
                localStorage.setItem("token", response.data.token);  // Store the token in localStorage

                // Show success message for successful login
                setSuccessMessage("Login successful. Redirecting to your dashboard...");
                setTimeout(() => {
                    navigate("/admin-users");  // Redirect after success message
                }, 2000);  // 2-second delay for the success message to be visible
            } catch (error) {
                console.error("Login error:", error.response?.data || error.message);
                setErrorMessage(error.response?.data?.message || "Invalid credentials.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="text"
                    placeholder="MATRICULE"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>

                {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                {successMessage && <p style={styles.success}>{successMessage}</p>}
            </form>
        </div>
    );
};

// Styles (for basic styling)
const styles = {
    container: {
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        marginBottom: "10px",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginTop: "10px",
    },
    success: {
        color: "green",
        marginTop: "10px",
    },
};

export default LoginPage;
