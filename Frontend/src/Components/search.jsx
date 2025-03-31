import { Flex, Input, Box, Text, Image } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionRefs = useRef([]);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === "") {
        setResults([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        return;
      }

      try {
        const response = await fetch(
          `https://nord-storm.onrender.com/products?search=${query}`
        );
        const data = await response.json();
        setResults(data.products);
        setShowSuggestions(data.products.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    suggestionRefs.current = suggestionRefs.current.slice(0, results.length);
  }, [results]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      navigate(`/product/${results[selectedIndex]._id}`);
      setQuery("");
      setShowSuggestions(false);
    }
  };

  const handleArrowKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === results.length - 1 ? 0 : prevIndex + 1
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex <= 0 ? results.length - 1 : prevIndex - 1
      );
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id}`);
    setQuery("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Flex position="relative" ref={searchRef}>
      <Input
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e);
          handleArrowKeyDown(e);
        }}
      />
      {showSuggestions && results.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          bg="white"
          boxShadow="md"
          border="1px solid #ccc"
          mt="2"
          zIndex="999"
          maxHeight="300px"
          overflowY="auto"
        >
          {results.map((product, index) => (
            <Flex
              key={product._id}
              p={2}
              align="center"
              bg={index === selectedIndex ? "gray.100" : "white"}
              _hover={{ bg: "gray.200", cursor: "pointer" }}
              ref={(el) => (suggestionRefs.current[index] = el)}
              onClick={() => handleSuggestionClick(product)}
              tabIndex="0"
              onFocus={() => setSelectedIndex(index)}
            >
              <Image
                src={product.images[0] || "https://via.placeholder.com/50"}
                alt={product.name}
                boxSize="40px"
                mr={3}
              />
              <Text>{product.name}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </Flex>
  );
}

export default ProductSearch;