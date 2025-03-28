import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventForm from "./pages/EventForm";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        } else {
          setUser({ id: decoded.id, email: decoded.email });
        }
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar user={user} setUser={setUser} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/event/:id" element={<EventPage user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} navigate={navigate} />} />
            <Route path="/register" element={<Register navigate={navigate} />} />
            <Route path="/create-event" element={<EventForm user={user} />} />
            <Route path="/edit-event/:id" element={<EventForm user={user} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;