const mongoose=require("mongoose");

const accountSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either active ,frozen or closed"
        },
        default:"ACTIVE"
     },
     currency:{
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"INR"
     }

}
,
{
   timestamps: true,
})


//for querying the account model based on user and status,
//we can create a compound index on the user and status fields. 
//This will allow us to efficiently query for accounts that belong to a specific user and 
//have a specific status.
accountSchema.index({user:1},{status:1})


const accountModel=mongoose.model("account",accountSchema)
module.exports=accountModel;