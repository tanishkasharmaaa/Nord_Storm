import { VStack, Flex, Image, Text } from "@chakra-ui/react";
import {Link} from 'react-router-dom'

const Suggestions = ({ results, setQuery, setShowSuggestions, isLargerThan768 }) => {
  return (
    <VStack
      position="absolute"
      top={isLargerThan768 ? "120px" : "160px"} // Adjust height based on screen size
      left="50%"
      transform="translateX(-50%)"
      bg="white"
      boxShadow="lg"
      borderRadius="md"
      width={isLargerThan768 ? "400px" : "90%"} // Adjust width for small screens
      maxHeight="250px"
      overflowY="auto"
      zIndex="9999"
      border="1px solid #ccc"
      p={3}
    >
      
      {results.map((product) => (
        <Flex
          key={product._id}
          p={2}
          width="100%"
          align="center"
          _hover={{ bg: "gray.200", cursor: "pointer" }}
          onClick={() => {
            setQuery(product.name);
            setShowSuggestions(false);
          }}
        >
          <Image
            src={product.images[0] || "https://via.placeholder.com/50"}
            alt={product.name}
            boxSize={isLargerThan768 ? "50px" : "40px"} // Adjust image size
            objectFit="cover"
            borderRadius="md"
            mr={3}
          />
          <Text fontSize={isLargerThan768 ? "md" : "sm"}>{product.name}</Text>
        </Flex>
      ))}
    </VStack>
  );
};

export default Suggestions;
