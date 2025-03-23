import React, { useState, useEffect } from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Button } from '@mui/material';
import {motion } from "framer-motion";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import { getUsers, deleteUser} from "../api/api";
import "../App.css";
import axios from "axios";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fonction API pour créer ou mettre à jour un utilisateur
    const saveUser = async (user) => {
        let response; 
        try {
            // Vérifier si 'user.matricule' existe et n'est pas vide
            if (user.matricule && user.matricule.trim() !== "") {
                // Vérifier si l'utilisateur existe déjà
                const checkUserResponse = await axios.get(`http://localhost:5000/api/pn/${user.matricule}`);
                
                if (checkUserResponse.status === 200) {
                    // Si l'utilisateur existe déjà, faire une mise à jour (PUT)
                    console.log("Mise à jour de l'utilisateur :", user);
                    response = await axios.put(`http://localhost:5000/api/pn/${user.matricule}`, user);
                }
            } 
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Si l'utilisateur n'existe pas, on peut créer un nouvel utilisateur (POST)
                response = await axios.post('http://localhost:5000/api/pn', user);
            } else {
                console.error("Erreur lors de l'enregistrement de l'utilisateur :", error.response || error);
                throw error; // Relancer l'erreur pour pouvoir la gérer dans le composant appelant
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);  
            setFilteredUsers(data);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error);
        }
        setIsLoading(false);
    };

    const confirmDeleteUser = (matricule) => {
        setUserToDelete(matricule);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        await deleteUser(userToDelete);
        fetchUsers();
        setIsDeleteDialogOpen(false);
    };

    const handleSave = async (user) => {
        setIsLoading(true);
        try {
            // Appel à saveUser, qui gère la création ou mise à jour selon le matricule
            await saveUser(user); 
            fetchUsers();
            setIsDialogOpen(false);  // Ferme la fenêtre après l'enregistrement
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        }
        setIsLoading(false);
    };

    const handleAddUser = () => {
        setSelectedUser(null); // Ensure a new user is added
        setIsDialogOpen(true);
      };

    const sortedUsers = [...filteredUsers].sort((a, b) => a.matricule.localeCompare(b.matricule));

    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    const usersToDisplay = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <motion.div
            style={{ padding: "10%", marginLeft:"15%" , marginTop:"-8%"}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >

            <div style={{ overflowX: 'auto', maxWidth: '100%', marginTop: '20px' }}>
                <UserTable
                    users={usersToDisplay}  
                    onEdit={(user) => { setSelectedUser(user); setIsDialogOpen(true); }}
                    onDelete={confirmDeleteUser}
                    onAdd={handleAddUser}
                />
            </div>

            <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10 , 20]}
                style={{ color: "#c80505" }}
            />
            

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{selectedUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
                <DialogContent>
                    <UserForm user={selectedUser} onClose={() => setIsDialogOpen(false)} onSave={handleSave} />
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">Annuler</Button>
                    <Button onClick={handleDelete} color="error">Supprimer</Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
};

export default AdminUsers;
