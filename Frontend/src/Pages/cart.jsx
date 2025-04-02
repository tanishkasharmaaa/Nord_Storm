import { useEffect, useState } from 'react';
import MainPageEle from '../Components/mainPageEle';
import Navbar from '../Components/navbar';
import {
  Box, Button, Flex, Image, Text, useMediaQuery, Modal, ModalBody, ModalContent, ModalHeader,
  ModalCloseButton, ModalFooter, ModalOverlay, Select, Grid
} from '@chakra-ui/react';
import {Link, useNavigate } from 'react-router-dom';
import { Footer } from '../Components/footer';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
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

  async  function removeProdFromCart (selected){
    try {
      let token = localStorage.getItem("authToken");
      let response = await fetch(`https://nord-storm.onrender.com/products/cartDelete/${selected}`, {
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
      alert("product remove from cart")
      setIsModalOpen(false)
      handleCartData()
    } catch (error) {
      console.log("Error fetching cart data:", error.message);
    }
  }


  const handleCartData = async () => {
    try {
      let token = localStorage.getItem("authToken");
      let response = await fetch(`https://nord-storm.onrender.com/products/cart`, {
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
      setCartItems(data.displayCartItems||[]);
    } catch (error) {
      console.log("Error fetching cart data:", error.message);
    }
  };

  async function addToWishlist(selectedProduct) {
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
        const response = await fetch(`https://nord-storm.onrender.com/products/addbackToWishlist/${selectedProduct._id}`, {
            method: "POST",
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
        console.log("Wishlist update response:", data);

        setIsModalOpen(false);

        alert("Added to wishlist");
        
        handleCartData()
        
        return { status: response.status, data, ok: response.ok };

    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return { status: 500, data: { message: error.message }, ok: false };
    }
}



  useEffect(() => {
    handleCartData();
  }, []);

  const selectedProduct = cartItems.find((p) => p._id === dialogId);

  const calculateTotalPrice = () => {
    return cartItems.reduce((acc, product) => acc + product.price * (product.stock || 1), 0) * 0.9;

    
  };
  

  return (
    <>
      <MainPageEle />
      <Navbar />
      <Flex direction={isLargerThan768 ? 'row' : 'column'} p={4}>
        <Box maxH={'500px'} zIndex={'auto'} flex={isLargerThan768 ? 2 : 1} mr={isLargerThan768 ? 6 : 0}>
        <Box maxH="500px" overflowY="auto" zIndex="auto" flex={isLargerThan768 ? 2 : 1} mr={isLargerThan768 ? 6 : 0}>
  <Grid templateColumns={isLargerThan1024 ? "repeat(2, 1fr)" : "repeat(2, 1fr)"} gap={6}>
    {cartItems.length>0?(cartItems.map((cartProd, index) => (
      <Box key={index} borderWidth={1} borderRadius="lg" p={4}>
        <Flex direction={isLargerThan768 ? 'row' : 'column'} align="center">
          <Box>
            <Image src={cartProd.images[0]} boxSize="150px" objectFit="cover" />
          </Box>
          <Box ml={isLargerThan768 ? 4 : 0} mt={isLargerThan768 ? 0 : 4}>
            <Text fontWeight="bold" textDecoration={'underline'}><Link to={`/product/${cartProd.product_id}`}>{cartProd.name}</Link></Text>
            <Text fontStyle="italic">{cartProd.description}</Text>
            <Text mt={2}>
              <b>Color:</b> {cartProd.color}
            </Text>
            <Text mt={2}>
              <b>Size</b> {cartProd.size}
            </Text>
            <Text mt={2}>
              <b>{cartProd.price}</b> <span style={{ color: 'grey' }}>{cartProd.discount}% off</span>
            </Text>
            {/* Quick View Button */}
            <Button mt={3} colorScheme="blue" onClick={() => handleDialog(cartProd._id)}>
              Quick View
            </Button>
          </Box>
        </Flex>
      </Box>
    ))):(<>
    <Text>No Product found</Text>
    </>)}
  </Grid>
</Box>

        </Box>

        <Box flex={1} mt={isLargerThan768 ? 0 : 4}>
          <Box borderWidth={1} p={4} borderRadius="lg" bgColor="white">
            <Text fontSize="lg" fontWeight="bold">Order Summary</Text>
            <Box mt={4}>
              <Text>Total Price: ${cartItems.length>0?(cartItems.reduce((acc,curr)=>acc+curr.price*curr.stock,0)):null}</Text>
              <Text>Discount: 10% off</Text>
              <Text>Quantity: {cartItems.length>0?(cartItems.length):null}</Text>
              <Text fontWeight="bold" mt={2}>
                Final Price: ${Math.floor(calculateTotalPrice())}
              </Text>
              <Button  colorScheme="blue" mt={4} width="full" onClick={()=>navigate("/checkout")}>
                Checkout
              </Button>
            </Box>
          </Box>
        </Box>
      </Flex>

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
                <Button colorScheme="blue" onClick={() => removeProdFromCart(selectedProduct._id)}>
                  Remove from Cart
                </Button><br />
                <Button color={'blue.500'} bgColor={'transparent'}onClick={() => addToWishlist(selectedProduct)}>
                  + Add to Wishlist
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

export default Cart;
