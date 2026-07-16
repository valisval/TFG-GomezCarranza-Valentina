import api from "./axios";

export const getSummary = () => api.get("/reports/summary").then((res) => res.data);

export const getByArea = () => api.get("/reports/by-area").then((res) => res.data);

export const getEvolution = () => api.get("/reports/evolution").then((res) => res.data);

export const exportCsv = () =>
  api.get("/reports/export/csv", { responseType: "blob" }).then((res) => res.data);
