const Transaction = require("../models/transaction");
const TokenGenerator = require("../lib/token_generator");
const mongoose = require('mongoose');

const getUserTransactions = async (req, res) => {
  try {
    console.log("User ID in controller:", req.user_id); 
    console.log('User ID:', req.user_id);
    // Find transactions where the user ID matches the logged-in user's ID
    const transactions = await Transaction.find({ user: req.user_id }).sort({ createdAt: -1 });
    
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
    const userId = mongoose.Types.ObjectId(req.body.user);
    // Create a new Transaction object with the data from the request body
    const transaction = new Transaction({
      ...req.body, // Spread the data from the request body
      user: userId, // Associate the transaction with the logged-in user
    });

    // Save the transaction to the database
    await transaction.save();

    // Generate a new token for the user
    // const token = TokenGenerator.jsonwebtoken(req.user_id);

    // Respond with a success message and the new token
    res.status(201).json({ message: "Transaction created successfully"});
  } catch (err) {
    // Handle errors, such as validation or database issues
    res.status(500).json({ error: "Failed to create transaction", details: err.message });
  }
};



const TransactionsController = {
  getUserTransactions: getUserTransactions,
  createTransaction: createTransaction
}

module.exports = TransactionsController;


