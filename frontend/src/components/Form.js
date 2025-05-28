import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const baseColor = "rgb(200, 5, 5)";
const lightRed = "rgba(200, 5, 5, 0.15)";
const textColor = "black";
const borderRed = "rgb(255, 100, 100)";
const backgroundRed = "white";

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    padding: "2rem",
    borderRadius: "16px",
    backgroundColor: backgroundRed,
    boxShadow: "0 20px 25px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    color: "#C80505",
  },
  heading: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: textColor,
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1rem",
    color: "grey", 
    marginBottom: "2rem",
  },
};

const Form = ({
  open,
  onClose,
  onSubmit,
  title = "Formulaire",
  fields = [],
  values = {},
  onChange,
  submitLabel = "Valider",
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div
        style={styles.container}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            opacity: 1,
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                ${lightRed},
                transparent 80%
              )
            `,
            zIndex: 0,
          }}
        />
        <IconButton onClick={onClose} style={styles.closeButton}>
          <CloseIcon />
        </IconButton>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h3 style={styles.heading}>{title}</h3>
          <p style={styles.description}>
            Veuillez remplir les champs ci-dessous pour continuer.
          </p>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid
                  item
                  xs={12}
                  sm={field.fullWidth ? 12 : 6}
                  key={field.name}
                >
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={values[field.name] || ""}
                    onChange={onChange}
                    required={field.required ?? true}
                    multiline={field.multiline}
                    rows={field.rows || 1}
                    variant="standard"
                    InputLabelProps={{ style: { color: textColor } }}
                    InputProps={{
                      style: {
                        color: "#black",
                        borderColor: borderRed,
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <Button
                onClick={onClose}
                variant="standard"
                style={{
                  borderColor: borderRed,
                  color: textColor,
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: baseColor,
                  color: "#fff",
                }}
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
