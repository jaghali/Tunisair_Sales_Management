import React, { useState, useEffect } from "react";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Button } from '@mui/material';
import { motion } from "framer-motion";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import { getUsers, deleteUser, saveUser } from "../api/api";
import "../App.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAllLoaded, setIsAllLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
        await saveUser(user);
        fetchUsers();
        setIsDialogOpen(false);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        const filtered = users.filter(
            (user) =>
                (user.name && user.name.toLowerCase().includes(term)) ||
                (user.category && user.category.toLowerCase().includes(term)) ||
                (user.matricule && user.matricule.toLowerCase().includes(term))
        );
        setFilteredUsers(filtered);
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => a.matricule.localeCompare(b.matricule));

    const handleLoadAll = () => {
        setIsAllLoaded(true);
        fetchUsers();  
    };

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
            style={{ padding: "5%", marginBottom: "2%" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Gestion des Utilisateurs</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher des utilisateurs..."
                        style={{ color: "black", paddingLeft: "40px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "8px", fontSize: "14px", outline: "none", width: "300px" }}
                        onChange={handleSearch}
                        value={searchTerm}
                    />
                </div>
            </div>

            {isLoading ? (
                <CircularProgress />
            ) : (
                <div style={{ overflowX: 'auto', maxWidth: '100%', marginTop: '20px' }}>
                    <UserTable
                        users={usersToDisplay}  
                        onEdit={(user) => { setSelectedUser(user); setIsDialogOpen(true); }}
                        onDelete={confirmDeleteUser}
                    />
                </div>
            )}

            {!isAllLoaded && users.length > 0 && (
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#c80505", color: "white", marginTop: "20px" }}
                    onClick={handleLoadAll}
                >
                    Charger plus
                </Button>
            )}

            <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 30, 40]}
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
