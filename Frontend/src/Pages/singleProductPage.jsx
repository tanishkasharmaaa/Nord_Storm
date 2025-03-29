import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/navbar";
import MainPageElements from "../Components/mainPageEle";
import {
  Button,
  Box,
  Image,
  Text,
  Spinner,
  Radio,
  RadioGroup,
  Stack,
  Flex,
  Skeleton,
  SkeletonText,
  Textarea
} from "@chakra-ui/react";
import { Coins, ShoppingBag, Heart, Gift, DollarSign } from "lucide-react";
import ProductCarousel from "../Components/productCarousal";

function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedOption, setSelectedOption] = useState("pickup");
const [quantity, setQuantity] = useState(1);
const [newReview, setNewReview] = useState("");
const [reviews, setReviews] = useState([]); 

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
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  const addReview = () => {
    if (newReview.trim()) {
      setReviews([...reviews, newReview]);
      setNewReview("");
    }
  };

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
        <Box flex="1">
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
      {/* Reviews Section */}
      <Box p={6} mt={10} borderWidth={1} borderRadius="lg" shadow="md">
        <Text fontSize="2xl" fontWeight="bold">Customer Reviews</Text>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Box key={index} p={3} borderBottom="1px solid gray">
              <Text>{review}</Text>
            </Box>
          ))
        ) : (
          <Text color="gray.500">No reviews yet. Be the first to review!</Text>
        )}
        <Box mt={4}>
          <Textarea
            placeholder="Write a review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <Button mt={2} colorScheme="blue" onClick={addReview}>Submit Review</Button>
        </Box>
        </Box>
      <ProductCarousel category={product.category} />
    </>
  );
}

export default SingleProductPage;
