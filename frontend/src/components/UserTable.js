import React, { useState } from "react";
import { Pencil, Trash , Plus} from "lucide-react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "../App.css";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';

const UserTable = ({ users, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Corrected to openDialog state

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";

    // Handle numeric sorting for "matricule"
    if (sortConfig.key === "matricule") {
      aValue = parseInt(aValue, 10) || 0;
      bValue = parseInt(bValue, 10) || 0;
      return (aValue - bValue) * (sortConfig.direction === "asc" ? 1 : -1);
    }

    return aValue.toString().localeCompare(bValue.toString(), "fr", { sensitivity: "base" }) * 
      (sortConfig.direction === "asc" ? 1 : -1);
  });

  // Filter users based on search query
  const filteredUsers = sortedUsers.filter((user) =>
    ["matricule", "nom", "prenom"].some((key) =>
      user[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h2 style={styles.heading}>Gestion des Utilisateurs</h2>

        
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", width: "100%" }}>
  <TextField
    label="Rechercher..."
    variant="standard"
    fullWidth
    style={{ ...styles.searchInput, flexGrow: 1 }} // Apply flexGrow here
    onChange={(e) => setSearchQuery(e.target.value)}
    InputLabelProps={{ style: { color: "#3D3D3D" } }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon style={{ color: "grey" }} />
        </InputAdornment>
      ),
      sx: {
        "&:before": { borderBottom: "2px solid #3D3D3D" },
        "&:hover:before": { borderBottom: "2px solid red" },
        "&:after": { borderBottom: "2px solid red" },
      },
    }}
  />
  <motion.button
    onClick={handleOpenDialog}
    style={styles.addButton}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Plus style={styles.icon} />
    Ajouter Utilisateur
  </motion.button>
</div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            {["matricule", "nom", "prenom", "base", "college", "secteur"].map((key) => (
              <th key={key} style={styles.headerCell}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <IconButton onClick={() => handleSort(key)} size="small">
                  {sortConfig.key === key ? (
                    sortConfig.direction === "asc" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                  ) : (
                    <ArrowDropUpIcon color="disabled" />
                  )}
                </IconButton>
              </th>
            ))}
            <th style={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index} style={styles.row}>
              <td style={styles.cell}>{user.matricule}</td>
              <td style={styles.cell}>{user.nom}</td>
              <td style={styles.cell}>{user.prenom}</td>
              <td style={styles.cell}>{user.base}</td>
              <td style={styles.cell}>{user.college}</td>
              <td style={styles.cell}>{user.secteur}</td>
              <td style={styles.cell}>
                <IconButton onClick={() => onEdit(user)} size="small">
                  <Pencil color="#00a3f5" />
                </IconButton>
                <IconButton onClick={() => onDelete(user.matricule)} size="small">
                  <Trash color="#f50000" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openDialog && (
        <div style={styles.dialog}>
          <h3>Ajouter un article</h3>
          {/* Add your dialog content and form here */}
          <button onClick={handleCloseDialog}>Close</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#C80505',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '16px',
  

  },
  container: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between", // Align elements side by side
    width: "100%",
    marginBottom: "20px",
  },
  heading: {
    flex: 1,
    textAlign: "left", // Align the heading to the left
  },
  searchInput: {
    maxWidth: "400px",
    marginRight: "10px", 
  },
  table: {
    borderCollapse: "collapse",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
  },
  headerRow: {
    backgroundColor: "#f8f9fa",
    fontWeight: "bold",
    borderRadius: "30px",
  },
  headerCell: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    color: "#333",
  },
  row: {
    transition: "background 0.3s",
    borderBottom: "1px solid #ddd",
  },
  cell: {
    padding: "10px",
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
  dialog: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    zIndex: "999",
  },
};

export default UserTable;
