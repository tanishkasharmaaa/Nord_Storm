import { Box, Flex, Image, useMediaQuery, Text, Link } from "@chakra-ui/react";
import NordStorm_logo from "../assets/NordStorm_logo.png";
import Search from "../Components/search";
import Suggestions from "../Components/suggestion";
import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";

function MainPageElements() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionRefs = useRef([]);

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
        const response = await fetch(
          `https://nord-storm.onrender.com/products?search=${query}`
        );
        const data = await response.json();
        setResults(data.products);
        setShowSuggestions(data.products.length > 0);
      } catch (error) {
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    suggestionRefs.current = suggestionRefs.current.slice(0, results.length);
  }, [results]);

  const handleKeyDown = (event, product) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setQuery(product.name);
      setShowSuggestions(false);
      window.location.href = `/search?query=${encodeURIComponent(
        product.name
      )}`;
    }
  };

  const handleArrowKeyDown = (event, index) => {
    if (event.key === "ArrowDown" && index < results.length - 1) {
      event.preventDefault();
      if (suggestionRefs.current[index + 1]) {
        suggestionRefs.current[index + 1].focus();
      }
    } else if (event.key === "ArrowUp" && index > 0) {
      event.preventDefault();
      if (suggestionRefs.current[index - 1]) {
        suggestionRefs.current[index - 1].focus();
      }
    }
  };

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
      <Box bg="blue.600" color="white" textAlign="center" py={2} fontSize="sm">
        Free shipping on most orders $89+. Pick up select orders in stores.{" "}
        <u>Learn More</u>
      </Box>

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
        flexDirection={isLargerThan768 ? "row" : "column"}
        gap={4}
      >
 <Box 
  display="flex" 
  alignItems="center" 
  justifyContent="center"
  minW="150px" // Ensures the logo always has a minimum width
>
  <Image
    src={NordStorm_logo}
    alt="NordStorm Logo"
    h={["80px", "100px", "120px"]} // Mobile: 80px, Tablet: 100px, Desktop: 120px
    w={["150px", "180px", "200px"]} // Width scales with height
    objectFit="contain"
    minH="80px" // Prevents logo from disappearing
    maxH="150px" // Keeps logo proportional
    minW="150px" // Prevents logo from shrinking too much
  />
</Box>


        <Search query={query} setQuery={setQuery} />
      </Flex>

      {showSuggestions && results.length > 0 && (
        <Suggestions
          results={results}
          setQuery={setQuery}
          setShowSuggestions={setShowSuggestions}
          isLargerThan768={isLargerThan768}
          suggestionRefs={suggestionRefs}
          handleKeyDown={handleKeyDown}
          handleArrowKeyDown={handleArrowKeyDown}
        />
      )}
    </>
  );
}

export default MainPageElements;