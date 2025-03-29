import { useState,useEffect } from "react";
import MainPageElements from "../Components/mainPageEle";
import SkeletonStr from "../Components/skeleton";
import Navbar from "../Components/navbar";
import DisplayProduct from "../Components/displayProduct";

function Women (){
    const [womenProd, setWomenProd] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
  
    async function getWomensProduct() {
      try {
        let response = await fetch(`https://nord-storm.onrender.com/products?category=Women`);
        let data = await response.json();
        setWomenProd(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    }
  
    useEffect(() => {
      getWomensProduct();
    }, []);
  
    return (
      <>
      <MainPageElements/>
       <Navbar/>
  
        {loading ? (
          // Show Skeletons while loading
          <SkeletonStr/>
        ) : (<>
         
          <DisplayProduct products={womenProd} />
          </>
        )}
      </>
    );
}
export default Women