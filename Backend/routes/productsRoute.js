const express = require("express");
const Product = require("../model/Product");
const authMiddleware = require("../middleware/authMiddleware");
const ProductRouter = express.Router();
const jwt = require("jsonwebtoken");
const wishList = require("../model/Wishlist");
require("dotenv").config()

ProductRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products: products.length });
  } catch (error) {
    res.status(400).json({error:error.message})
  }
});

// Add Products

ProductRouter.post("/addProduct", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand,
      size: req.body.size,
      color: req.body.color,
      discount: req.body.discount,
      stock: req.body.stock,
      images: req.body.images,
      rating: req.body.rating,
      reviews: req.body.reviews,
    });
    await product.save();
    res.status(200).json({ message: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD PRODUCTS TO WISHLIST AND UPDATE 


ProductRouter.patch("/wishlistUpdate/:id", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect(`http://localhost:${process.env.PORT}/auth/google`);
    }

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
      return res.status(400).json({ message: "Invalid token", error });
    }
    let product = await Product.findOne({_id:req.params.id})
  if(!product){
    return res.status(404).json({message:"Product not found"});
  }
 const checkInWishlist = await wishList.findOne({product_id:req.params.id})

 if(!checkInWishlist){
  
  let productAddToWishlist = new wishList({
    product_id:product._id,
    username:username,
    name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      size: req.body.size,
      color: product.color,
      discount: product.discount,
      stock: req.body.stock||1,
      images: product.images,
      rating: product.rating,
      reviews: product.reviews,
  })

    await productAddToWishlist.save();
  
   return res.status(200).json({ message: "Wishlist item successfully updated", productAddToWishlist });
 }
 else{
  res.status(400).json({message:"Already exist"})
 }


  } catch (error) {
    return res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

// DELETE FROM WISHLIST 

{/*  WILL WORK ON THIS TOMORROW */}
{/*
  -- CART FUNCTIONALITY
  -- CART FUNCTIONALITY FOR DELETE AND UPDATE
  -- ORDER HISTORY
  10:30 START
*/}

ProductRouter.delete("/wishlistDelete/:id", authMiddleware, async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect(`http://localhost:${process.env.PORT}/auth/google`);
    }

    let username;

    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.username; // Ensure this matches your JWT payload (email vs username)
    } catch (error) {
      return res.status(400).json({ message: "Invalid token", error: error.message });
    }

    // Attempt to delete the wishlist item
    let deleteWishlistItem = await wishList.deleteOne({ _id: req.params.id, username });
    await deleteWishlistItem.save()
  
    return res.status(200).json({ message: "Wishlist item deleted successfully" });

  } catch (error) {
    return res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

module.exports = ProductRouter;
