import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  Box,
  Image,
  Text,
  Button,
  Spinner,
  Flex,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  useToast
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useMediaQuery } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const ProductCarousel = ({ category }) => {
  const toast = useToast()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity,setQuantity]=useState(1)
  const [selectSize,setSelectSize] = useState("")
  let sliderRef = null;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const fetchProducts = async () => {
    try {
      const response = await fetch(category==""?(`https://nord-storm.onrender.com/products`):(`https://nord-storm.onrender.com/products?category=${category}`)
      );
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  async function addToCart() {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

  
    if (!token) {
      return { status: 401, data: { message: "Unauthorized: No token provided" }, ok: false };
    }
    if (!selectSize || selectSize.trim() === "") {  
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;  // ⛔ STOP EXECUTION if no size is selected
    }
    try {
      const response = await fetch(
        `https://nord-storm.onrender.com/products/cartUpdate/${selectedProduct._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: selectedProduct._id,
            username: username || "Guest",
            name: selectedProduct.name || "Unknown",
            description: selectedProduct.description || "No description",
            price: selectedProduct.price || 0,
            category: selectedProduct.category || "Uncategorized",
            brand: selectedProduct.brand || "Unknown",
            size: selectSize,
            color: selectedProduct.color || "N/A",
            discount: selectedProduct.discount || 0,
            stock: quantity || 1,
            images: selectedProduct.images || [],
            rating: selectedProduct.rating || 0,
            reviews: selectedProduct.reviews || [],
          }),
        }
      );
      
      const data = await response.json();

      if (response?.status === 200) {
        toast({
          title: "Product Added",
          description: `${selectedProduct.name} has been added to your cart.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } 
      else if (response?.status === 409) {
        toast({
          title: "Already in Cart",
          description: `${selectedProduct.name} is already in your cart.`,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } 
      else {
        toast({
          title: "Already Added",
          description: response?.data?.message || "Something went wrong! Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    
      return { status: response.status, data, ok: response.ok };
    } catch (error) {
      return { status: 500, data: { message: error.message }, ok: false };
    }
  }

  async function addToWishlist() {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

  
    if (!token) {
      return { status: 401, data: { message: "Unauthorized: No token provided" }, ok: false };
    }
    if (!selectSize || selectSize.trim() === "") {  
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;  // ⛔ STOP EXECUTION if no size is selected
    }
    try {
      const response = await fetch(
        `https://nord-storm.onrender.com/products/wishlistUpdate/${selectedProduct._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id:selectedProduct._id,
            username: username || "Guest",
            name: selectedProduct.name || "Unknown",
            description: selectedProduct.description || "No description",
            price: selectedProduct.price || 0,
            category: selectedProduct.category || "Uncategorized",
            brand: selectedProduct.brand || "Unknown",
            size: selectSize,
            color: selectedProduct.color || "N/A",
            discount: selectedProduct.discount || 0,
            stock: quantity || 1,
            images: selectedProduct.images || [],
            rating: selectedProduct.rating || 0,
            reviews: selectedProduct.reviews || [],
          }),
        }
      );
      
      const data = await response.json();

      if (response?.status === 200) {
        toast({
          title: "Product Added",
          description: `${selectedProduct.name} has been added to your wishlist.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } 
      else if (response?.status === 409) {
        toast({
          title: "Already in Wishlist",
          description: `${selectedProduct.name} is already in your cart.`,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } 
      else {
        toast({
          title: "Already Added",
          description: response?.data?.message || "Something went wrong! Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
   
      return { status: response.status, data, ok: response.ok };
    } catch (error) {
      return { status: 500, data: { message: error.message }, ok: false };
    }
  }



  useEffect(() => {
    fetchProducts();
  }, [category]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isLargerThan1024 ? 5 : isLargerThan768 ? 3 : 1,
    slidesToScroll: 1,
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  return (
    <Box width="95%" margin="auto" mt={6} position="relative">
      {loading ? (
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <Box position="relative">
          {/* Left Arrow */}
          <IconButton
            aria-label="Previous Slide"
            icon={<ArrowBackIcon />}
            position="absolute"
            left={isLargerThan1024 ? "-50px" : "-20px"}
            top="50%"
            transform="translateY(-50%)"
            zIndex="2"
            onClick={() => sliderRef.slickPrev()}
            colorScheme="blue"
            display={products.length > (isLargerThan1024 ? 5 : isLargerThan768 ? 3 : 1) ? "block" : "none"}
          />

          <Slider ref={(slider) => (sliderRef = slider)} {...settings}>
            {products.map((product) => (
              <Box key={product._id} p={4} textAlign="center">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  boxSize={isLargerThan1024 ? "250px" : isLargerThan768 ? "200px" : "150px"}
                  objectFit="cover"
                  borderRadius="md"
                  mx="auto"
                />
                <Text fontWeight="bold" mt={2} fontSize={isLargerThan1024 ? "lg" : "md"} textDecoration={'underline'}>
                  <Link to={`/product/${product._id}`}>{product.name}</Link>
                </Text>
                <Text color="gray.500" fontSize={isLargerThan768 ? "md" : "sm"}>
                  {product.brand}
                </Text>
                <Text color="red.500" fontWeight="bold" fontSize={isLargerThan768 ? "lg" : "md"}>
                  ₹{product.price}
                </Text>
                <Button
                  w="100%"
                  backgroundColor="blue.500"
                  color="white"
                  border="1px solid"
                  mt={2}
                  onClick={() => handleQuickView(product)}
                >
                  QUICK VIEW
                </Button>
              </Box>
            ))}
          </Slider>

          {/* Right Arrow */}
          <IconButton
            aria-label="Next Slide"
            icon={<ArrowForwardIcon />}
            position="absolute"
            right={isLargerThan1024 ? "-50px" : "-20px"}
            top="50%"
            transform="translateY(-50%)"
            zIndex="2"
            onClick={() => sliderRef.slickNext()}
            colorScheme="blue"
            display={products.length > (isLargerThan1024 ? 5 : isLargerThan768 ? 3 : 1) ? "block" : "none"}
          />
        </Box>
      )}

      {/* Quick View Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={isLargerThan768 ? "lg" : "md"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProduct && (
              <Box textAlign="center">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  boxSize={isLargerThan1024 ? "300px" : "250px"}
                  objectFit="cover"
                  borderRadius="md"
                  mx="auto"
                />
                <Text fontWeight="bold" mt={2} fontSize="xl">
                  {selectedProduct.name}
                </Text>
                <Text color="gray.500" fontSize="lg">
                  {selectedProduct.brand}
                </Text>
                <Text color="red.500" fontWeight="bold" fontSize="xl">
                  ₹{selectedProduct.price}
                </Text>
                <Text mt={2} fontSize="md" color="gray.600">
                  {selectedProduct.description}
                </Text>
                <Select placeholder="Select Size" mt={3} onChange={(e)=>setSelectSize(e.target.value)}>
          {selectedProduct.size.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </Select>
        <Box mt={4} display="flex" alignItems="center" justifyContent="center">
          <Button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))} size="sm" colorScheme="red">-</Button>
          <Text mx={3} fontSize="lg">{quantity}</Text>
          <Button onClick={() => setQuantity((prev) => prev + 1)} size="sm" colorScheme="green">+</Button>
        </Box>
        
        <Button colorScheme="blue" w={'100%'} mt={5} onClick={addToCart}>
      ADD TO CART ({quantity})
    </Button><br />
                <Button  bgColor={'white'} color={'blue.500'} w={'100%'}  onClick={addToWishlist}>
                 + Add to wishlist
                </Button>
                
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCarousel;
