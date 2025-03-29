import { useEffect, useState } from "react";
import { Box, Skeleton, SkeletonText, SimpleGrid } from "@chakra-ui/react";
import DisplayProduct from "../Components/displayProduct";
import Navbar from "../Components/navbar";
import MainPageElements from "../Components/mainPageEle";
import SkeletonStr from "../Components/skeleton";

function Men() {
  const [menProd, setMenProd] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  async function getMensProduct() {
    try {
      let response = await fetch(`https://nord-storm.onrender.com/products?category=Men`);
      let data = await response.json();
      setMenProd(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  }

  useEffect(() => {
    getMensProduct();
  }, []);

  return (
    <>
    <MainPageElements/>
     <Navbar/>

      {loading ? (
        // Show Skeletons while loading
        <SkeletonStr/>
      ) : (
        // Show actual products once data is loaded
        <DisplayProduct products={menProd} />
      )}
    </>
  );
}

export default Men;
