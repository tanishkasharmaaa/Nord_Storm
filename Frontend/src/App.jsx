import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';
import Routing from './Components/routing';
import LoadingScreen from "./Components/loadingScreen";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get token from URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store token in localStorage and clean URL
      localStorage.setItem("authToken", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if user is authenticated
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home page
  };

  if (loading) return <LoadingScreen/>;

  return (
    <>
       
      <Routing isLoggedIn={isLoggedIn} />
    </>
  );
}

export default App;
