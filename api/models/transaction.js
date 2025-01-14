const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, default: Date.now, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links transaction to the user
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
