const Transaction = require("../models/transaction");
const TokenGenerator = require("../lib/token_generator");

const TransactionsController = {
  Index: (req, res) => {
    Transaction.find((err, transactions) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(200).json({ transactions: transactions, token: token });
    });
  },
  Create: (req, res) => {
    const transaction = new Transaction(req.body);
    transaction.save((err) => {
      if (err) {
        throw err;
      }

      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(201).json({ message: 'OK', token: token });
    });
  },
};

module.exports = TransactionsController;