import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Home  from "./Home";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            {/* ajuste depois conforme seu app */}
            <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
    );
}
