const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK, // Ensure this matches Google Console
      passReqToCallback: false,  // ❌ No need to pass request, correct order
      scope: ["profile", "email"], // ✅ Ensure profile & email are requested
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile) {
          throw new Error("Google profile not found");
        }

        console.log("Google Profile:", profile); // 🔹 Debugging log
        console.log("Callback URL:", process.env.CALLBACK); // 🔹 Debugging log

        // Ensure profile.id exists before querying the database
        const googleId = profile.id;
        if (!googleId) {
          throw new Error("Google ID is undefined");
        }

        let user = await User.findOne({ googleId });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName || "Unknown User",
            email: profile.emails?.[0]?.value || "No Email",
            picture: profile.photos?.[0]?.value || "",
          });

          await user.save();
          console.log("✅ New user created:", user);
        } else {
          console.log("✅ User already exists:", user);
        }

        return done(null, user);
      } catch (error) {
        console.error("❌ Google Auth Error:", error);
        return done(error, null);
      }
    }
  )
);

// ✅ Proper serialization & deserialization
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user._id); // Use `_id` from MongoDB
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user with ID:", id);
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (error) {
    console.error("❌ Deserialization error:", error);
    done(error, null);
  }
});

module.exports = passport;
