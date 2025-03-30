const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const ProductRouter = require("./routes/productsRoute");
const connection = require("./config/db");
require("./config/passport");

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
    "https://nord-storm.vercel.app",
    "https://another-allowed-site.com",
    "https://nord-storm.onrender.com",
    "http://localhost:5173",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log(`Blocked CORS request from: ${origin}`);
                callback(null, false);
            }
        },
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: process.env.JWT_SECRET || "fallback_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "Lax",
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.use("/auth", authRoutes);
app.use("/products", ProductRouter);

// Handle 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Connect to Database
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
