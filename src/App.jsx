import { Routes, Route, Navigate } from "react-router-dom";

import AthenaLogin from "./pages/AthenaLogin";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

import Layout from "./components/layout/Layout";
import { ChatProvider } from "./contexts/ChatContext";

function App() {

  return (

    <ChatProvider>

      <Routes>

        {/* Login */}

        <Route
          path="/"
          element={<AthenaLogin />}
        />

        {/* Dashboard Layout */}

        <Route element={<Layout />}>

          <Route
            path="/home"
            element={<HomePage />}
          />

          <Route
            path="/chat/:agentType"
            element={<ChatPage />}
          />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>

    </ChatProvider>

  );

}

export default App;