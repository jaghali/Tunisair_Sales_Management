import React, { useState } from "react";
import { IconButton } from '@mui/material'; // Import IconButton
import { Pencil, Trash } from "lucide-react"; // Importing the Edit and Trash icons
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'; // Importing the ArrowDropUpIcon
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Importing the ArrowDropDownIcon

const UserTable = ({ users, onEdit, onDelete }) => {
  // State to manage sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle sorting when a user clicks on a column header
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sorting users based on the selected column and direction
  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key === null) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>
            Matricule
            <IconButton onClick={() => handleSort('matricule')} size="small">
              {sortConfig.key === 'matricule' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </IconButton>
          </th>
          <th>
            Nom
            <IconButton onClick={() => handleSort('nom')} size="small">
              {sortConfig.key === 'nom' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </IconButton>
          </th>
          <th>
            Prénom
            <IconButton onClick={() => handleSort('prenom')} size="small">
              {sortConfig.key === 'prenom' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </IconButton>
          </th>
          <th>
            Base
            <IconButton onClick={() => handleSort('base')} size="small">
              {sortConfig.key === 'base' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </IconButton>
          </th>
          <th>
            Collège
            <IconButton onClick={() => handleSort('college')} size="small">
              {sortConfig.key === 'college' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </IconButton>
          </th>
          <th>
            Secteur
            <IconButton onClick={() => handleSort('secteur')} size="small">
              {sortConfig.key === 'secteur' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} 
            </IconButton>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.map((user, index) => (
          <tr key={index}>
            <td>{user.matricule}</td>
            <td>{user.nom}</td>
            <td>{user.prenom}</td>
            <td>{user.base}</td>
            <td>{user.college}</td>
            <td>{user.secteur}</td>
            <td>
              <IconButton onClick={() => onEdit(user)} size="small" color="success">
              <Pencil color="#00a3f5" />              </IconButton>
              <IconButton onClick={() => onDelete(user.matricule)} size="small" color="error">
              <Trash color="#f50000" />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;