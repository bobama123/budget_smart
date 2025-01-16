const express = require("express");
const router = express.Router();

const TransactionsController = require("../controllers/transactions");

router.get("/", TransactionsController.getUserTransactions);
router.post("/", TransactionsController.createTransaction);

module.exports = router;
