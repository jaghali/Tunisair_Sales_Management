import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import { TextField, InputAdornment } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import airplane from '../components/Images/airplane.png'; // Import the airplane image
import { useToast } from "./toast";

const LoginPage = () => {
    const [matricule, setMatricule] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();


    // Fonction pour décoder le JWT et extraire les informations
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                Matricule: matricule,
                Password: password,
            });

            if (response.data.token) {
                // Stocker le token dans localStorage
                const token = response.data.token;
                localStorage.setItem("token", response.data.token);

                // Décoder le token et extraire le rôle
                const decodedToken = parseJwt(token);
                const role = decodedToken?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                // Assurez-vous que "role" est le bon nom de la clé dans le token
                if (role) {
                    localStorage.setItem("role", role);
                }
                navigate(response.data.redirect);
            }
        } catch (error) {
            showToast("Invalid credentials.");
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const styles = {
        container: {
            fontFamily: "Roboto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
        },
        backgroundWrapper: {
            width: "60%",
            height: "100vh", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column", 
            background: "linear-gradient(to right, #c80505 50%, white 50%)",
            position: "relative",
        },
        formWrapper: {
            width: "100%",
            maxWidth: "400px",
            padding: "25px",
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            zIndex: 2, // Ensure the form is above the image
        },
        TextField: {
            width: "94%",
            marginBottom: "12px",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "left",
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
        forgotPasswordLink: {
            marginTop: "10%",
            color: "#3D3D3D",
            fontSize: "14px",
            textDecoration: "none",
            cursor: "pointer",
        },
        airplaneImage: {
            width: "90%",  // Adjust this value as needed
            marginTop: "20px",  // Add margin to separate from the form
            position: "absolute",
            bottom: "20%", 
            left: "110%",
            transform: "translateX(-50%)",  
            zIndex: 1, 
            opacity: 0.5,        
        },
    };

    return (
        <div style={styles.backgroundWrapper}>
            <div style={styles.container}>
                <div style={styles.formWrapper}>
                    <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#3D3D3D" }}>
                        LOGIN
                    </h2>
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                        {/* Matricule Field with Icon */}
                        <TextField
    type="text"
    variant="standard"
    label="Matricule"
    value={matricule}
    onChange={(e) => setMatricule(e.target.value)}
    required
    style={styles.TextField}
    InputLabelProps={{
        style: { color: "#3D3D3D" },
    }}
    InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <PersonOutlineIcon style={{ color: "gray" }} />
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
    type={showPassword ? "text" : "password"}
    variant="standard"
    label="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={styles.TextField}
    InputLabelProps={{
        style: { color: "#3D3D3D" }, 
    }}
    InputProps={{
        endAdornment: (
            <InputAdornment position="end">
                <span onClick={handleShowPassword} style={{ cursor: "pointer" }}>
                    {showPassword ? <EyeOff style={{ color: "gray" }} /> : <Eye style={{ color: "gray" }} />}
                </span>
            </InputAdornment>
        ),
        sx: {
            "&:before": { borderBottom: "2px solid #3D3D3D" }, // Change default border to red
            "&:hover:before": { borderBottom: "2px solid red" }, // Darker red on hover
            "&:after": { borderBottom: "2px solid red" }, // Active state border
        },
    }}
/>
                        <button type="submit" style={styles.button}>Login</button>
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                        <p style={styles.forgotPasswordLink} onClick={() => navigate("/ForgotPasswordPage")}>
                            Forgot Password?
                        </p>
                    </form>
                </div>
            </div>
            <img src={airplane} alt="Airplane" style={styles.airplaneImage} />
        </div>
    );
};

export default LoginPage;
