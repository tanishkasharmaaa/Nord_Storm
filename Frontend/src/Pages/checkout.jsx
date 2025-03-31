import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Text,
  Divider,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phoneNumber: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/login");

      const response = await fetch(
        "https://nord-storm.onrender.com/products/cart",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch cart");

      setCart(data.displayCartItems);
      const amount = data.displayCartItems.reduce(
        (sum, item) => sum + item.price * (item.stock || 1),
        0
      ) * 0.9; // Apply 10% discount

      setTotalAmount(Math.floor(amount));
    } catch (error) {
      console.error("Cart error:", error);
      alert("Error fetching cart items");
    }
  };

  const placeOrder = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) return navigate("https://nord-storm.onrender.com/auth/google");

        // console.log("🔵 Sending request to backend...");
        console.log("📌 Request Body:", {
            items: cart,
            totalAmount,
            paymentMethod,
            address,
        });

        const response = await fetch("https://nord-storm.onrender.com/products/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: cart.map((item) => ({
                ...item,
                quantity: item.stock,  // Ensure quantity is included
              })),
              totalAmount,
              paymentMethod,
              address,
            }),
            
        });

       
        const data = await response.text(); // Read response as text
       

        if (!response.ok) throw new Error(data || "Order failed");

        alert("Order placed successfully!");
        setCart([]); 
        navigate("/orderHistory");
    } catch (error) {
        console.error("Order error:", error);
    }
};


  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={5} p={5}>
      <Box flex={1} p={5} borderWidth="1px" borderRadius="lg" boxShadow="lg">
        <Heading as="h3" size="xl" textAlign="center" mb={5}>
          Checkout
        </Heading>
        <Heading as="h3" size="md" fontWeight="bold">
          Total Amount: <span style={{ color: "green" }}>${totalAmount}</span>
        </Heading>
        <Divider my={4} />

        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="md" color="green">
            Shipping Address
          </Heading>
          {Object.keys(address).map((key) => (
            <FormControl key={key} isRequired>
              <FormLabel>{key.replace(/([A-Z])/g, " $1").trim()}</FormLabel>
              <Input
                name={key}
                value={address[key]}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={key}
              />
            </FormControl>
          ))}
        </VStack>

        <Divider my={4} />

        <Heading as="h3" size="md">Payment Method</Heading>
        <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="COD">Cash on Delivery</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
        </Select>

        <Button colorScheme="blue" mt={5} width="full" onClick={placeOrder}>
          Place Order
        </Button>
      </Box>

      <Box flex={1} borderWidth="1px" borderRadius="lg" p={5} overflowY="auto" maxH="1000px">
        <Heading as="h3" size="lg" mb={4} textAlign="center">
          Final Products
        </Heading>
        {cart.length > 0 ? (
          cart.map((item) => (
            <Flex key={item._id} p={3} borderBottom="1px solid gray" align="center" gap={3}>
              <Image src={item.images[0]} boxSize={{ base: "100px", md: "150px" }} objectFit="cover" />
              <Box>
                <Text fontSize="lg" fontWeight="bold">{item.name}</Text>
                <Text>Price: ${item.price}</Text>
                <Text>Quantity: {item.quantity || 1}</Text>
                <Text>Color: {item.color}</Text>
              </Box>
            </Flex>
          ))
        ) : (
          <Text textAlign="center">No items in cart</Text>
        )}
      </Box>
    </Flex>
  );
};

export default CheckoutPage;
