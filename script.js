const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// const dummyTransactions = [
//   { id: 1, text: "Flowers", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

//Store transactions and convert strings into JSONs:
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

//Look for LS items and add in, or initialise an empty array:
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//Add transaction functionality:
function addTransaction(e) {
  //prevent the actual submit (and refresh!):
  e.preventDefault();
  //Checks for entry in boxes, generates ID, stores text and amount text:
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      //+amount.value to change from string to number
    };

    //Push transaction values into transactions array:
    transactions.push(transaction);

    //Add transactions to the DOM list:
    addTransactionDOM(transaction);

    //Update the balance totals:
    updateValues();

    //Update the LS:
    updateLocalStorage();

    //Reset box values:
    text.value = "";
    amount.value = "";
  }
}

//Generate random ID:
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//Add transactions to the DOM list:
function addTransactionDOM(transaction) {
  //Get sign:
  const sign = transaction.amount < 0 ? "-" : "+";

  //Create element:
  const item = document.createElement("li");

  //Add the class based on value:
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  //Construct transaction amount element:
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  //Add the new element to the classList:
  list.appendChild(item);
}

//Update the balance, income and expense totals:
function updateValues() {
  //amounts: individual transactions into an array:
  const amounts = transactions.map((transaction) => transaction.amount);

  //total: sum of all positive and negative amounts:
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  //income: sums all income and expenditure to give a total income:
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  //expense: sums all the expense items together(gives a +ve number, not -ve):
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  //Push the new values into the DOM:
  balance.innerText = `£${total}`;
  money_plus.innerText = `£${income}`;
  money_minus.innerText = `£${expense}`;
}

//Remove a transaction (by ID) function:
function removeTransaction(id) {
  //filter out a transaction by it's id:
  transactions = transactions.filter((transaction) => transaction.id !== id);

  //Update LS on removing a transaction:
  updateLocalStorage();

  //Reinitialise the app:
  init();
}

//Update and add to LS:
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//Initialise the app immediately!
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

//Event listeners:
form.addEventListener("submit", addTransaction);
