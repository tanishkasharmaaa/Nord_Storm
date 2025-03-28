const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Google Authentication Callback
router.get("/google",
passport.authenticate("google",{scope:["profile","email"]})
)

// Goggle Authentication callback
router.get("/google/callback",
passport.authenticate("google",{failureRedirect:"/"}),
(req,res)=>{
    const token = jwt.sign({id:req.user._id,email:req.user.email},process.env.JWT_SECRET,{
        expiresIn:"2d", 
    })
    res.redirect(`https://nord-storm.onrender.com/dashboard?token=${token}`);
}
);

router.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.session.destroy(()=>{
        res.send("Logged out successfully")    
        })
    });
    
})
module.exports= router