const express = require("express");
const Product = require("../model/Product");
const mongoose = require("mongoose"); 
const authMiddleware = require("../middleware/authMiddleware");
const ProductRouter = express.Router();
const jwt = require("jsonwebtoken");
const wishList = require("../model/Wishlist");
const cart = require("../model/Cart")
const Order = require("../model/Order")
const User = require("../model/User")
require("dotenv").config()

ProductRouter.get("/", async (req, res) => {
  try {
    let { search, category, brand, minPrice, maxPrice, size, sort, order, page = 1, limit  } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    let filter = {};

    // 🔹 SEARCH functionality (search by name, brand, category)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    // 🔹 FILTER functionality
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (size) filter.size = size;

    // 🔹 SORTING functionality (default: newest products first)
    let sortOptions = { createdAt: -1 };
    if (sort) {
      const orderValue = order === "asc" ? 1 : -1;
      if (["price", "rating", "createdAt"].includes(sort)) {
        sortOptions = { [sort]: orderValue };
      }
    }

    // Fetching products with applied filters & sorting
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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


// DISPLAY WISHLIST PRODUCTS

ProductRouter.get("/wishlist",authMiddleware,async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect(`https://nord-storm.onrender.com/auth/google`);
    }

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.redirect(`https://nord-storm.onrender.com/auth/google`);
        }
      return res.status(400).json({ message: "Invalid token", error });
    }

const displayWishListItems = await wishList.find({username:username});
if(displayWishListItems.length==0){
 return res.status(200).json({message:"No product found"})
}
res.status(200).json({displayWishListItems})

  } catch (error) {
   return res.status(500).json({error:"An error occurred",details:error.message})
  }
  
})

// ADD PRODUCTS TO WISHLIST AND UPDATE 


ProductRouter.patch("/wishlistUpdate/:id", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect(`https://nord-storm.onrender.com/auth/google`);
    }

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.redirect(`https://nord-storm.onrender.com/auth/google`);
        }
      return res.status(400).json({ message: "Invalid token", error });
    }

    let product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const checkInWishlist = await wishList.findOne({ product_id: req.params.id });

    if (checkInWishlist) {
      return res.status(400).json({ message: "Already exist" }); // Ensure early return
    }

    let productAddToWishlist = new wishList({
      product_id: product._id,
      username: username,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      size: req.body.size,
      color: product.color,
      discount: product.discount,
      stock: req.body.stock || 1,
      images: product.images,
      rating: product.rating,
      reviews: product.reviews,
    });

    await productAddToWishlist.save();

    return res.status(200).json({ message: "Wishlist item successfully updated", productAddToWishlist });
    
  } catch (error) {
    if (!res.headersSent) {  // Prevent multiple responses
      return res.status(500).json({ error: "An error occurred", details: error.message });
    }
  }
});


// DELETE FROM WISHLIST 

ProductRouter.delete("/wishlistDelete/:id",authMiddleware, async (req, res) => {
  try {
    let deleteIdInWishlist = await wishList.findOne({_id:req.params.id});
    if(!deleteIdInWishlist){
    return res.status(404).json({message:"Item already deleted or may not be present in wishlist"})
    }
    else{
       let deleteWishlistItem = await wishList.deleteOne({ _id: req.params.id});
       res.status(200).json({ message: "Wishlist item deleted successfully" });
    }
   

  } catch (error) {
    return res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

// DISPLAY CART ITEMS

ProductRouter.get("/cart", authMiddleware, async (req, res) => {  
  try {
      let token = req.headers.authorization?.split(" ")[1];
      if (!token) {
          return res.redirect(`https://nord-storm.onrender.com/auth/google`);
      }

      let username;
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          username = decoded.email;
      } catch (error) {
          if (error.name === "TokenExpiredError") {
              return res.redirect(`https://nord-storm.onrender.com/auth/google`);
          }
          return res.status(400).json({ message: "Invalid token", error });
      }

      const displayCartItems = await cart.find({ username: username });
      if (displayCartItems.length === 0) {
          return res.status(200).json({ message: "No Product found" });
      }
      res.status(200).json({ displayCartItems });

  } catch (error) {
      return res.status(500).json({ error: "An error occurred", details: error.message });
  }
});



//  ADD BACK CART ITEM TO WISHLIST

ProductRouter.post("/addbackToWishlist/:id",authMiddleware,async(req,res)=>{
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
  return res.redirect(`https://nord-storm.onrender.com/auth/google`);
}

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.redirect(`https://nord-storm.onrender.com/auth/google`);
        }
      return res.status(400).json({ message: "Invalid token", error });
    }
    const cartItem = await cart.findOne({_id:req.params.id,username})
    const addToWishList = new wishList({
    product_id:cartItem.product_id,
    username:cartItem.username,
    name:cartItem.name,
    description:cartItem.description,
    price:cartItem.price,
    category:cartItem.category,
    brand:cartItem.brand,
    size:cartItem.size,
    color:cartItem.color,
    discount:cartItem.discount,
    stock:cartItem.stock,
    images:cartItem.images,
    rating:cartItem.rating,
    reviews:cartItem.reviews
    })
     await addToWishList.save();
    const cartItemDelete = await cart.deleteOne({_id:req.params.id,username})
   
    res.status(200).json({message:"Successfully addback to wishlist"})

  } catch (error) {
    
  }
})


//  ADD TO CART FUNCTIONALITY


ProductRouter.patch("/cartUpdate/:id", authMiddleware, async (req, res) => {
    try {
        console.log("Received request to add product to cart:", req.params.id);

        let token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            console.log("No token provided. Redirecting...");
            return res.redirect(`https://nord-storm.onrender.com/auth/google`);
        }

        let username;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            username = decoded.email;
        } catch (error) {
            console.error("Token verification failed:", error);
            if (error.name === "TokenExpiredError") {
                return res.redirect(`https://nord-storm.onrender.com/auth/google`);
            }
            return res.status(400).json({ message: "Invalid token", error });
        }

        const productId = req.params.id;

        // Validate productId format before using it
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error("Invalid Product ID format:", productId);
            return res.status(400).json({ message: "Invalid Product ID format" });
        }

        const id = new mongoose.Types.ObjectId(productId);

        // Check if product is in wishlist
        const checkInWishlist = await wishList.findOne({ _id: id });

        if (!checkInWishlist) {
            // If not in wishlist, check in the product collection
            const checkProductInProdPage = await Product.findOne({ _id: id });

            if (!checkProductInProdPage) {
                console.error("Product not found in Product collection:", id);
                return res.status(400).json({ message: "Product not found" });
            } else {
                const checkIfProductInCart = await cart.findOne({ product_id: id });

                if (checkIfProductInCart) {
                    return res.status(409).json({ message: "Product already in cart" });
                }

                const AddToCart = new cart({
                    product_id: checkProductInProdPage._id,
                    wishlist_id: null,
                    username: username,
                    name: checkProductInProdPage.name,
                    description: checkProductInProdPage.description,
                    price: checkProductInProdPage.price,
                    category: checkProductInProdPage.category,
                    brand: checkProductInProdPage.brand,
                    size: req.body.size || checkProductInProdPage.size,
                    color: checkProductInProdPage.color,
                    discount: checkProductInProdPage.discount,
                    stock: req.body.stock || 1,
                    images: checkProductInProdPage.images,
                    rating: checkProductInProdPage.rating,
                    reviews: checkProductInProdPage.reviews,
                });

                await AddToCart.save();
                return res.status(200).json({ message: "Product successfully added to cart" });
            }
        } else {
            const checkIfProductInCart = await cart.findOne({ wishlist_id: id });

            if (checkIfProductInCart) {
                return res.status(409).json({ message: "Product already in cart" });
            }

            const AddToCart = new cart({
                product_id: checkInWishlist.product_id,
                wishlist_id: checkInWishlist._id,
                username: username,
                name: checkInWishlist.name,
                description: checkInWishlist.description,
                price: checkInWishlist.price,
                category: checkInWishlist.category,
                brand: checkInWishlist.brand,
                size: req.body.size || checkInWishlist.size,
                color: checkInWishlist.color,
                discount: checkInWishlist.discount,
                stock: req.body.stock || 1,
                images: checkInWishlist.images,
                rating: checkInWishlist.rating,
                reviews: checkInWishlist.reviews,
            });

            await wishList.deleteOne({ _id: id });
            await AddToCart.save();
            return res.status(200).json({ message: "Product successfully added to cart" });
        }
    } catch (error) {
        console.error("Error in cart update:", error);
        return res.status(500).json({ error: "An error occurred", details: error.message });
    }
});




// DELETE ITEMS FROM CART FUNCTIONALITY

ProductRouter.delete("/cartDelete/:id",authMiddleware,async(req,res)=>{
  try {
    let deleteIdInCart = await cart.findOne({_id:req.params.id});
    if(!deleteIdInCart){
    return res.status(404).json({message:"Item already deleted or may not be present in Cart"})
    }
    else{
       let deleteWishlistItem = await cart.deleteOne({ _id: req.params.id});
       res.status(200).json({ message: "Cart item deleted successfully" });
    }
   

  } catch (error) {
    return res.status(500).json({ error: "An error occurred", details: error.message });
  }
})

// ORDER HISTORY FUNCTIONALITY


ProductRouter.post("/order", authMiddleware, async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please login again" });
    }

    let user;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findOne({ email: decoded.email }).select("_id email");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired, please login again" });
      }
      return res.status(400).json({ message: "Invalid token", error: error.message });
    }

    const { items, totalAmount, paymentMethod, address } = req.body;

    if (!items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Incomplete order details" });
    }

    // Create new order with correct user reference
    const newOrder = new Order({
      user: user._id, // Store ObjectId
      username: user.email, // Store email separately
      items,
      totalAmount,
      paymentMethod,
      address,
      orderStatus: "Processing",
      paymentStatus: "Pending",
    });

    const savedOrder = await newOrder.save();
await cart.deleteMany({username:user.email}) 


    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// ✅ 2. Get All Orders for Logged-in User

ProductRouter.get("/allOrders",authMiddleware,async(req,res)=>{
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.redirect(`https://nord-storm.onrender.com/auth/google`);
    }

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.redirect(`https://nord-storm.onrender.com/auth/google`);
      }
      return res.status(400).json({ message: "Invalid token", error: error.message });
    }

    const orders = await Order.find({username:username}).sort({createdAt:-1});
    res.status(200).json(orders);
  } catch (error) {
    console.error("Order placement error:", error); // Debugging
    res.status(500).json({ message: "Server error", error: error.message });
 }
 
})

// ✅ 3. Get a Single Order by ID (User's Own Order)

ProductRouter.get("/order/:id",authMiddleware,async(req,res)=>{
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.redirect(`https://nord-storm.onrender.com/auth/google`);
    }

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.redirect(`https://nord-storm.onrender.com/auth/google`);
      }
      return res.status(400).json({ message: "Invalid token", error: error.message });
    }

   const order = await Order.findOne({_id:req.params.id,username})
  if(!order){
    return res.status(404).json({message:"Order not found"});
  }
  
  res.status(200).json(order);
  } catch (error) {
    res.status(500).json({message:"Server error",error:error.message})
  }
})


// ✅ 4. Cancel an Order (Only if it's Processing)

ProductRouter.delete("/orderDelete/:id",authMiddleware,async(req,res)=>{
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.redirect(`https://nord-storm.onrender.com/auth/google`);
    }

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.redirect(`https://nord-storm.onrender.com/auth/google`);
      }
      return res.status(400).json({ message: "Invalid token", error: error.message });
    }
    
    const order = await Order.findOne({_id:req.params.id,username});

    if(!order){
      return res.status(404).json({message:"Order not found"});
    }

    if(order.orderStatus!=="Processing"){
      return res.status(400).json({message:"You can only cancel orders that are still processing"})
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Order cancelled successfully"})
  } catch (error) {
    res.status(500).json({message:"Server error",error:error.message})
  }
})

// 🔹 POST a review for a product (Requires authentication)
ProductRouter.post("/review/:id", authMiddleware, async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.redirect(`https://nord-storm.onrender.com/auth/google`);
    }

    let username;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.email;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.redirect(`https://nord-storm.onrender.com/auth/google`);
      }
      return res.status(400).json({ message: "Invalid token", error: error.message });
    }
    const { comment, rating } = req.body;
    

    if (!comment || rating === undefined) {
      return res.status(400).json({ message: "Comment and rating are required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = { username, comment, rating, createdAt: new Date() };
    product.reviews.push(review);

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.status(200).json({ message: "Review added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = ProductRouter;

