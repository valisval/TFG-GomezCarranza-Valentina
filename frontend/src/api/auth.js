import api from "./axios";

export const login = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const register = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);

export const refresh = () => api.post("/auth/refresh").then((res) => res.data);

export const getMe = () => api.get("/users/me").then((res) => res.data);

export const updateMe = (payload) => api.put("/users/me", payload).then((res) => res.data);
