const Transaction = require("../models/transaction");
const TokenGenerator = require("../lib/token_generator");
const mongoose = require('mongoose');

const getUserTransactions = async (req, res) => {
  try {
    console.log("User ID in controller:", req.user_id); 
    // Find transactions where the user ID matches the logged-in user's ID
    const transactions = await Transaction.find({ user: req.user_id }).sort({ createdAt: -1 });

    console.log("Fetched transactions:", transactions); // Log the fetched transactions
    
    // Generate a new token for the user
    const token = TokenGenerator.jsonwebtoken(req.user_id);
    
    // Respond with the user's transactions and the new token
    res.status(200).json({ transactions: transactions, token: token });
  } catch (err) {
    // Handle errors, such as database issues
    res.status(500).json({ error: "Failed to retrieve transactions", details: err.message });
  }
};



const createTransaction = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user_id);
    console.log("User ID in createTransaction:", userId); // Log user ID from the request body
    // Create a new Transaction object with the data from the request body
    const transaction = new Transaction({
      ...req.body, // Spread the data from the request body
      user: userId, // Associate the transaction with the logged-in user
    });

    // Save the transaction to the database
    await transaction.save();


    // Respond with a success message and the new token
    res.status(201).json({ message: "Transaction created successfully"});
  } catch (err) {
    // Handle errors, such as validation or database issues
    res.status(500).json({ error: "Failed to create transaction", details: err.message });
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete transaction with ID:", id);

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully", deletedTransaction: transaction });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction", details: err.message });
  }
};



const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user_id; // Ensure only the owner can edit
    const updateData = req.body;

    console.log("Attempting to update transaction with ID:", id);

    // Find the transaction & ensure it belongs to the logged-in user
    const transaction = await Transaction.findOne({ _id: id, user: userId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }

    // Update the transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return updated transaction and validate fields
    );

    res.status(200).json({ message: "Transaction updated successfully", updatedTransaction });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ error: "Failed to update transaction", details: err.message });
  }
};

const TransactionsController = {
  getUserTransactions: getUserTransactions,
  createTransaction: createTransaction,
  deleteTransaction: deleteTransaction,
  updateTransaction: updateTransaction
}

module.exports = TransactionsController;


