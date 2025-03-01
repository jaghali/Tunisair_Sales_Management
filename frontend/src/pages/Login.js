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
                navigate(response.data.redirect);
            }
        } catch (error) {
            setErrorMessage("Invalid credentials.");
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
            marginTop:"10%",
            maxheight: "200",
            marginLeft : "-10%",

        },
        formWrapper: {
            justifyContent: "center",

            width: "100%",
            maxWidth: "400px",
            padding: "25px",
            height:"35%",
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
            backgroundColor: '#c80505',
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
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
                <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Login</h2>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
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
                    <button type="submit" style={styles.button}>
                        Login
                    </button>
                    {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};
export default LoginPage;
