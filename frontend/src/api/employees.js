import api from "./axios";

export const listEmployees = (params = {}) =>
  api.get("/employees", { params }).then((res) => res.data);

export const createEmployee = (payload) =>
  api.post("/employees", payload).then((res) => res.data);

export const getEmployee = (id) => api.get(`/employees/${id}`).then((res) => res.data);

export const updateEmployee = (id, payload) =>
  api.put(`/employees/${id}`, payload).then((res) => res.data);
