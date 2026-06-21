const mongoose=require("mongoose");

const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger entry must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for ledger entry"],
        immutable:true,
     },
     transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger entry must be associated with a transaction"],
        index:true,
        immutable:true

     },
     type:{
        type:String,
        enum:{
            values:["DEBIT","CREDIT"],
            message:"Ledger entry type can be either debit or credit"
        },
        required:[true,"Ledger entry type is required"],
        immutable:true
        }
     
    },
{
    timestamps: true,
})



//preventions that ledger should not be modified 

function preventLedgerModification(){
    throw new Error("Ledger entries cannot be modified or deleted");
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndRemove",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);


const ledgerModel=mongoose.model("ledger",ledgerSchema);
module.exports=ledgerModel;