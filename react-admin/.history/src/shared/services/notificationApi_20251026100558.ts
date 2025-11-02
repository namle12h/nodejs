import axios from "axios";

const API_URL = "http://localhost:8080/api/notifications";

export const getNotifications = (userId: number) =>
  axios.get(`${API_URL}/${userId}`).then((res) => res.data.data);

export const markRead = (id: number) =>
  axios.put(`${API_URL}/${id}/read`).then((res) => res.data.data);

export const markAllRead = (userId: number) =>
  axios.put(`${API_URL}/user/${userId}/read-all`);

export const deleteAll = (userId: number) =>
  axios.put(`${API_URL}/user/${userId}/delete-all`);
