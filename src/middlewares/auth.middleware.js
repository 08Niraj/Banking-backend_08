const userModel=require("../models/user.model");

const jwt=require("jsonwebtoken");



async function authMiddleware(req,res,next){
    const token=req.cookies.token ||req.headers.authorization.split(" ")[1];

    if(!token) {
        return res.status(401).json({message:"Unauthorized: No token provided"});
    }

    try{
      const decoded=jwt.verify(token,process.env.JWT);
      const user=await userModel.findById(decoded.userId);

      if(!user){
        return res.status(401).json({message:"Unauthorized: User not found"});
      }

      req.user=user;

      return next();

    }catch(err)
    {
       return res.status(401).json({message:"Unauthorized: Invalid token"});
    }

}

async function authSystemMiddleware(req,res,next){
    const token=req.cookies.token ||req.headers.authorization.split(" ")[1];

    if(!token) {
        return res.status(401).json({message:"Unauthorized: No token provided"});
    }

    try{
      const decoded=jwt.verify(token,process.env.JWT);
      const user=await userModel.findById(decoded.userId).select("+systemUser");



      if(!user.systemUser){
        return res.status(403).json({message:"Unauthorized: User not found not system user",});
      }

      req.user=user;

      return next();

    }catch(err)
    {
       return res.status(401).json({message:"Unauthorized: Invalid token"});
    }

}

module.exports={
    authMiddleware,
    authSystemMiddleware
}