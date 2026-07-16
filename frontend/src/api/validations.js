import api from "./axios";

export const listPendingValidations = () => api.get("/validations").then((res) => res.data);

export const approveValidation = (absenceId, comment = "") =>
  api.put(`/validations/${absenceId}/approve`, { comment }).then((res) => res.data);

export const rejectValidation = (absenceId, comment = "") =>
  api.put(`/validations/${absenceId}/reject`, { comment }).then((res) => res.data);
