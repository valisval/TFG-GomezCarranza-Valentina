import api from "./axios";

export const listAbsenceTypes = () => api.get("/absence-types").then((res) => res.data);
