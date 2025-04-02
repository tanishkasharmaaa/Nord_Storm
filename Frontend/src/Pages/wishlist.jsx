import { useEffect, useState } from 'react'
import MainPageEle from '../Components/mainPageEle'
import Navbar from '../Components/navbar'
import {
  Box, Button, Flex, Image, Text, useMediaQuery, Modal, ModalBody, ModalContent, ModalHeader,
  ModalCloseButton, ModalFooter, ModalOverlay, Select,Heading,VStack,Center
} from '@chakra-ui/react'
import { Link,useNavigate } from 'react-router-dom'
import { Grid } from '@chakra-ui/react'
import { Footer } from '../Components/footer'


function WishList() {
  const [wishlistItems, setwishlistItems] = useState([]);
  const [dialogId, setDialogId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
const navigate = useNavigate()
  const handleDialog = (id) => {
    setDialogId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDialogId(null);
    setIsModalOpen(false);
    setSelectedSize('');
    setQuantity(1);
  };

  


  const handleWishlistData = async () => {
    try {
      let token = localStorage.getItem("authToken");

      let response = await fetch(`https://nord-storm.onrender.com/products/wishlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
      setwishlistItems(data.displayWishListItems||[]);
    } catch (error) {
      console.log("Error fetching cart data:", error.message);
    }
  };

  async  function removeProdFromWishlist (selected){
    try {
      let token = localStorage.getItem("authToken");
      let response = await fetch(`https://nord-storm.onrender.com/products/wishlistDelete/${selected}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
      alert("product remove from wishlist")
      setIsModalOpen(false)
      handleWishlistData()
    } catch (error) {
      console.log("Error fetching cart data:", error.message);
    }
  }

  async function addToCart(selectedProduct) {
    console.log("Selected Product:", selectedProduct);

    if (!selectedProduct) {
        console.error("Error: selectedProduct is undefined or null", selectedProduct);
        return { status: 400, data: { message: "Invalid product object" }, ok: false };
    }

    if (!selectedProduct._id) {
        console.error("Error: Product ID is undefined", selectedProduct);
        return { status: 400, data: { message: "Invalid product ID" }, ok: false };
    }

    console.log("Adding to cart:", selectedProduct._id);

    const token = localStorage.getItem("authToken");
    if (!token) {
        return { status: 401, data: { message: "Unauthorized: No token provided" }, ok: false };
    }

    try {
        const response = await fetch(`http://localhost:3000/products/cartUpdate/${selectedProduct._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: selectedProduct._id,
                username: localStorage.getItem("username") || "Guest",
                name: selectedProduct.name || "Unknown",
                description: selectedProduct.description || "No description",
                price: selectedProduct.price || 0,
                category: selectedProduct.category || "Uncategorized",
                brand: selectedProduct.brand || "Unknown",
                size: selectedProduct.size,
                color: selectedProduct.color || "N/A",
                discount: selectedProduct.discount || 0,
                stock: selectedProduct.stock || 1,
                images: selectedProduct.images || [],
                rating: selectedProduct.rating || 0,
                reviews: selectedProduct.reviews || []
            })
        });

        const data = await response.json();
        console.log("Cart update response:", data);

        setIsModalOpen(false);

        alert("Removed from wishlist and added to cart");
        
        handleWishlistData()
        
        return { status: response.status, data, ok: response.ok };

    } catch (error) {
        console.error("Error adding to cart:", error);
        return { status: 500, data: { message: error.message }, ok: false };
    }
}


  useEffect(() => {
    handleWishlistData();
  }, []);

  const selectedProduct = wishlistItems.find((p) => p._id === dialogId);

  return (
    <>
      <MainPageEle />
      <Navbar />
      
      {wishlistItems.length === 0 ? (
  <>
    <Flex display={'block'} justify="center" align="center" p={2} px={5}>
      <Heading
        fontFamily="Poppins, sans-serif"
        fontSize={["30px", "40px", "50px"]}
        color="gray.400"
        textAlign="center"
        fontStyle={'italic'}
      >
        Add Something to wishlist
      </Heading>
    </Flex>
    <Flex justify={'center'}>
      <Button as={'button'} onClick={() => navigate('/')}>
        GO BACK & ADD ITEMS
      </Button>
    </Flex>
  </>
) : (
  <Grid
    templateColumns={
      isLargerThan1024
        ? "repeat(5, 1fr)"
        : isLargerThan768
          ? "repeat(3, 1fr)"
          : "repeat(2, 1fr)"
    }
    gap={6}
    fontSize="15px"
    mt={4}
  >
    {wishlistItems.map((product) => (
      <Box
        key={product._id}
        p={4}
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        boxShadow="sm"
      >
        <Box display="flex" justifyContent="center">
          <Image
            boxSize="230px"
            objectFit="cover"
            src={product.images[0]}
            alt={product.name}
          />
        </Box>
        <Box>
          <Button
            w="100%"
            backgroundColor="transparent"
            color="white"
            border="1px solid "
            _hover={{
              color: "blue.500",
              border: "1px solid blue.500",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              transition: "0.3s ease-in-out",
            }}
            onClick={() => handleDialog(product._id)}
          >
            QUICK VIEW
          </Button>
        </Box>

        <Box fontFamily="Arial, sans-serif" pt={4}>
          <Link to={`/product/${product.product_id}`}>
            <Text fontWeight="bold" textDecoration={"underline"}>
              {product.name}
            </Text>
          </Link>
          <Text color={"grey"}>{product.brand}</Text>
          <Text color="red" fontWeight="bold">
            ${product.price}{" "}
            <Text as="span" color="gray.500">{`${product.discount}% off`}</Text>
          </Text>
          <Box className="rating">
            {Array.from({ length: 5 }, (_, i) => (
              <Text
                key={i}
                as="span"
                color={i < Math.floor(product.rating) ? "blue.500" : "gray.300"}
              >
                ★
              </Text>
            ))}
          </Box>
        </Box>
      </Box>
    ))}
  </Grid>
)}


      {/* Modal for Product Details */}
      {selectedProduct && (
        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedProduct.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                boxSize="300px"
                mx="auto"
              />
              <Text mt={4}>
                <b>Brand :</b> {selectedProduct.brand}
              </Text>
              <Text>
                <b>Price :</b> ${selectedProduct.price}
              </Text>
              <Text>
                <b>Discount :</b>{" "}
                <span style={{ color: "red" }}>
                  {selectedProduct.discount}% off
                </span>
              </Text>
              <Text>
                <b>Color : </b> {selectedProduct.color}
              </Text>
              <Text mt={2}>
                <b>Description : </b> {selectedProduct.description}
              </Text>

              <Text><b>Size : </b> {selectedProduct.size}</Text>

              {/* Quantity Selector */}
              <Text><b>Quantity : </b> {selectedProduct.stock}</Text>
            </ModalBody>

            <ModalFooter>
                <Box>
              <Button colorScheme="blue" onClick={() => removeProdFromWishlist(selectedProduct._id)}>
                Remove from Wishlist
              </Button><br />
              <Button bgColor={'white'} color={'blue.500'} onClick={() => addToCart(selectedProduct)}>
                + Add to cart
              </Button>
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Footer/>
    </>
  );
}

export default WishList;