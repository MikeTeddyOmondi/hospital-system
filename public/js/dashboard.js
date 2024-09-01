let barChart = null;
let pTag = document.getElementById("error-msg");
let form = document.getElementById("expense-tracker");
const ctx = document.getElementById("expensesBarChart").getContext("2d");

// Event listeners
document
  .getElementById("expense-tracker")
  .addEventListener("submit", addExpense);

async function addExpense(e) {
  e.preventDefault();

  let category = document.getElementById("category-input").value;
  let description = document.getElementById("description-input").value;
  let amount = document.getElementById("amount-input").value;
  let date = document.getElementById("date-input").value;
  let email_id = localStorage.getItem("userEmail");

  // console.log({ category, description, amount, date, email_id });
  let requestBody = { category, description, amount, date, email_id };

  try {
    const response = await fetch("/api/user/expenses/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    console.log({ response });

    if (!response.ok) {
      let responseBody = await response.json();
      pTag.innerHTML = responseBody.message;
      return;
    }
    
    await Promise.all([response.json(), fetchExpenses()]);
    drawBarChart();
    showExpenses();
    form.reset();
  } catch (err) {
    console.log({ err });
    pTag.innerHTML = err.message;
  }
}

const showExpenses = () => {
  const expenseTable = document.getElementById("expense-table");
  let expenses = JSON.parse(localStorage.getItem("expenses")) || []; 
  expenseTable.innerHTML = "";
  for (let i = 0; i < expenses.length; i++) {
    expenseTable.innerHTML += `
      <tr>
        <td>${new Date(expenses[i].date).toLocaleDateString()}</td>
        <td>${expenses[i].category}</td>
        <td>${expenses[i].description}</td>
        <td>$${new Intl.NumberFormat().format(expenses[i].amount)}</td>
        <td><a class="deleteButton" onclick="deleteExpense(${expenses[i].id})">Delete</td>
      </tr>
    `;
  }
};

const deleteExpense = async (id) => {
  try {
    let email = localStorage.getItem("userEmail");
    const response = await fetch(
      `/api/user/expenses/delete/${id}?email=${email}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );
    // console.log({ response });
    if (!response.ok) {
      let responseBody = await response.json();
      pTag.innerHTML = responseBody.message;
      return;
    }
    await fetchExpenses();
    drawBarChart();
    showExpenses();
  } catch (err) {
    console.log({ err });
    pTag.innerHTML = err.message;
  }
};

async function fetchExpenses() {
  try {
    let email = localStorage.getItem("userEmail");
    const response = await fetch(`/api/user/expenses?email=${email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Always include cookies with the request
    });
    const res = await response.json();
    // console.log({ res });
    localStorage.setItem("expenses", JSON.stringify(res.result));
  } catch (err) {
    console.log({ err });
  }
}

function drawBarChart() {
  let expensesData = JSON.parse(localStorage.getItem("expenses"));
  // Group data i.e categories and their reduced amount
  const groupedData = expensesData.reduce((acc, expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  const categories = Object.keys(groupedData);
  const amounts = Object.values(groupedData);

  if (barChart) {
    barChart.destroy(); // Destroy the existing chart
  }

  // Creat new Bar chart
  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Amount spent per category",
          data: amounts,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// IIFE - Immediately Invoked Function Execution
(async () => {
  await fetchExpenses();
  showExpenses();
  drawBarChart();
})();