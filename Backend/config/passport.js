const passport = require("passport");
const Google_Strategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");

passport.use(
    new Google_Strategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:"http://localhost:3000/auth/google/callback"
    },
    async(accessToken,refreshToken,profile,done)=>{
        try {
            console.log("Google Profile:", profile);
            let user = await User.findOne({googleId:profile.id})
            if(!user){
                user= new User({
                    googleId:profile.id,
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    picture:profile._json.picture
                })
                await user.save()
            }
            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
);

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
    const user = await User.findById(id);
    done(null,user)
})