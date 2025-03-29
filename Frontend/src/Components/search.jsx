import { Box, Input, useBreakpointValue } from "@chakra-ui/react";

function Search({ query, setQuery }) {
  const inputWidth = useBreakpointValue({ base: "200px", md: "300px", lg: "400px" });

  return (
    <Box flex="1" mx={4} display="flex" justifyContent="center">
      <Input
        placeholder="Search for products or brands"
        bg="white"
        borderRadius={useBreakpointValue({ base: "sm", md: "md" })}
        _focus={{ borderColor: "blue.400", boxShadow: "md" }}
        width={inputWidth}
        padding={useBreakpointValue({ base: "8px", md: "10px" })}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </Box>
  );
}

export default Search;
