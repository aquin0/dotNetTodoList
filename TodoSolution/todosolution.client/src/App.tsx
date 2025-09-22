import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Checkbox, IconButton } from "@mui/material";
import { useAuthStore } from "./store/auth";
import { login, register } from "./api/auth";
import { createTask, deleteTask, getTasks, Task, updateTask } from "./api/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function RequireAuth({ children }: { children: JSX.Element }) {
    const token = useAuthStore(s => s.token);
    return token ? children : <Navigate to="/login" replace />;
}

function Login() {
    const [u, setU] = useState(""); const [p, setP] = useState("");
    const setToken = useAuthStore(s => s.setToken);
    const nav = useNavigate();
    const doLogin = async () => {
        const { token } = await login(u, p);
        setToken(token); nav("/tasks");
    };
    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
            <TextField fullWidth label="Username" value={u} onChange={e => setU(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth type="password" label="Password" value={p} onChange={e => setP(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={doLogin} fullWidth>Entrar</Button>
            <Button onClick={() => nav("/register")} fullWidth sx={{ mt: 1 }}>Registrar</Button>
        </Container>
    );
}

function Register() {
    const [u, setU] = useState(""); const [p, setP] = useState("");
    const nav = useNavigate();
    const doReg = async () => { await register(u, p); nav("/login"); };
    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Registro</Typography>
            <TextField fullWidth label="Username" value={u} onChange={e => setU(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth type="password" label="Password" value={p} onChange={e => setP(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={doReg} fullWidth>Criar conta</Button>
        </Container>
    );
}

function Tasks() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [cat, setCat] = useState("general");
    const qc = useQueryClient();
    const { data } = useQuery({ queryKey: ["tasks"], queryFn: () => getTasks() });
    const create = useMutation({ mutationFn: createTask, onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }) });
    const toggle = useMutation({
        mutationFn: async (t: Task) => updateTask(t.id, { title: t.title, description: t.description, category: t.category, isCompleted: !t.isCompleted }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] })
    });
    const remove = useMutation({ mutationFn: deleteTask, onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }) });

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Minhas Tarefas</Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <TextField label="Título" value={title} onChange={e => setTitle(e.target.value)} />
                <TextField label="Categoria" value={cat} onChange={e => setCat(e.target.value)} />
            </Box>
            <TextField fullWidth label="Descrição" value={desc} onChange={e => setDesc(e.target.value)} sx={{ mb: 1 }} />
            <Button variant="contained" onClick={() => { if (title) create.mutate({ title, description: desc || undefined, category: cat || "general" }); setTitle(""); setDesc(""); }}>
                Adicionar
            </Button>

            <Box sx={{ mt: 4 }}>
                {data?.map(t => (
                    <Box key={t.id} sx={{ display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid #eee", py: 1 }}>
                        <Checkbox checked={t.isCompleted} onChange={() => toggle.mutate(t)} />
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ textDecoration: t.isCompleted ? "line-through" : "none" }}>{t.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{t.category} {t.description ? "— " + t.description : ""}</Typography>
                        </Box>
                        <IconButton onClick={() => remove.mutate(t.id)}>🗑️</IconButton>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}

export default function App() {
    const logout = useAuthStore(s => s.logout);
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
                <Route path="*" element={<Navigate to="/tasks" replace />} />
            </Routes>
            <Button onClick={logout} sx={{ position: "fixed", top: 8, right: 8 }}>Logout</Button>
        </>
    );
}
