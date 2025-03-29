import { Box, Flex, Image, useMediaQuery } from "@chakra-ui/react";
import NordStorm_logo from "../assets/NordStorm_logo.png";
import Search from "../Components/Search";
import Suggestions from "../Components/suggestion";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import MainPageElements from "../Components/mainPageEle";
import Navbar from "../Components/navbar";
import WelcomeUser from "../Components/welcomeUser";

function Home() {
  const token = localStorage.getItem("authToken"); // No need for JSON.stringify
  if (token) {
    const decodedToken = jwtDecode(token)
    localStorage.setItem("username", JSON.stringify({ name:decodedToken.name, id: decodedToken.id })); // Fix storage
  }

  return (
    <>
      <MainPageElements />
      <Navbar />
      <WelcomeUser/>
    </>
  );
}

export default Home;
