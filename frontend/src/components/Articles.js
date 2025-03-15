import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash, Save, X, Plus } from "lucide-react";
import { TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import "../App.css";
import { Add } from "@mui/icons-material";

const Articles = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editedItem, setEditedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newArticle, setNewArticle] = useState({
    code: "",
    description: "",
    supplier: "",
    departureDate:"",
    arrivalDate: "",
    currency: "",
    prices: [],
  });

  const [suppliers, setSuppliers] = useState([]); 
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedDateDebut, setSelectedDateDebut] = useState("");
  const [selectedDateFin, setSelectedDateFin] = useState("");

  const [openPriceDialog, setOpenPriceDialog] = useState(false); // New state for price dialog
  const [selectedArticleCode, setSelectedArticleCode] = useState(""); // To store selected article code for price
  const [newPrice, setNewPrice] = useState({
    departureDate: "",
    arrivalDate: "",
    price: "",
    currency: "",
  });

    // Function to open the price dialog for a selected article
    const handleOpenPriceDialog = (articleCode) => {
      setSelectedArticleCode(articleCode);
      setOpenPriceDialog(true);
    };
  
    const handleClosePriceDialog = () => {
      setOpenPriceDialog(false);
      setNewPrice({
        departureDate: "",
        arrivalDate: "",
        price: "",
        currency: "",
      });
    };
  
    const handlePriceChange = (e, key) => {
      setNewPrice({ ...newPrice, [key]: e.target.value });
    };
  
    const handleAddNewPrice = async () => {
      if (!newPrice.departureDate || !newPrice.arrivalDate || !newPrice.price) {
        alert("Veuillez remplir tous les champs !");
        return;
      }
  
      try {
        await axios.post("http://localhost:5000/api/PrixArticles", {
          articleCode: selectedArticleCode,
          dateDepart: newPrice.departureDate,
          dateArrivee: newPrice.arrivalDate,
          prix: newPrice.price,
          deviseId: newPrice.currency,
        });
  
        fetchData(); // Refresh the data
        handleClosePriceDialog(); // Close the price dialog
      } catch (error) {
        console.error("Erreur lors de l'ajout du prix :", error);
      }
    };



  // Fetch articles and suppliers data
  const fetchData = useCallback(async () => {
    try {
      const articlesResponse = await axios.get("http://localhost:5000/api/Articles");
      const suppliersResponse = await axios.get("http://localhost:5000/api/Fournisseurs");
      const pricesResponse = await axios.get("http://localhost:5000/api/PrixArticles");

      const pricesData = Array.isArray(pricesResponse.data) ? pricesResponse.data : [];

      const pricesMap = new Map();
      pricesData.forEach((price) => {
        if (!pricesMap.has(price.articleCode)) {
          pricesMap.set(price.articleCode, []);
        }
        pricesMap.get(price.articleCode).push(price);
      });

      const articlesWithPrices = articlesResponse.data.map((article) => ({
        ...article,
        prices: pricesMap.get(article.code) || [],
      }));

      setData(articlesWithPrices);
      setColumns(Object.keys(articlesResponse.data[0] || {}));
      setSuppliers(suppliersResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


   const handleDelete = async (code) => {
    if (!code) {
      console.error("Code invalide pour la suppression");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/Articles/${code}`);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (item) => {
    setEditedItem({ ...item }); // Make a copy of the item being edited
  };

  const handleCancelEdit = () => {
    setEditedItem(null); // Cancel editing
  };

  const handleSaveEdit = async () => {
    if (!editedItem) return;

    try {
      await axios.put(`http://localhost:5000/api/Articles/${editedItem.code}`, editedItem);
      fetchData();
      setEditedItem(null); // Close form after saving
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleChange = (e, key) => {
    setEditedItem({ ...editedItem, [key]: e.target.value });
  };


  // Handle adding a new article with prices
  const handleAddArticle = async () => {
    if (!newArticle.code || !newArticle.description || !newArticle.supplier) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
  
    try {
      // Ajout de l'article
      await axios.post("http://localhost:5000/api/Articles", {
        code: newArticle.code,
        description: newArticle.description,
        fournisseurId: newArticle.supplier,
      });
  
      // Attendre que l'article soit bien créé avant d'ajouter les prix
      for (const price of newArticle.prices) {
        await axios.post("http://localhost:5000/api/PrixArticles", {
          articleCode: newArticle.code, 
          deviseId: price.currency,
          dateDepart: price.departureDate,
          dateArrivee: price.arrivalDate,
          prix: price.price,
        });
      }
  
      fetchData();
      setNewArticle({ code: "", description: "", supplier: "", departureDate: "", arrivalDate: "", currency: "", prices: [] });
      setOpenDialog(false);
    } catch (error) {
      if (error.response) {
        console.error("Erreur réponse API:", error.response.data);
        if (error.response.data.errors) {
          console.error("Détails des erreurs:", error.response.data.errors);
        }
      } else {
        console.error("Erreur inconnue:", error);
      }
    }
    
  };
  

  // Handle adding new price entry
  const handleAddPrice = () => {
    setNewArticle({
      ...newArticle,
      prices: [
        ...newArticle.prices,
        { departureDate:newArticle.departureDate,arrivalDate: newArticle.arrivalDate, price: "", currency: newArticle.currency },
      ],
    });
  };

  // Handle change in fields for the new article
  const handleNewArticleChange = (e, key) => {
    setNewArticle({ ...newArticle, [key]: e.target.value });
  };

  const handleNewPriceChange = (index, e, key) => {
    const updatedPrices = [...newArticle.prices];
    updatedPrices[index][key] = e.target.value;
    setNewArticle({ ...newArticle, prices: updatedPrices });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getFilteredPrice = (prices, dateDebut, dateFin) => {
    // Convertir les dates en objets Date pour comparaison
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);
  
    // Filtrer les prix qui sont dans la plage de dates
    const filteredPrice = prices.find((price) => {
      const departureDate = new Date(price.dateDepart);
      const arrivalDate = new Date(price.dateArrivee);
      return (
        departureDate >= dateDebutObj &&
        arrivalDate <= dateFinObj
      );
    });
  
    return filteredPrice || null;
  };

  const filteredData = data.filter((item) => {
    const matchesSearchTerm = columns.some((col) =>
      item[col] && item[col].toString().toLowerCase().includes(searchTerm)
    );
    const matchesSupplier = selectedSupplier ? item.fournisseurId === selectedSupplier : true;
    return matchesSearchTerm && matchesSupplier;
  });
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <h2 style={styles.heading}>Articles</h2>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchInput}
      />
      {/* Dropdown to filter by supplier */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
        <FormControl style={{ width: "150px" }}>
          <InputLabel>Fournisseur</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            label="Fournisseur"
          >
            <MenuItem value="">Tous</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>{supplier.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date Debut"
          type="date"
          value={selectedDateDebut}
          onChange={(e) => setSelectedDateDebut(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
         <TextField
          label="Date Fin"
          type="date"
          value={selectedDateFin}
          onChange={(e) => setSelectedDateFin(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <button onClick={handleOpenDialog} style={styles.addButton}>
        <Plus style={styles.icon} />
        Ajouter Article
      </button>

      <table style={styles.table}>
        <thead>
        <tr style={styles.headerRow}>
            <th style={styles.headerCell}>Code</th>
            <th style={styles.headerCell}>Description</th>
            <th style={styles.headerCell}>Prix</th>
            <th style={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => {
            const isEditing = editedItem && editedItem.code === item.code;
            // Filtered price logic
            const filteredPrice = getFilteredPrice(item.prices, selectedDateDebut, selectedDateFin);
            
            return (
              <tr key={index} style={styles.row}>
                <td style={styles.cell}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedItem.code}
                      onChange={(e) => handleChange(e, "code")}
                      style={styles.input}
                    />
                  ) : (
                    item.code
                  )}
                </td>
                <td style={styles.cell}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedItem.description}
                      onChange={(e) => handleChange(e, "description")}
                      style={styles.input}
                    />
                  ) : (
                    item.description
                  )}
                </td>
                <td style={styles.cell}>
  {filteredPrice ? (
    <div>{`${filteredPrice.prix}`}</div>
  ) : (
    <div>Aucun prix disponible pour cette période</div>
  )}
</td>

     
                <td style={styles.cell}>
                  {isEditing ? (
                    <>
                      <Save onClick={handleSaveEdit} style={{ ...styles.icon, color: "green" }} />
                      <X onClick={handleCancelEdit} style={{ ...styles.icon, color: "red" }} />
                    </>
                  ) : (
                    <>
                      <Edit onClick={() => handleEdit(item)} style={{ ...styles.icon, color: "green" }} />
                      <Trash onClick={() => handleDelete(item.code)} style={{ ...styles.icon, color: "#e74c3c" }} />
                      <Add onClick={() => handleOpenPriceDialog(item.code)} />
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
      />

      {/* Dialog for adding article */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un Article</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Fournisseur</InputLabel>
            <Select
              value={newArticle.supplier}
              onChange={(e) => handleNewArticleChange(e, "supplier")}
              label="Fournisseur"
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Code"
            name="code"
            value={newArticle.code}
            onChange={(e) => handleNewArticleChange(e, "code")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={newArticle.description}
            onChange={(e) => handleNewArticleChange(e, "description")}
            fullWidth
            margin="normal"
          />
          <TextField
                label="Date Départ"
                type="date"
                value={newArticle.departureDate}
                onChange={(e) => handleNewArticleChange(e, "departureDate")}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
          <TextField
            label="Date d'arrivée"
            type="date"
            value={newArticle.arrivalDate}
            onChange={(e) => handleNewArticleChange(e, "arrivalDate")}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Devise</InputLabel>
            <Select
              value={newArticle.currency}
              onChange={(e) => handleNewArticleChange(e, "currency")}
              label="Devise"
            >
              <MenuItem value="1">USD</MenuItem>
              <MenuItem value="2">EUR</MenuItem>
              <MenuItem value="3">TND</MenuItem>
            </Select>
          </FormControl>

          <Button onClick={handleAddPrice} color="primary" style={{ marginTop: "10px" }}>
            Ajouter un Prix
          </Button>

          {newArticle.prices.map((price, index) => (
            <div key={index}>
              
              <TextField
                label="Prix"
                type="number"
                value={price.price}
                onChange={(e) => handleNewPriceChange(index, e, "price")}
                fullWidth
                margin="normal"
              />
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Annuler</Button>
          <Button onClick={handleAddArticle} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPriceDialog} onClose={handleClosePriceDialog} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un Prix</DialogTitle>
        <DialogContent>
          <TextField
            label="Date Départ"
            type="date"
            value={newPrice.departureDate}
            onChange={(e) => handlePriceChange(e, "departureDate")}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Date Arrivée"
            type="date"
            value={newPrice.arrivalDate}
            onChange={(e) => handlePriceChange(e, "arrivalDate")}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Prix"
            type="number"
            value={newPrice.price}
            onChange={(e) => handlePriceChange(e, "price")}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Devise</InputLabel>
            <Select
              value={newPrice.currency}
              onChange={(e) => handlePriceChange(e, "currency")}
              label="Devise"
            >
              <MenuItem value="1">USD</MenuItem>
              <MenuItem value="2">EUR</MenuItem>
              <MenuItem value="3">TND</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePriceDialog} color="secondary">Annuler</Button>
          <Button onClick={handleAddNewPrice} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// CSS Styles remain unchanged
const styles = { 
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#c80505",
    marginBottom: "15px",
  },
  searchInput: {
    marginBottom: "20px",
    padding: "10px",
    fontSize: "16px",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  addButton: {
    backgroundColor: "#00a3f5",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  headerRow: {
    backgroundColor: "#c80505",
    color: "#fff",
  },
  headerCell: {
    padding: "12px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
  },
  row: {
    color:"black"
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  icon: {
    cursor: "pointer",
    marginLeft: "10px",
    transition: "transform 0.2s",
  },
  input: {
    color: "black",
    paddingLeft: "40px",
    paddingRight: "16px",
    paddingTop: "8px",
    paddingBottom: "8px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    width: "300px",
  },
 };

export default Articles;
