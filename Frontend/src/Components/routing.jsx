import { Routes, Route } from "react-router-dom";
import Home from "../Pages/home";
import New from "../Pages/new";
import Men from "../Pages/men";
import Women from "../Pages/women";
import Kids from "../Pages/kids";
import Bags from "../Pages/bags";
import Cart from "../Pages/cart";
import WishList from "../Pages/wishlist";
import SingleProductPage from "../Pages/singleProductPage";
import ProtectedRoute from "../Routes/protectedRoute";

function Routing() {
  return (
    <Routes>
      {/* Corrected Home route */}
      <Route path="/" element={<Home />} />

      {/* Other routes */}
      
      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />
      <Route path="/kids" element={<Kids />} />
      <Route path="/bags" element={<Bags />} />
      

      {/* Protected Route*/}
      <Route element={<ProtectedRoute/>}>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/wishlist" element={<WishList/>}/>
      </Route>

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<h1>404 Not Found</h1>} />

      <Route path="/product/:id" element={<SingleProductPage/>}/>
    </Routes>
  );
}

export default Routing;
