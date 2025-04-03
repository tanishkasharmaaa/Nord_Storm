import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/navbar";
import MainPageElements from "../Components/mainPageEle";
import {
  Button,
  Box,
  Image,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Flex,
  Skeleton,
  SkeletonText,
  Textarea,
  Select,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Coins, ShoppingBag, Heart, Gift, DollarSign } from "lucide-react";
import ProductCarousel from "../Components/productCarousal";
import ToastForCart from "../Components/toastForCart";
import { Footer } from "../Components/footer";

function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedOption, setSelectedOption] = useState("pickup");
const [quantity, setQuantity] = useState(1);
const [newReview, setNewReview] = useState("");
const [reviews, setReviews] = useState([]); 
const [rating, setRating] = useState(5);
const [selectSize,setSelectedSize] = useState("")
const toast = useToast();

  function WhiteBagIcon() {
    return <ShoppingBag size={24} color="white" />;
  }
  function EmptyHeartIcon() {
    return <Heart size={24} color="black" strokeWidth={1.5} />;
  }
  function BonusIcon() {
    return <Gift size={50} strokeWidth={1.5} />;
  }
  function DollarBox() {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="black"
        color="white"
        p={2}
        borderRadius="md"
        width="34px"
        height="34px"
      >
        <DollarSign size={54} />
      </Box>
    );
  }

  const getProduct = async () => {
    try {
      const response = await fetch(`https://nord-storm.onrender.com/products`);
      const data = await response.json();
      const foundProduct = data.products.find((prod) => prod._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setReviews(foundProduct.reviews)
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };


const addReview = async () => {
    if (!newReview.trim()) {
      toast({ title: "Comment cannot be empty", status: "error", duration: 3000 });
      return;
    }

    try {
      const response = await fetch(`https://nord-storm.onrender.com/products/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ comment: newReview, rating })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast({ title: "Review added successfully!", status: "success", duration: 3000 });
      setNewReview("");
      setRating(5);
      getProduct()
      // Optionally, refresh reviews list here
    } catch (error) {
      toast({ title: error.message || "Something went wrong", status: "error", duration: 3000 });
    }
  };

  async function addToCart() {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    // ✅ Handle missing token (Ask user to log in)
    if (!token) {
        toast({
            title: "Login Required",
            description: "Please log in to add items to your cart.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
        setTimeout(() => {
            window.location.href = "/login"; // 🔹 Redirect to login page (optional)
        }, 2000);
        return { status: 401, data: { message: "Unauthorized: No token provided" }, ok: false };
    }

    // ✅ Handle missing size
    if (!selectSize || selectSize.trim() === "") {
        toast({
            title: "Size Required",
            description: "Please select a size before adding to cart.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
        return;
    }

    try {
        const response = await fetch(
            `https://nord-storm.onrender.com/products/cartUpdate/${product._id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: product._id,
                    username: username || "Guest",
                    name: product.name || "Unknown",
                    description: product.description || "No description",
                    price: product.price || 0,
                    category: product.category || "Uncategorized",
                    brand: product.brand || "Unknown",
                    size: selectSize,
                    color: product.color || "N/A",
                    discount: product.discount || 0,
                    stock: quantity || 1,
                    images: product.images || [],
                    rating: product.rating || 0,
                    reviews: product.reviews || [],
                }),
            }
        );

        const data = await response.json();

        if (response?.status === 200) {
            toast({
                title: "Product Added",
                description: `${product.name} has been added to your cart.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } else if (response?.status === 409) {
            toast({
                title: "Already in Cart",
                description: `${product.name} is already in your cart.`,
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } else {
            toast({
                title: "Error",
                description: response?.data?.message || "Something went wrong! Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }

        return { status: response.status, data, ok: response.ok };
    } catch (error) {
        toast({
            title: "Server Error",
            description: error.message || "Something went wrong.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
        return { status: 500, data: { message: error.message }, ok: false };
    }
}

async function addToWishlist() {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    // ✅ Handle missing token (Ask user to log in)
    if (!token) {
        toast({
            title: "Login Required",
            description: "Please log in to add items to your wishlist.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
       
        return { status: 401, data: { message: "Unauthorized: No token provided" }, ok: false };
    }

    // ✅ Handle missing size
    if (!selectSize || selectSize.trim() === "") {
        toast({
            title: "Size Required",
            description: "Please select a size before adding to wishlist.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
        return;
    }

    try {
        const response = await fetch(
            `https://nord-storm.onrender.com/products/wishlistUpdate/${product._id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: product._id,
                    username: username || "Guest",
                    name: product.name || "Unknown",
                    description: product.description || "No description",
                    price: product.price || 0,
                    category: product.category || "Uncategorized",
                    brand: product.brand || "Unknown",
                    size: selectSize,
                    color: product.color || "N/A",
                    discount: product.discount || 0,
                    stock: quantity || 1,
                    images: product.images || [],
                    rating: product.rating || 0,
                    reviews: product.reviews || [],
                }),
            }
        );

        const data = await response.json();

        if (response?.status === 200) {
            toast({
                title: "Product Added",
                description: `${product.name} has been added to your wishlist.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } else if (response?.status === 409) {
            toast({
                title: "Already in Wishlist",
                description: `${product.name} is already in your wishlist.`,
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } else {
            toast({
                title: "Error",
                description: response?.data?.message || "Something went wrong! Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }

        return { status: response.status, data, ok: response.ok };
    } catch (error) {
        toast({
            title: "Server Error",
            description: error.message || "Something went wrong.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
        return { status: 500, data: { message: error.message }, ok: false };
    }
}

  useEffect(() => {
    getProduct();
  }, [id]);

  

  if (loading) {
    return (
      <Box display="flex" p={4} gap={8}>
        <Skeleton height="400px" width="50%" />
        <Box flex="1">
          <SkeletonText mt="4" noOfLines={2} spacing="4" />
          <Skeleton height="40px" mt="4" />
          <SkeletonText mt="4" noOfLines={3} spacing="4" />
          <Skeleton height="40px" mt="4" />
          <Skeleton height="50px" mt="4" />
          <Skeleton height="50px" mt="4" />
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Text fontSize="xl" color="red">
        Product not found
      </Text>
    );
  }

  return (
    <>
      <MainPageElements />
      <Navbar />
      <Box
        display="flex"
        p={4}
        gap={8}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box flex="1" justifyContent={'center'}>
          <Image
            src={product.images}
            alt={product.name}
            boxSize={{ base: "300px", md: "500px" }}
            objectFit="cover"
            borderRadius="md"
            shadow="md"
          />
        </Box>

        <Box flex="1">
          <Box className="rating">
            {Array.from({ length: 5 }, (_, i) => (
              <Text
                key={i}
                as="span"
                fontSize={"40px"}
                color={i < Math.floor(product.rating) ? "blue.500" : "gray.300"}
              >
                ★
              </Text>
            ))}
          </Box>
          <Text fontSize="2xl" fontWeight="bold">
            {product.name}
          </Text>
          <Text color="gray.500">{product.brand}</Text>
          <Text fontSize="xl" color="black" fontWeight="bold">
            ${product.price}
          </Text>
          <Text color="green.500">{product.discount}% Off</Text>
          <Text>
            Color - <b>{product.color}</b>
          </Text>
          <Text mt={2} color={"blue.500"}>
            {product.description}
          </Text>
          <br />
          <Text color="gray.600">
            <span>Customer says the fit runs </span>
            <b>true to size</b>
          </Text>

          <select
            style={{
              width: "100%",
              border: "1px solid gray",
              padding: "8px",
              borderRadius: "4px",
            }}
           onChange={(e)=>setSelectedSize(e.target.value)}
          >
            <option value="">Size</option>
            {product.size.map((size, index) => (
              <option key={index}>{size}</option>
            ))}
          </select>
          <Text color={"blue.400"} textDecoration={"underline"}>
            Size guide
          </Text>
          <br />

          <Box display="flex" alignItems="center" gap={3} p={2} borderRadius="md" boxShadow="sm" maxW={{ base: "140px", md: "180px" }}>
            <Text fontWeight={'bold'}> Quantity </Text>
            <Button size={{ base: "sm", md: "md" }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{quantity}</Text>
            <Button size={{ base: "sm", md: "md" }} onClick={() => setQuantity(quantity + 1)}>+</Button>
          </Box>

          <RadioGroup onChange={setSelectedOption} value={selectedOption}>
            <Box border="1px solid gray" p={4} borderRadius="md">
              <Stack direction="row" align="center">
                <Radio value="pickup" />
                <Text>
                  <b>Free pickup at </b>
                  <span style={{ color: "blue", textDecoration: "underline" }}>
                    choose store
                  </span>
                </Text>
              </Stack>
              <Text color="gray.500">
                Choose a store to see when it's ready for pickup
              </Text>
            </Box>
            <br />
            <Box border="1px solid gray" p={4} borderRadius="md">
              <Stack direction="row" align="center">
                <Radio value="shipping" />
                <Text>
                  <b>Free shipping on order $89+ to </b>
                  <span style={{ color: "blue", textDecoration: "underline" }}>
                    110041
                  </span>
                </Text>
              </Stack>
              <Text color="gray.500">
                Set a location to see when it will arrive
              </Text>
            </Box>
          </RadioGroup>
          <br />
          <Button
            p={6}
            bg={"blue.500"}
            color={"white"}
            w={"100%"}
            borderRadius={"md"}
            _hover={{ bg: "blue.600" }}
            onClick={addToCart}
          >
            <WhiteBagIcon /> Add to cart
          </Button>
          <br />
          <br />
          <Button
            border="1px solid blue"
            p={6}
            bg="white"
            color="blue.500"
            w="100%"
            borderRadius="md"
            _hover={{ bg: "blue.50" }}
            onClick={()=>addToWishlist()}
          >
            <EmptyHeartIcon /> Add to wishlist
          </Button>
          <br />
          <br />
          <Box bg={"gray.100"} p={5} fontSize={19} borderRadius="md">
            <Flex align="center" gap={2}>
              <BonusIcon />
              <Text>
                <b>Get a $40 Bonus Note</b> when you use a new Nordstrom credit
                card.{" "}
                <span style={{ textDecoration: "underline" }}>
                  See Restriction & Apply
                </span>
              </Text>
            </Flex>
          </Box>
          <br />
          <Text>Pay in 4 interest-free payments of $8.74 with</Text>
          <Flex align="center" gap={2}>
            <DollarBox />
            <Text fontSize={20}>
              <b>Afterpay or Paypal</b>
            </Text>
          </Flex>
        </Box>
      </Box>
      <Box >
  <Text fontSize="3xl" fontWeight="bold" color="blue.700" pl={5} mb={4} letterSpacing="wide">
    Look for More Products
  </Text>
</Box>

<ProductCarousel category={product.category} />

      {/* Reviews Section */}
      <Box p={6} mt={10} borderWidth={1} borderRadius="lg" shadow="lg" bg="white">
      <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={4}>
        Customer Reviews
      </Text>

      {reviews.length > 0 ? (
        <Accordion allowToggle>
          {reviews.map((review) => (
            <AccordionItem key={review._id} border="1px solid">
              <AccordionButton
                _expanded={{ bg: "blue.100" }}
                _hover={{ bg: "blue.50" }}
                p={4}
                borderRadius="md"
              >
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold" color="blue.500">
                    Customer ID: {review._id}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4} borderBottom="1px solid gray">
                <Text color="gray.700" mb={2}>{review.comment}</Text>
                <Box display="flex" gap={1}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Text
                      key={i}
                      as="span"
                      fontSize="24px"
                      color={i < Math.floor(review.rating) ? "yellow.400" : "gray.300"}
                    >
                      ★
                    </Text>
                  ))}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Text color="gray.500">No reviews yet. Be the first to review!</Text>
      )}

      {/* Review Input Form */}
      <Box mt={6} p={4} borderWidth={1} borderRadius="md" bg="white" shadow="md">
        <Textarea
          placeholder="Write a review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          size="md"
          borderColor="gray.300"
          _focus={{ borderColor: "blue.400" }}
        />
        <Select
          mt={3}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          borderColor="gray.300"
          _focus={{ borderColor: "blue.400" }}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? "s" : ""}
            </option>
          ))}
        </Select>
        <Button
          mt={3}
          colorScheme="blue"
          w="full"
          _hover={{ bg: "blue.600" }}
          onClick={addReview}
        >
          Submit Review
        </Button>
      </Box>
    </Box>
    <Footer/>
    </>
  );
}

export default SingleProductPage;
