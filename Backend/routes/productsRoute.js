const express = require("express");
const Product = require("../model/Product");
const ProductRouter = express.Router()

ProductRouter.get("/",(req,res)=>{
const products = Product.find()
res.send(products)
})

ProductRouter.post("/addProduct",async(req,res)=>{
    try {
        const product =await new Product({
        name:req.name,
        description:req.description,
        price:req.price,
        category:req.category,
        brand:req.brand,
        size:req.size,
        color:req.color,
        discount:req.discount,
        stock:req.stock,
        images:req.images,
        rating:req.rating,
        reviews:req.reviews
    })
   await product.save() 
   res.send("add successfully",product)
    } catch (error) {
        res.send(error)
    }
   
   
})

module.exports=ProductRouter