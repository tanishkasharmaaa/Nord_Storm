import { Box, Text, Flex, Link } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      width="100%"
      bg="black"
      height="200px"
      py={6}
      display="flex"
      flexDirection="column"
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
          mx={2} // Adjusted spacing
          role="img"
          fontSize={{ base: "4xl", md: "5xl" }}
          color="#ffcc33" // Golden color for the emoji
        >
          ✨
        </Text>
        <Text as="span" fontWeight="bold" color="lightblue">
          Tanishka
        </Text>
      </Text>

      {/* Social Links */}
      <Flex gap={6} mt={4}>
        <Link
          href="https://www.linkedin.com/in/tanishka-304953274"
          isExternal
          color="white"
          fontSize="lg"
          textDecoration="none"
          _hover={{ textDecoration: "underline", color: "lightblue" }}
        >
          LinkedIn
        </Link>

        <Link
          href="https://github.com/tanishkasharmaaa"
          isExternal
          color="white"
          fontSize="lg"
          textDecoration="none"
          _hover={{ textDecoration: "underline", color: "lightblue" }}
        >
          GitHub
        </Link>
      </Flex>
    </Box>
  );
}

export { Footer };
