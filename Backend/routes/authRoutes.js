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
      return res.redirect("http://localhost:5173/login?error=Unauthorized");
    }

    // Generate JWT Token (Include user ID, email, and name)
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Redirect to frontend with token and encoded name
    res.redirect(
      `http://localhost:5173/?token=${token}&name=${encodeURIComponent(req.user.name)}`
    );
  }
);

// 🔹 Logout Route (Properly destroys session)
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect("http://localhost:5173");
    });
  });
});

module.exports = router;
