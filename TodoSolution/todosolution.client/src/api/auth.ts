import api from "./axios";
export async function login(username: string, password: string) {
    const { data } = await api.post("/auth/login", { username, password });
    return data as { token: string };
}
export async function register(username: string, password: string) {
    await api.post("/auth/register", { username, password });
}