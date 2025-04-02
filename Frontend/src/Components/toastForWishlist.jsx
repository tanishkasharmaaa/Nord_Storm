import { Button, useToast } from "@chakra-ui/react";
import { Link ,Text} from "@chakra-ui/react";

function ToastForWishlist({ selectedProduct, quantity, AddProductToWishlist, selectSize }){
    const toast = useToast();

  const handleAddToWishlist = async () => {
    if (!selectSize || selectSize.trim() === "") {  
      toast({
        title: "Size Required",
        description: "Please select a size before adding to wishlist.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;  // ⛔ STOP EXECUTION if no size is selected
    }

    // 🚀 Code below will run ONLY if size is selected
    const response = await AddProductToWishlist(selectedProduct, selectSize, quantity);
    console.log(response); 

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
        title: "Already in wishlist",
        description: `${selectedProduct.name} is already in your wishlist.`,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } 
    else {
      toast({
        title: "Login Please",
        description: response?.data?.message || "Something went wrong! Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

 
    return(
        <Link as={'button'}>
         <Text color={'blue.500'} textDecoration={'underline'}  colorScheme="blue" mr={3} onClick={handleAddToWishlist}>
            + Add to wishlist
         </Text>
        </Link>
    )
}
export default ToastForWishlist