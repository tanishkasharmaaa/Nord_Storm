import { Box, Flex, Image, useMediaQuery,Text, Link } from "@chakra-ui/react";
import NordStorm_logo from "../assets/NordStorm_logo.png";
import Search from "../Components/search";
import Suggestions from "../Components/suggestion";
import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";

function MainPageElements(){
    const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);


  // Media query for different screen sizes
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const UserIcon = () => {
    return <User size={32} color="black" />;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === "") {
        setResults([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(`https://nord-storm.onrender.com/products?search=${query}`);
        const data = await response.json();
        setResults(data.products);
        setShowSuggestions(data.products.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Free Shipping Bar */}
      <Box bg="blue.600" color="white" textAlign="center" py={2} fontSize="sm">
        Free shipping on most orders $89+. Pick up select orders in stores.{" "}
        <u>Learn More</u>
      </Box>

      {/* Header Section */}
      <Flex
        id="head"
        align="center"
        justify="space-between"
        px={6}
        py={4}
        bg="white"
        position="relative"
        zIndex="10"
        ref={searchRef}
        flexDirection={isLargerThan768 ? "row" : "column"} // Stack items on small screens
        gap={4}
      >
        {/* LOGO */}
        <Image src={NordStorm_logo} alt="NordStorm Logo" h={isLargerThan768 ? "80px" : "60px"} />

        {/* SEARCH BAR */}
        <Search query={query} setQuery={setQuery} />

        {/* Sign Up Section */}
        


      </Flex>

      {/* Suggestions Component */}
      {showSuggestions && results.length > 0 && (
        <Suggestions
          results={results}
          setQuery={setQuery}
          setShowSuggestions={setShowSuggestions}
          isLargerThan768={isLargerThan768}
        />
      )}
      
    </>
  );
}

export default MainPageElements