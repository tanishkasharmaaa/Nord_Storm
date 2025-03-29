
import { jwtDecode } from "jwt-decode";
import MainPageElements from "../Components/mainPageEle";
import Navbar from "../Components/navbar";
import WelcomeUser from "../Components/welcomeUser";
import Slider from "../Components/slider";
import ProductCarousel from "../Components/productCarousal";
import { Heading,Image } from "@chakra-ui/react";
import first_banner from "../assets/first_banner.png"
import second_banner from "../assets/second_banner.png"
import third_banner from "../assets/third_banner.png"
import sixth_banner from "../assets/sixth_banner.png"

function Home() {
  const token = localStorage.getItem("authToken"); // No need for JSON.stringify
  if (token) {
    const decodedToken = jwtDecode(token)
    localStorage.setItem("username", JSON.stringify({ name:decodedToken.name, id: decodedToken.id })); // Fix storage
  }

  return (
    <>
      <MainPageElements />
      <Navbar />
      <WelcomeUser/>
      <Image src={first_banner}/><br />
      <Slider/>
      <Heading
          fontFamily="Poppins, sans-serif"
          fontSize={["30px", "40px", "50px"]}
          color="gray.400"
          textAlign="center"
          fontStyle={'italic'}
          pt={5}
        >
         Top Brands You'll Love
        </Heading>
      <ProductCarousel category={"Women"}/><br/>
      
      <Image src={second_banner}/><br />
      <Heading
          fontFamily="Poppins, sans-serif"
          fontSize={["30px", "40px", "50px"]}
          color="gray.400"
          textAlign="center"
          fontStyle={'italic'}
          pt={5}
        >
         Make you traveling easy
        </Heading>
      <ProductCarousel category={"Bags"}/><br/>
      <Image src={third_banner}/><br />
      <Heading
          fontFamily="Poppins, sans-serif"
          fontSize={["30px", "40px", "50px"]}
          color="gray.400"
          textAlign="center"
          fontStyle={'italic'}
          pt={5}
        >
         For kids fashion
        </Heading>
        <Image src={sixth_banner}/><br />
      <ProductCarousel category={"Kids"}/><br/>

    </>
  );
}

export default Home;
