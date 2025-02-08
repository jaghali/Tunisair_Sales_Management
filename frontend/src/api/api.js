import axios from "axios";

const API_URL = "http://localhost:5000/api/pn";

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const saveUser = async (user) => {
  if (user.matricule) {
    await axios.put(`${API_URL}/${user.matricule}`, user);
  } else {
    await axios.post(API_URL, user);
  }
};

export const deleteUser = async (matricule) => {
  await axios.delete(`${API_URL}/${matricule}`);
};