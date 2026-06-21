const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/email.service");




async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isExists = await userModel.findOne({ email });

    if (isExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    

    //sending welcome email to user after registration
    await sendEmail({
     name: user.name,
    email: user.email
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
      token,
    });


  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function userLoginController(req,res){
  try{
  const {email,password}=req.body;

  if(!email ||!password){
    return res.status(400).json({
      message:"All fields are required",
    })
  }

  const user=await userModel.findOne({email}).select("+password");

  if(!user){
    return res.status(401).json({message:"email and password are invalid"})

  }

  const isValidPassword=await user.comparePassword(password);

  if(!isValidPassword)
  {
    return res.status(401).json({message:"email and password are invalid"})

  }
   const token = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });

}
catch(err){
  console.error("Login Error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}

}
module.exports = {
  userRegisterController,
  userLoginController
};
