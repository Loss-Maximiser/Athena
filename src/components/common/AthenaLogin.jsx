import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import "./AthenaLogin.css";
import KnowledgeGraph from "./KnowledgeGraph";
import RotatingWreath from "../RotatingWreath/RotatingWreath";

export default function AthenaLogin() {
  const [phase, setPhase] = useState("idle");
  const navigate = useNavigate();
  // phases: "idle" → "clicking" → "loading" → (redirect)

  // Handle post-OAuth redirect: backend sends /?logged_in=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logged_in") === "true") {
      fetch("/api/me", { credentials: "include" })
        .then(r => r.ok ? navigate("/home") : null)
        .catch(() => null);
    }
  }, [navigate]);

  const handleLogin = () => {
    if (phase !== "idle") return;    // block double-clicks
    setPhase("clicking");
    setTimeout(() => setPhase("loading"), 380);     // collapse to circle
    setTimeout(() => {                               // redirect after animation
      window.location.href = "/auth/login";
    }, 1400);
  };

  const btnClass = ["athena-btn", phase !== "idle" ? phase : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3F1E8]">

      {/* Animated Knowledge Graph Background */}
      <KnowledgeGraph />

      {/* Golden Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9B85E]/20 blur-[180px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
<div className="flex justify-center mb-20">
  <RotatingWreath />
</div>

<h1
  className="mb-10 text-[100px] font-semibold text-[#445B2A]"
>
  Athena
</h1>
<p className="text-sm uppercase tracking-[0.45em] text-[#A37F22]">
  Wisdom Guides Intelligence
</p>

<div className="h-24"></div>

<button className={btnClass} onClick={handleLogin}>
          {/* Circular press ripple shown on click */}
          <div className="athena-btn__ripple" />

          {/* Icon + text — fade out together on click */}
          <span className="athena-btn__label">
            {/* <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" />
            </svg> */}
            Login
          </span>

          {/* Spinner — fades in after button collapses */}
          <div className="athena-btn__spinner-wrap">
            <div className="athena-btn__spinner-arc" />
          </div>

        </button>
      </div>
    </div>
  );
}