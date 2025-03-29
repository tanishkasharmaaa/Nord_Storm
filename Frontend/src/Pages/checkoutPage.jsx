import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import {useNavigate} from 'react-router-dom'
import { useEffect } from "react";

function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [upiPin, setUpiPin] = useState("");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (Object.values(address).some((value) => !value.trim())) {
      alert("Please fill out all address fields.");
      return;
    }

    if (paymentMethod === "UPI" && (!/^\d{4}$/.test(upiPin))) {
      alert("Please enter a valid 4-digit UPI PIN.");
      return;
    }

    alert("Order Placed Successfully!");
    navigate("/");  // ✅ Ensure this works
  };

  return (
    <Box maxW="600px" mx="auto" p={5} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Checkout
      </Text>

      {/* Address Section */}
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input name="name" value={address.name} onChange={handleAddressChange} placeholder="John Doe" required />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="123-456-7890" required />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Street Address</FormLabel>
          <Input name="street" value={address.street} onChange={handleAddressChange} placeholder="123 Main St" required />
        </FormControl>

        <Stack direction="row">
          <FormControl isRequired>
            <FormLabel>City</FormLabel>
            <Input name="city" value={address.city} onChange={handleAddressChange} placeholder="New York" required />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>State</FormLabel>
            <Input name="state" value={address.state} onChange={handleAddressChange} placeholder="NY" required />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Zip Code</FormLabel>
            <Input name="zip" value={address.zip} onChange={handleAddressChange} placeholder="10001" required />
          </FormControl>
        </Stack>
      </VStack>

      <Divider my={5} />

      {/* Payment Section */}
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        Payment Method
      </Text>
      <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
        <Stack direction="column">
          <Radio value="Credit Card">Credit Card</Radio>
          <Radio value="UPI">UPI</Radio>
          <Radio value="COD">Cash on Delivery (COD)</Radio>
        </Stack>
      </RadioGroup>

      {/* UPI PIN Input */}
      {paymentMethod === "UPI" && (
        <FormControl mt={4} isRequired>
          <FormLabel>Enter UPI PIN</FormLabel>
          <Input
            type="password"
            maxLength={4}
            value={upiPin}
            onChange={(e) => setUpiPin(e.target.value)}
            placeholder="****"
            required
          />
        </FormControl>
      )}

      <Button colorScheme="blue" mt={5} width="full" onClick={handlePlaceOrder}>
        Place Order
      </Button>
    </Box>
  );
}

// const CheckoutPage=()=>{
//   const [cart,setCart] =useState([]);
//   const [totalAmount,setTotalAmount] = useState(0);
//   const [address,setAddress] = useState({
//     fullName:"",
//     street:"",
//     city:"",
//     state:"",
//     country:"",
//     zipCode:"",
//     phoneNumber:""
//   })
//   const [ paymentMethod,setPaymentMethod] =useState("COD");
//   const navigate = useNavigate();

//   useEffect(()=>{
//     const savedCart = JSON
//   })
// }

export default CheckoutPage;
