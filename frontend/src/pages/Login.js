import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [matricule, setMatricule] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                Matricule: matricule,
                Password: password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);

                // Redirection vers l'interface spécifique selon le rôle
                navigate(response.data.redirect);
            }
        } catch (error) {
            setErrorMessage("Invalid credentials.");
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
            </form>
        </div>
    );
};

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
};

export default LoginPage;
