import {
  Box,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Portal,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";

import men from "../assets/men.png";
import women from "../assets/women.png";
import kids from "../assets/kids.png";
import bags from "../assets/bags.png";

const Navbar = () => {
  const categories = ["Men", "Women", "Kids", "Bags"];
  const categoriesImage = { Men: men, Women: women, Kids: kids, Bags: bags };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [checkLogin, setCheckLogin] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCategory(null);
    const token = localStorage.getItem("authToken");
    setCheckLogin(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setCheckLogin(false);
    navigate("https://nord-storm.onrender.com/auth/logout");
    setTimeout(() => navigate("/"), 100);
  };

  return (
    <Box bg="gray.100" py={4} px={6} boxShadow="md">
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {isMobile ? (
          <Button onClick={onOpen} variant="ghost" colorScheme="blue">
            <HamburgerIcon w={6} h={6} />
          </Button>
        ) : (
          <Flex gap={6} align="center">
            {categories.map((category) => (
              <Popover
                key={category}
                isOpen={selectedCategory === category}
                onClose={() => setSelectedCategory(null)}
              >
                <PopoverTrigger>
                  <Button
                    bg="transparent"
                    _hover={{ color: "blue.500", textDecoration: "underline" }}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category ? null : category
                      )
                    }
                  >
                    {category}
                  </Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent
                    boxShadow="xl"
                    borderRadius="lg"
                    p={4}
                    bg="white"
                    width={"800px"}
                    height={"400px"}
                  >
                    <PopoverArrow />
                    <PopoverBody>
                      <Link
                        to={`/${category}`}
                        onClick={() => setSelectedCategory(null)}
                      >
                        <Image
                          src={categoriesImage[category]}
                          alt={category}
                          width="700px"
                        />
                      </Link>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
            ))}
            <Button
              bg="transparent"
              _hover={{ color: "blue.500", textDecoration: "underline" }}
              onClick={() => navigate("/cart")}
            >
              Cart
            </Button>
            <Button
              bg="transparent"
              _hover={{ color: "blue.500", textDecoration: "underline" }}
              onClick={() => navigate("/wishlist")}
            >
              WishList
            </Button>

            {checkLogin && (
              <Button colorScheme="blue" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Flex>
        )}
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="lg" borderBottomWidth="1px">
            Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {categories.map((category) => (
                <Button
                  key={category}
                  w="full"
                  as={Link}
                  to={`/${category}`}
                  onClick={onClose}
                >
                  {category}
                </Button>
              ))}
              <Button
             w="full"
              onClick={() => navigate("/cart")}
            >
              Cart
            </Button>
            <Button
            w="full"
             
              onClick={() => navigate("/wishlist")}
            >
              WishList
            </Button>
              {checkLogin ? (
                <Button colorScheme="red" onClick={handleLogout} w="full">
                  Logout
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="https://nord-storm.onrender.com/auth/google"
                  onClick={() => setCheckLogin(false)}
                  color={"white"}
                  w={"100%"}
                  bgColor={"blue.500"}
                >
                  Sign Up / Log In
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
