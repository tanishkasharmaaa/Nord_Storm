import { useEffect, useState } from "react";
import { Box, Button, Heading, Text, VStack, Badge, useToast, Image, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import MainPageElements from "../Components/mainPageEle";
import Navbar from "../Components/navbar";
import ProductCarousel from "../Components/productCarousal";
import { Footer } from "../Components/footer";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("authToken");
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      if (!token) {
        console.error("No auth token found!");
        return;
      }

      const response = await fetch("https://nord-storm.onrender.com/products/allOrders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Failed to fetch orders",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`https://nord-storm.onrender.com/products/orderDelete/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setOrders(orders.filter(order => order._id !== orderId));
        toast({
          title: "Order Cancelled",
          description: "Your order has been successfully cancelled.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Cancellation Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (<>
  <MainPageElements/>
  <Navbar/>
    <VStack spacing={4} align="stretch" p={5}>
      <Heading size="lg" textAlign="center">Order History</Heading>
      {orders.length === 0 ? (
        <Text textAlign="center">No orders found.</Text>
      ) : (
        orders.map((order) => (
          <Box key={order._id} p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
            <Text fontSize="lg" fontWeight="bold">Order ID: {order._id}</Text>
            <Badge colorScheme={
              order.orderStatus === "Processing" ? "yellow" : order.orderStatus === "Completed" ? "green" : "red"
            }>{order.orderStatus}</Badge>
            <Text>Total: ₹{order.totalAmount}</Text>
            <Text>Transaction Type: {order.paymentMethod}</Text>
            <Text>Order Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
            
            <Accordion allowToggle mt={3}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">View Products</Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {order.items.map((item, index) => (
                    <Box key={index} borderWidth={1} borderRadius="md" p={3} mb={2} boxShadow="sm">
                      <Image src={item.images[0]} alt={item.name} boxSize="50px" borderRadius="md" />
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text>Color: {item.color}</Text>
                      <Text>Price: ₹{item.price}</Text>
                      <Text>Stock: {item.quantity}</Text>
                    </Box>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {order.orderStatus === "Processing" && (
              <Button mt={2} colorScheme="red" size="sm" onClick={() => cancelOrder(order._id)}>
                Cancel Order
              </Button>
            )}
          </Box>
        ))
      )}
    </VStack>
    <Box >
  <Text fontSize="3xl" fontWeight="bold" color="blue.700" pl={5} mb={4} letterSpacing="wide">
    Look for More Products
  </Text>
</Box>

<ProductCarousel category={''} />
<Footer/>
    </>
  );
};

export default OrderHistory;
