import React, { useState } from "react";
import { Button } from '@mui/material'; // Material UI Button component
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'; // Importing the Up Arrow Icon
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Importing the Down Arrow Icon

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
            <Button onClick={() => handleSort('matricule')} size="small">
              {sortConfig.key === 'matricule' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </Button>
          </th>
          <th>
            Nom
            <Button onClick={() => handleSort('nom')} size="small">
              {sortConfig.key === 'nom' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </Button>
          </th>
          <th>
            Prénom
            <Button onClick={() => handleSort('prenom')} size="small">
              {sortConfig.key === 'prenom' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </Button>
          </th>
          <th>
            Base
            <Button onClick={() => handleSort('base')} size="small">
              {sortConfig.key === 'base' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </Button>
          </th>
          <th>
            Collège
            <Button onClick={() => handleSort('college')} size="small">
              {sortConfig.key === 'college' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </Button>
          </th>
          <th>
            Secteur
            <Button onClick={() => handleSort('secteur')} size="small">
              {sortConfig.key === 'secteur' 
                ? sortConfig.direction === 'asc' 
                  ? <ArrowDropUpIcon /> 
                  : <ArrowDropDownIcon />
                : <ArrowDropUpIcon color="disabled" />} {/* Default arrow */}
            </Button>
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
              <Button onClick={() => onEdit(user)} variant="outlined" color="primary" size="small">Modifier</Button>
              <Button onClick={() => onDelete(user.matricule)} variant="outlined" color="secondary" size="small">Supprimer</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
