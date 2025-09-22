import api from "./axios";

export type Task = {
    id: string; title: string; description?: string;
    isCompleted: boolean; category: string;
    createdAt: string; updatedAt?: string | null;
};

export async function getTasks(params?: { category?: string; completed?: boolean }) {
    const { data } = await api.get<Task[]>("/tasks", { params });
    return data;
}
export async function createTask(p: { title: string; description?: string; category: string }) {
    const { data } = await api.post<Task>("/tasks", p);
    return data;
}
export async function updateTask(id: string, p: { title: string; description?: string; category: string; isCompleted: boolean }) {
    await api.put(`/tasks/${id}`, p);
}
export async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
}
