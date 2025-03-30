const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 Google Authentication (Initial Request)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 🔹 Google Authentication Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("https://nord-storm.vercel.app/login?error=Unauthorized");
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Redirect to frontend with token
    res.redirect(
      `https://nord-storm.vercel.app/?token=${token}&name=${encodeURIComponent(req.user.name)}`
    );
  }
);

// 🔹 Logout Route (Express 5 Fix)
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }
      res.redirect("https://nord-storm.vercel.app");
    });
  });
});

module.exports = router;
