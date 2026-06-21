const accountModel=require("../models/account.model");


async function createAccount (req,res){
    try{
       const user=req.user;

       const account=await accountModel.create({
        user:user._id,
        
    });

    return res.status(201).json({message:"Account created successfully",data:account})

    }
    catch(err){
      return  res.status(500).json({message:"Internal server error",error:err.message})
    }
}


module.exports={
    createAccount
}
