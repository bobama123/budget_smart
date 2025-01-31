import React, { useEffect, useState } from 'react';
import TransactionForm from '../transaction/TransactionForm';
import Transaction from '../transaction/Transaction';

const Feed = ({ navigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    if(token) {
      fetch("/transactions", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(async data => {
          window.localStorage.setItem("token", data.token)
          setToken(window.localStorage.getItem("token"))
          console.log("Fetched transactions:", data.transactions);
          setTransactions(data.transactions);
        })
        console.log("Transactions in state:", transactions);

    }
  }, [token])
    

  const logout = () => {
    window.localStorage.removeItem("token")
    navigate('/login')
  }

  const handleNewTransaction = (newTransaction) => {
    // Update transactions list when a new transaction is added
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(`/transactions/${transactionId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTransactions(prevTransactions => prevTransactions.filter(t => t._id !== transactionId));
        console.log("Deleted transaction:", transactionId);
      } else {
        console.error("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };
  
    if(token) {
      return(
        <>
          <h2>Transactions</h2>
            <button onClick={logout}>
              Logout
            </button>
            <TransactionForm navigate={navigate} onNewTransaction={handleNewTransaction} />
          <div id='feed' role="feed">
              {transactions.map(
                (transaction) => ( <Transaction transaction={ transaction } key={ transaction._id } onDelete={handleDeleteTransaction} /> )
              )}
          </div>
        </>
      )
    } else {
      navigate('/login')
    }
}

export default Feed;