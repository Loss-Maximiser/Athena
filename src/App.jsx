// src/App.jsx
import { Routes, Route } from "react-router-dom";
import AthenaLogin from "./pages/AthenaLogin";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage"; // ✅ Naya page import kiya

function App() {
  return (
    <Routes>
      <Route path="/" element={<AthenaLogin />} />
      <Route path="/home" element={<HomePage />} />
      {/* ✅ Naya dynamic route chat ke liye */}
      <Route path="/chat/:agentType" element={<ChatPage />} />
    </Routes>
  );
}

export default App;