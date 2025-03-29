import { Flex, Spinner, Text } from "@chakra-ui/react";

const LoadingScreen=()=>{
  return (
    <Flex justify="center" align="center" h="100vh" flexDirection="column">
      <Spinner size="xl" color="blue.500" />
      <Text mt={4}>Loading...</Text>
    </Flex>
  );
}

export default LoadingScreen;
