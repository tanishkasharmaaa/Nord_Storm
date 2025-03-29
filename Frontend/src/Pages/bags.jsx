import { useState,useEffect } from "react";
import MainPageElements from "../Components/mainPageEle";
import SkeletonStr from "../Components/skeleton";
import Navbar from "../Components/navbar";
import DisplayProduct from "../Components/displayProduct";

function Bags(){
    const [bagProd, setBagProd] = useState([]);
    const [loading, setLoading] = useState(true); 
  
    async function getBagProduct() {
      try {
        let response = await fetch(`https://nord-storm.onrender.com/products?category=Bags`);
        let data = await response.json();
        setBagProd(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    }
  
    useEffect(() => {
      getBagProduct();
    }, []);
  
    return (
      <>
      <MainPageElements/>
       <Navbar/>
  
        {loading ? (
        
          <SkeletonStr/>
        ) : (<>
         
          <DisplayProduct products={bagProd} />
          </>
        )}
      </>
    );
}
export default Bags