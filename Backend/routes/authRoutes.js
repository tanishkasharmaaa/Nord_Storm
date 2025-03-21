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
    const token = jwt.sign({id:req.user._id},process.env.JWT_SECRET,{
        expiresIn:"1hr", 
    })
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
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