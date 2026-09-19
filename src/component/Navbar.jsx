import { useContext } from "react";
import { dataContext } from "../context/UserContext"; 
import "../Navbar.css";

export default function Navbar() {
  const { speaking } = useContext(dataContext);

  return (
    <nav className="jarvis-navbar">
      {/* Left Logo */}
      <div className="jarvis-logo-wrapper">
        <span className="jarvis-logo-bracket">[</span>
        <span className="jarvis-logo-text">JARVIS</span>
        <span className="jarvis-logo-bracket">]</span>
      </div>

      {/* Right System Indicator */}
      <div className="jarvis-status-container">
        <span className={`status-dot ${speaking ? "speaking" : "online"}`}></span>
        <span className="status-text">
          {speaking ? "SYNTHESIZING" : "SYSTEM ONLINE"}
        </span>
      </div>
    </nav>
  );
}