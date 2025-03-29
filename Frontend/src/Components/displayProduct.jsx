import { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Checkbox,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Grid,
  Image,
  Text,
  useMediaQuery,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

function DisplayProduct({ products }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(10000);
  const [selectedColor, setSelectedColor] = useState([]);
  const [dialogId, setDialogId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectSize,setSelectedSize] =useState("")

  const handleDialog = (id) => {
    setDialogId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDialogId(null);
    setIsModalOpen(false);
  };

  const toggleDrawer = () => setIsOpen(!isOpen);

  const brands = [...new Set(products.map((p) => p.brand))];
  const colors = [...new Set(products.map((p) => p.color))];

  const filteredProducts = products.filter(
    (p) =>
      (selectedBrand.length === 0 || selectedBrand.includes(p.brand)) &&
      p.discount >= discount &&
      p.price <= price &&
      (selectedColor.length === 0 || selectedColor.includes(p.color))
  );

  const selectedProduct = products.find((p) => p._id === dialogId);

  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const AddProductToCart = async (selectedProduct) => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username"); // No need for JSON.stringify()
    
    if (!selectSize) { // Check if size is empty
        alert("Please choose the size first");
        return;
    }

    const prod = {
        product_id: selectedProduct._id,
        username: username, // Use it directly
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        category: selectedProduct.category,
        brand: selectedProduct.brand,
        size: selectSize, // Ensure this variable is defined
        color: selectedProduct.color,
        discount: selectedProduct.discount,
        stock: quantity, // Ensure this variable is defined
        images: selectedProduct.images,
        rating: selectedProduct.rating,
        reviews: selectedProduct.reviews,
    };

    try {
        const response = await fetch(`https://nord-storm.onrender.com/cartUpdate/${selectedProduct._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              product_id: selectedProduct._id,
              username: username, // Use it directly
              name: selectedProduct.name,
              description: selectedProduct.description,
              price: selectedProduct.price,
              category: selectedProduct.category,
              brand: selectedProduct.brand,
              size: selectSize, // Ensure this variable is defined
              color: selectedProduct.color,
              discount: selectedProduct.discount,
              stock: quantity, // Ensure this variable is defined
              images: selectedProduct.images,
              rating: selectedProduct.rating,
              reviews: selectedProduct.reviews
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Product updated:", data);
    } catch (error) {
        console.error("Error updating product:", error.message);
    }
};

  return (
    <Box p={4}>
      <Button colorScheme="gray" color="black" onClick={toggleDrawer} m={1}>
        Filters
      </Button>

      <Drawer isOpen={isOpen} placement="left" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter Products</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Box>
                <b>Brand:</b>
                {brands.map((brand) => (
                  <Checkbox
                    key={brand}
                    isChecked={selectedBrand.includes(brand)}
                    onChange={(e) => {
                      setSelectedBrand(
                        e.target.checked
                          ? [...selectedBrand, brand]
                          : selectedBrand.filter((b) => b !== brand)
                      );
                    }}
                  >
                    {brand}
                  </Checkbox>
                ))}
              </Box>

              <Box>
                <b>Minimum Discount:</b>
                <Slider
                  min={0}
                  max={50}
                  step={5}
                  value={discount}
                  onChange={setDiscount}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text>{discount} % or more</Text>
              </Box>

              <Box>
                <b>Max Price:</b>
                <Slider
                  min={0}
                  max={10000}
                  step={500}
                  value={price}
                  onChange={setPrice}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text>Up to ₹{price}</Text>
              </Box>

              <Box>
                <b>Color:</b>
                {colors.map((color) => (
                  <Checkbox
                    key={color}
                    isChecked={selectedColor.includes(color)}
                    onChange={(e) => {
                      setSelectedColor(
                        e.target.checked
                          ? [...selectedColor, color]
                          : selectedColor.filter((c) => c !== color)
                      );
                    }}
                  >
                    {color}
                  </Checkbox>
                ))}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
                <Link to={`/product/${product._id}`}>
                  <Text fontWeight="bold" textDecoration={"underline"}>
                    {product.name}
                  </Text>
                </Link>
                <Text color={"grey"}>{product.brand}</Text>
                <Text color="red" fontWeight="bold">
                  ${product.price}{" "}
                  <Text
                    as="span"
                    color="gray.500"
                  >{`${product.discount}% off`}</Text>
                </Text>
                <Box className="rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Text
                      key={i}
                      as="span"
                      color={
                        i < Math.floor(product.rating) ? "blue.500" : "gray.300"
                      }
                    >
                      ★
                    </Text>
                  ))}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Text
            gridColumn="span 4"
            textAlign="center"
            fontSize="24px"
            color="red"
          >
            No Products Found
          </Text>
        )}
      </Grid>

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
                <b>Brand:</b> {selectedProduct.brand}
              </Text>
              <Text>
                <b>Price:</b> ${selectedProduct.price}
              </Text>
              <Text>
                <b>Discount:</b>{" "}
                <span style={{ color: "red" }}>
                  {selectedProduct.discount}% off
                </span>
              </Text>
              <Text>
                <b>Color:</b> {selectedProduct.color}
              </Text>
              <Text mt={2}>
                <b>Description:</b> {selectedProduct.description}
              </Text>

              <Select  placeholder="Select Size" mt={3} onChange={(e) => setSelectedSize(e.target.value)} required>
                {selectedProduct.size.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </Select>

              {/* Quantity Selector */}
              <Box
                mt={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  size="sm"
                  colorScheme="red"
                >
                  -
                </Button>
                <Text mx={3} fontSize="lg">
                  {quantity}
                </Text>
                <Button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  size="sm"
                  colorScheme="green"
                >
                  +
                </Button>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => AddProductToCart(selectedProduct)}
              >
                ADD TO CART ({quantity})
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

export default DisplayProduct;
