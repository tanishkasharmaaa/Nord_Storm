import { Button, useToast } from "@chakra-ui/react";

function ToastForCart({ selectedProduct, quantity, AddProductToCart, selectSize }) {
  const toast = useToast();

  const handleAddToCart = async () => {
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

    // 🚀 Code below will run ONLY if size is selected
    const response = await AddProductToCart(selectedProduct, selectSize, quantity);
    console.log(response); 

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
        title: "Login please",
        description: response?.data?.message || "Something went wrong! Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (<>
    <Button colorScheme="blue" mr={3} onClick={handleAddToCart}>
      ADD TO CART ({quantity})
    </Button>
    <br />
    </>
  );
}

export default ToastForCart;
