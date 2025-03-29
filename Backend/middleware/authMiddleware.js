let jwt = require("jsonwebtoken");
let dotenv = require("dotenv");
dotenv.config();

let authMiddleware = (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];  // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        jwt.verify(token, process.env.JWT_SECRET, function (err, decode) {
            if (err) {
                return res.status(400).json({ message: "Invalid token", error: err });
            }

            if (decode) {
                req.user = decode;  // Store decoded user data in request
                return next();  // Stop further execution here
            } else {
                return res.redirect("https://nord-storm.onrender.com/auth/google");
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = authMiddleware;
