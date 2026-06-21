const express=require("express");
const router=express.Router();
const authMiddleware=require("../middlewares/auth.middleware");
const transactionController=require("../controllers/transaction.controller");


router.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);

router.post("/system/initial-fund",authMiddleware.authSystemMiddleware,transactionController.createInitialFundsTransaction);


module.exports=router;
