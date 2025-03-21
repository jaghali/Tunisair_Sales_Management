import React from "react";
import "../App.css";
import airplane from '../components/Images/airplane3d.png'; // Import the airplane image
import { motion } from "framer-motion";

const Avion = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Gestion des Avions</h2>

      <motion.div
  style={styles.card}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.1 }}
>
  <div style={styles.content}>
    {/* Labels on the left */}
    <div style={styles.textContent}>
      <div style={styles.rowContainer}>
        <label style={styles.Littlelabel}>Modèle:</label>
        <label style={styles.label}>A303</label>
      </div>

      <div style={styles.rowContainer}>
        <label style={styles.Littlelabel}>Poids:</label>
        <label style={styles.label}>299000lbs</label>
        <label style={styles.Littlelabel}>Passagers:</label>
        <label style={styles.label}>2000</label>
      </div>

      <div style={styles.rowContainer}>
        <label style={styles.Littlelabel}>Vol:</label>
        <label style={styles.label}>TUN/IT</label>
        <label style={styles.Littlelabel}>Articles:</label>
        <label style={styles.label}>100</label>
      </div>
    </div>

    {/* Airplane image on the right */}
    <div style={styles.imageContainer}>
      <img src={airplane} alt="Airplane" style={styles.airplaneImage} />
    </div>
  </div>
</motion.div>


      {/* Map Container */}
      <div style={styles.mapContainer}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.7878689535105!2d10.214985175491067!3d36.84755617223372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cad2e1d7f1bb%3A0x902488d100b5819b!2sA%C3%A9roport%20de%20Tunis-Carthage!5e0!3m2!1sfr!2stn!4v1742435703245!5m2!1sfr!2stn" 
          width="100%" 
          height="100%" 
          style={{ border: "0", borderRadius: "10px" }} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

const styles = {
    heading: {
        flex: 1,
        textAlign: "left", 
      },
  container: {
    fontFamily: "Poppins, sans-serif",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    width: "75%",
    padding: "20px",
    backgroundColor: "#E5E6EB",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: "18%",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContent: {
    width: "100%",
    textAlign: "left",
    fontSize: "18px",
    fontFamily: "Poppins, sans-serif",
    color: "#333",
    paddingLeft: "50px",
  },
  rowContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: "10px",
  },
  Littlelabel: {
    color: "grey",
    fontSize: "16px",
    fontWeight: "400",
    fontFamily: "Poppins, sans-serif",
    marginRight: "50px",
  },
  label: {
    fontSize: "18px",
    fontWeight: "bold",
    fontFamily: "Fira Code, monospace",
    marginRight: "50px",
    width:"100%"
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
  },
  airplaneImage: {
    width: "80%",
    objectFit: "contain",
    filter: "drop-shadow(10px 10px 15px rgba(0, 0, 0, 0.5))",
  },
  mapContainer: {
    width: "75%",
    height: "350px",
    marginTop: "20px",
    borderRadius: "10px",
    marginLeft:"18%",
    overflow: "hidden",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default Avion;
