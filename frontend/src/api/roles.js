import api from "./axios";

export const listRoles = () => api.get("/roles").then((res) => res.data);
