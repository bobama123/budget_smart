import React, { useState } from 'react';

const TransactionForm = ({ navigate, onNewTransaction }) => {

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = window.localStorage.getItem("token");

    fetch('/transactions', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token in Authorization header
      },
      body: JSON.stringify({ amount: amount, date: date, category: category, description: description })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Transaction created successfully") {
          // Call onNewTransaction with the new transaction data
          const newTransaction = {
            amount,
            date,
            category,
            description,
            _id: data.transactionId, // Assuming the backend sends the new transaction ID
          };
          onNewTransaction(newTransaction);
          navigate('/posts'); // Redirect to feedpage upon success
        } else {
          navigate('/transaction'); // Redirect back to form upon failure
        }
      })
      .catch(error => {
        console.error("Error during transaction creation:", error);
      });
    // .then(response => {
    //   if(response.status === 201) {
    //     navigate('/feedpage')   // redirect to feedpage upon success
    //   } else {
    //     navigate('/transaction')  // redirect back to form upon failure
    //   }
    // })
    // .catch(error => {
    //   console.error("Error during transaction creation:", error);
    // });
  }
  const handleAmountChange = (event) => {
    setAmount(event.target.value)
  }

  const handleDateChange = (event) => {
    setDate(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }


  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Amount" id="amount" type='number' value={amount} onChange={handleAmountChange} />
      <input placeholder="Date" id="date" type='date' value={date} onChange={handleDateChange} />
      <input placeholder="Category" id="category" type='text' value={category} onChange={handleCategoryChange} />
      <input placeholder="Description" id="description" type='text' value={description} onChange={handleDescriptionChange} />
      <input id='submit' type="submit" value="Submit" />
    </form>
  );
}

export default TransactionForm;


