const mongoose = require("mongoose");

const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");

async function createTransaction(req, res) {
    // Implement user-to-user transfers here
}

async function createInitialFundsTransaction(req, res) {
    const session = await mongoose.startSession();

    try {
        const { toAccount, amount, idempotencyKey } = req.body;

        if (!toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        // Idempotency check
        const existingTransaction = await transactionModel.findOne({
            idempotencyKey,
        });

        if (existingTransaction) {
            return res.status(409).json({
                message: "Transaction already processed",
                transaction: existingTransaction,
            });
        }

        // Receiver account
        const receiverAccount = await accountModel.findById(toAccount);

        if (!receiverAccount) {
            return res.status(404).json({
                message: "Destination account not found",
            });
        }

        // System User
        const systemUser = await userModel
            .findOne({ systemUser: true })
            .select("+systemUser");

        if (!systemUser) {
            return res.status(404).json({
                message: "System user not found",
            });
        }

        // System Account
        const systemAccount = await accountModel.findOne({
            user: systemUser._id,
        });

        if (!systemAccount) {
            return res.status(404).json({
                message: "System account not found",
            });
        }

        await session.startTransaction();

        // Create Transaction
        const transaction = await transactionModel.create(
            [
                {
                    fromAccount: systemAccount._id,
                    toAccount: receiverAccount._id,
                    amount,
                    idempotencyKey,
                    status: "PENDING",
                },
            ],
            { session }
        );

        const transactionDoc = transaction[0];

        // Debit System Account
        await ledgerModel.create(
            [
                {
                    account: systemAccount._id,
                    amount,
                    transaction: transactionDoc._id,
                    type: "DEBIT",
                },
            ],
            { session }
        );

        // Credit User Account
        await ledgerModel.create(
            [
                {
                    account: receiverAccount._id,
                    amount,
                    transaction: transactionDoc._id,
                    type: "CREDIT",
                },
            ],
            { session }
        );

        // Mark Complete
        transactionDoc.status = "COMPLETED";
        await transactionDoc.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            message: "Initial funds transferred successfully",
            transaction: transactionDoc,
        });
    } catch (error) {
        await session.abortTransaction();

        console.error(error);

        return res.status(500).json({
            message: "Transaction failed",
            error: error.message,
        });
    } finally {
        session.endSession();
    }
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction,
};