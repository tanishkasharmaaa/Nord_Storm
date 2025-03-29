import React from "react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://nord-storm.onrender.com/auth/google"; 
  };
  

  return (
    <button onClick={handleGoogleLogin} style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}>
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;

