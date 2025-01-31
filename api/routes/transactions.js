const express = require("express");
const router = express.Router();

const TransactionsController = require("../controllers/transactions");

router.get("/", TransactionsController.getUserTransactions);
router.post("/", TransactionsController.createTransaction);
router.delete("/:id", TransactionsController.deleteTransaction);

module.exports = router;
