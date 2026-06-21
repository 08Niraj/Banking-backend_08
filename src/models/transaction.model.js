const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema({
  fromAccount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"account",
    required:[true,"Transaction must have a source account"],
    index:true
  },
   toAccount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"account",
    required:[true,"Transaction must have a source account"],
    index:true
  },
  status:{
    type:String,
    enum:{
        values:["PENDING","COMPLETED","FAILED","REVERSED"],
        message:"Status can be either pending,completed or failed"
    }
  },
  amount:{
    type:Number,
    required:[true,"Transaction amount is required"],
    min:[0,"Transaction amount must be greater than zero"]
   },
   idempotencyKey:{
    type:String,
    required:[true,"Idempotency key is required for transaction"],
    unique:true
   }

  },
{
    timestamps: true,
})

const transactionModel=mongoose.model("transaction",transactionSchema);
module.exports=transactionModel;