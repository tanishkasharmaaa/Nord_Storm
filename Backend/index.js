const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const port = process.env.PORT
const session = require("express-session")
const connection = require("./config/db")
const passport = require("passport");
const authRoutes=require("./routes/authRoutes");
const ProductRouter = require("./routes/productsRoute");
require("./config/passport")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret:process.env.JWT_SECRET,
        resave:false,
        saveUninitialized:false
    })
)

app.use(passport.initialize());
app.use(passport.session())

app.get("/",(req,res)=>{
    res.send("Server is running...")
})

app.use("/auth",authRoutes)
app.use("/products",ProductRouter)

app.listen(port,async()=>{
    try {
        await connection
        console.log(`Server is running at port ${port}`)
    } catch (error) {
       console.log(error) 
    }
})