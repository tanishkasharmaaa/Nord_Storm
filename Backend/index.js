const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const ProductRouter = require("./routes/productsRoute");
const connection = require("./config/db"); // ✅ Ensure correct import
require("./config/passport");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.use("/auth", authRoutes);
app.use("/products", ProductRouter);

// ✅ Correct async DB connection handling
connection
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is running at port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
