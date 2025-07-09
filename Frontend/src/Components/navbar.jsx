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
  Text,

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
    <Box bg="none">
      {/* <Flex justifyContent="space-between" align="center" maxW="1200px" mx="auto"> */}
        {isMobile ? (
          <Button onClick={onOpen} variant="ghost" colorScheme="blue">
            <HamburgerIcon w={6} h={6} />
          </Button>
        ) : (<>
          <Flex alignItems={'center'} justifyContent={'space-between'}  align="center" pl={4} pr={4}>
            {categories.map((category) => (<Box key={category}>
             <Box>
              <Text fontWeight={'semibold'}>
                <Link to={`/${category}`}>
                {category}
                </Link>
              </Text>
             </Box>
           </Box> ))}
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
            <Button
              bg="transparent"
              _hover={{ color: "blue.500", textDecoration: "underline" }}
              onClick={() => navigate("/orderHistory")}
            >
              Order History
            </Button>

            {checkLogin && (
              <Button colorScheme="blue" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Flex>
        </>)}
      {/* </Flex> */}

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
            <Button
            w="full"
             
              onClick={() => navigate("/orderHistory")}
            >
              Order history
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
