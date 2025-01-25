import React from 'react';

const Transaction = ({ transaction }) => {
  return (
    <div className="transaction">
      <p>Amount: {transaction.amount}</p>
      <p>Date: {transaction.date}</p>
      <p>Category: {transaction.category}</p>
      <p>Description: {transaction.description}</p>
    </div>
  );
};

export default Transaction;
