import { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import slider_img_1 from "../assets/slider_img_1.png";
import slider_img_2 from "../assets/slider_img_2.png";
import slider_img_3 from "../assets/slider_img_3.png";

function Slider() {
  const arrImage = [
    { img: slider_img_1, link: "/men" },
    { img: slider_img_2, link: "/women" },
    { img: slider_img_3, link: "/bags" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % arrImage.length);
        setIsFading(false); // Start fade-in
      }, 500); // Fade-out duration (matches CSS transition)
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="relative"
      w="100%"
      maxW="1200px"
      h={{ base: "250px", md: "400px", lg: "500px" }}
      m="auto"
      overflow="hidden"
      borderRadius="xl"
      boxShadow="lg"
    >
      <Link to={arrImage[currentIndex].link}>
        <Image
          src={arrImage[currentIndex].img}
          alt={`Slide ${currentIndex + 1}`}
          w="100%"
          h="100%"
          objectFit="cover"
          position="absolute"
          opacity={isFading ? 0 : 1}
          transition="opacity 0.5s ease-in-out"
        />
      </Link>
    </Box>
  );
}

export default Slider;
