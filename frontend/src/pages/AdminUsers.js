import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import { getUsers, deleteUser, saveUser } from "../api/api";
import { CircularProgress, Button, Dialog, DialogTitle, DialogContent, TablePagination } from '@mui/material';
import "../App.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAllLoaded, setIsAllLoaded] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);  // Populate users data
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error);
        }
        setIsLoading(false);
    };

    const handleDelete = async (matricule) => {
        setIsLoading(true);
        await deleteUser(matricule);
        fetchUsers();
    };

    const handleSave = async (user) => {
        setIsLoading(true);
        await saveUser(user);
        fetchUsers();
        setIsDialogOpen(false);
    };

    const sortedUsers = [...users].sort((a, b) => a.matricule.localeCompare(b.matricule));

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
        <div className="admin-users-container">
            <h2>Gestion des Utilisateurs</h2>
            <Button
                onClick={() => { setSelectedUser(null); setIsDialogOpen(true); }}
                variant="contained"
                style={{ backgroundColor: '#c80505', color: 'white' }}
            >
                + Ajouter un utilisateur
            </Button>

            {isLoading ? (
                <CircularProgress />
            ) : (
                <UserTable
                    users={usersToDisplay}  // Pass only the users for the current page
                    onEdit={(user) => { setSelectedUser(user); setIsDialogOpen(true); }}
                    onDelete={handleDelete}
                />
            )}

            {/* If all users are not loaded yet, show the "Load More" button */}
            {!isAllLoaded && users.length > 0 && (
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#c80505', color: 'white', marginTop: '20px' }}
                    onClick={handleLoadAll}
                >
                    Charger plus
                </Button>
            )}

            {/* Table Pagination */}
            <TablePagination
                component="div"
                count={users.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 30, 40]} // Allow selecting rows per page
                style={{ color: '#c80505' }} // Color for pagination buttons
            />

            {/* User Form Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{selectedUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
                <DialogContent>
                    <UserForm user={selectedUser} onClose={() => setIsDialogOpen(false)} onSave={handleSave} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUsers;
