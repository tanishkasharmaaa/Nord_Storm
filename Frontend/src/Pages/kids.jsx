import { useEffect , useState} from "react";
import MainPageElements from "../Components/mainPageEle";
import Navbar from "../Components/navbar";
import SkeletonStr from "../Components/skeleton";
import DisplayProduct from "../Components/displayProduct";
import { Footer } from "../Components/footer";

function Kids(){
    const [kidProd, setKidProd] = useState([]);
    const [loading, setLoading] = useState(true); 
  
    async function getKidsProduct() {
      try {
        let response = await fetch(`https://nord-storm.onrender.com/products?category=Kids`);
        let data = await response.json();
        setKidProd(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    }
  
    useEffect(() => {
      getKidsProduct();
    }, []);
  
    return (
      <>
      <MainPageElements/>
       <Navbar/>
  
        {loading ? (
        
          <SkeletonStr/>
        ) : (<>
         
          <DisplayProduct products={kidProd} />
          </>
        )}
        <Footer/>
      </>
    );
}

export default Kids