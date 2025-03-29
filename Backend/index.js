const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const connection = require("./config/db"); // Ensure this is a function
const authRoutes = require("./routes/authRoutes");
const ProductRouter = require("./routes/productsRoute");
require("./config/passport");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Fix: Bind to 0.0.0.0 (Render requirement)
app.listen(port, "0.0.0.0", async () => {
  try {
    await connection(); // Ensure database connection works
    console.log(`✅ Server is running on http://0.0.0.0:${port}`);
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1); // Stop app if DB connection fails
  }
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/auth", authRoutes);
app.use("/products", ProductRouter);
