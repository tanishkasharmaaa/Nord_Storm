let jwt = require("jsonwebtoken");
let dotenv = require("dotenv")
dotenv.config();

let authMiddleware=(req,res,next)=>{
let token = req.headers.authorization.split(" ")[1];
jwt.verify(token,process.env.JWT_SECRET,function(err,decode){
    if(err){
        res.status(400).json({err})
    }
    if(decode){
        next()
    }
    else{
        res.redirect(`https://nord-storm.onrender.com/auth/google`)
        res.status(400).json({message:"Please Login/SignUp"})
    }
})
}

module.exports=authMiddleware