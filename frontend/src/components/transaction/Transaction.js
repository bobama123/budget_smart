import React from "react";

const Transaction = ({ transaction, onDelete }) => {

  return (
    <div className="transaction">
      <p>Amount: {transaction.amount}</p>
      <p>Date: {transaction.date}</p>
      <p>Category: {transaction.category}</p>
      <p>Description: {transaction.description}</p>
      <button onClick={() => onDelete(transaction._id)}>Delete</button> {/* Ensure _id is passed */}
    </div>
  );
};

export default Transaction;
