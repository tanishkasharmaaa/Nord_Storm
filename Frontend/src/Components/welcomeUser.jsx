import { useState, useEffect } from "react";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function WelcomeUser() {
  const [displayUser, setDisplayUser] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("username"));
    if (storedUser) {
      setUser(storedUser);
      setDisplayUser(true);
    }
  }, []);

  return (
    <Flex justify="center" align="center" p={2}  px={5}>
      {displayUser && user ? (
        <Heading
          fontFamily="Poppins, sans-serif"
          fontSize={["30px", "40px", "50px"]}
          color="gray.400"
          textAlign="center"
          fontStyle={'italic'}
        >
          Welcome {user.name} !
        </Heading>
      ) : (
        <Button borderRadius={'none'} as={Link} to="https://nord-storm.onrender.com/auth/google" colorScheme="blue">
          Sign Up / Log In
        </Button>
      )}
    </Flex>
  );
}

export default WelcomeUser;

