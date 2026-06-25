import { useState } from "react";
import KnowledgeGraph from "../components/KnowledgeGraph";
import "./AthenaLogin.css";


export default function AthenaLogin() {
  const [phase, setPhase] = useState("idle");

  const handleLogin = () => {
    if (phase !== "idle") return;
    setPhase("clicking");
    
    // Collapse to circle spinner
    setTimeout(() => setPhase("loading"), 380); 
    
    // Redirect to Zoho Auth Simulation
    setTimeout(() => {
      // Real World: window.location.href = "https://accounts.zoho.com/oauth/v2/auth?client_id=...";
      // For now, simulating the redirect back with a name parameter
      window.location.href = "/home?name=Kaif"; 
    }, 1500);
  };

  const btnClass = ["athena-btn", phase !== "idle" ? phase : ""].filter(Boolean).join(" ");

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-dark">
      <KnowledgeGraph />

      {/* Blue Center Glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        {/* Logo Vector */}
        <img src="/assets/logo.png" alt="Athena Logo" className="w-20 h-20 mb-6 opacity-90" />
        
        <h1 className="mb-4 text-7xl font-bold text-text-light tracking-wide">
          Athena
        </h1>
        <p className="text-sm uppercase tracking-widest text-secondary mb-16">
          INGSOL's Internal Intelligence
        </p>

        <button className={btnClass} onClick={handleLogin}>
          <div className="athena-btn__ripple" />
          <span className="athena-btn__label">Login with Zoho</span>
          <div className="athena-btn__spinner-wrap">
            <div className="athena-btn__spinner-arc" />
          </div>
        </button>
      </div>
    </div>
  );
}