import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";

export default function Home() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Home</h1>
            <p>Roteamento está ok.</p>
        </div>
    );
}

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            {/* ajuste depois conforme seu app */}
            <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
    );
}
