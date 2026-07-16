import api from "./axios";

export const listAbsences = (params = {}) =>
  api.get("/absences", { params }).then((res) => res.data);

export const createAbsence = (payload) =>
  api.post("/absences", payload).then((res) => res.data);

export const getAbsence = (id) => api.get(`/absences/${id}`).then((res) => res.data);

export const updateAbsence = (id, payload) =>
  api.put(`/absences/${id}`, payload).then((res) => res.data);
