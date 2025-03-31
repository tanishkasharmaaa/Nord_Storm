import { Box, Text } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      width="100%"
      bg="black"
      height="200px"
      py={6}
      display="flex"
      justifyContent="center"
      alignItems="center"
      boxShadow="0px -4px 20px rgba(0, 0, 0, 0.5)"
    >
      <Text
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight="extrabold"
        color="white"
        textAlign="center"
        textShadow="2px 2px 10px rgba(255, 255, 255, 0.7)"
      >
        Made By
        <Text
          as="span"
          mx={3} // Adjusted spacing
          role="img"
          fontSize={{ base: "4xl", md: "5xl" }}
          color="#ffcc33" // Golden color for the emoji
        >
          ✨
        </Text>
        <Text
          as="span"
          fontWeight="bold"
          color="lightblue"
        >
          Tanishka
        </Text>
      </Text>
    </Box>
  );
}

export {Footer};