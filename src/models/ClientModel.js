import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        number: { type: String, required: true, trim: true },
        identification: { type: String, required: true, trim: true },
        accountUniqueId: { type: String, required: true, trim: true },
        loanAmount: {
            type: Number,
            required: true,
        },
        remainingBalance: {
            type: Number,
            required: true,
        },
        interestRate: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentIntervalDays: {
            type: Number,
            required: true,
            default: 30,  // Default to monthly payments
        },
        nextPaymentDate: {
            type: Date,
            required: true,
        },
        paymentHistory: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
                interest: {
                    type: Number,
                    required: true,
                },
                principal: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);


const Client = mongoose.model("Client", ClientSchema);

export default Client;
