// let barChart = null;
// let pTag = document.getElementById("error-msg");
// let form = document.getElementById("expense-tracker");
// const ctx = document.getElementById("visitorBarChart").getContext("2d");

// Event listeners
// document
//   .getElementById("expense-tracker")
//   .addEventListener("submit", addExpense);

// async function addExpense(e) {
//   e.preventDefault();

//   let category = document.getElementById("category-input").value;
//   let description = document.getElementById("description-input").value;
//   let amount = document.getElementById("amount-input").value;
//   let date = document.getElementById("date-input").value;
//   let email_id = localStorage.getItem("userEmail");

//   // console.log({ category, description, amount, date, email_id });
//   let requestBody = { category, description, amount, date, email_id };

//   try {
//     const response = await fetch("/api/user/expenses/add", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });
//     console.log({ response });

//     if (!response.ok) {
//       let responseBody = await response.json();
//       pTag.innerHTML = responseBody.message;
//       return;
//     }

//     await Promise.all([response.json(), fetchExpenses()]);
//     drawBarChart();
//     showExpenses();
//     form.reset();
//   } catch (err) {
//     console.log({ err });
//     pTag.innerHTML = err.message;
//   }
// }

// const showExpenses = () => {
//   const expenseTable = document.getElementById("expense-table");
//   let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
//   expenseTable.innerHTML = "";
//   for (let i = 0; i < expenses.length; i++) {
//     expenseTable.innerHTML += `
//       <tr>
//         <td>${new Date(expenses[i].date).toLocaleDateString()}</td>
//         <td>${expenses[i].category}</td>
//         <td>${expenses[i].description}</td>
//         <td>$${new Intl.NumberFormat().format(expenses[i].amount)}</td>
//         <td><a class="deleteButton" onclick="deleteExpense(${expenses[i].id})">Delete</td>
//       </tr>
//     `;
//   }
// };

// const deleteExpense = async (id) => {
//   try {
//     let email = localStorage.getItem("userEmail");
//     const response = await fetch(
//       `/api/user/expenses/delete/${id}?email=${email}`,
//       {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//     // console.log({ response });
//     if (!response.ok) {
//       let responseBody = await response.json();
//       pTag.innerHTML = responseBody.message;
//       return;
//     }
//     await fetchExpenses();
//     drawBarChart();
//     showExpenses();
//   } catch (err) {
//     console.log({ err });
//     pTag.innerHTML = err.message;
//   }
// };

// async function fetchExpenses() {
//   try {
//     let email = localStorage.getItem("userEmail");
//     const response = await fetch(`/api/user/expenses?email=${email}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // Always include cookies with the request
//     });
//     const res = await response.json();
//     // console.log({ res });
//     localStorage.setItem("expenses", JSON.stringify(res.result));
//   } catch (err) {
//     console.log({ err });
//   }
// }

// function drawBarChart() {
//   let expensesData = JSON.parse(localStorage.getItem("expenses"));
//   // Group data i.e categories and their reduced amount
//   const groupedData = expensesData.reduce((acc, expense) => {
//     const category = expense.category;
//     const amount = parseFloat(expense.amount);
//     if (!acc[category]) {
//       acc[category] = 0;
//     }
//     acc[category] += amount;
//     return acc;
//   }, {});

//   const categories = Object.keys(groupedData);
//   const amounts = Object.values(groupedData);

//   if (barChart) {
//     barChart.destroy(); // Destroy the existing chart
//   }

//   // Creat new Bar chart
//   barChart = new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: categories,
//       datasets: [
//         {
//           label: "Amount spent per category",
//           data: amounts,
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// }

// IIFE - Immediately Invoked Function Execution
(async () => {
  // await fetchExpenses();
  // showExpenses();
  // drawBarChart();
})();

// -------------SIDEBAR TOGGLE------------------
let sidebarOpen = false;
let sidebar = document.getElementById("sidebar");

function openSidebar() {
  if(!sidebarOpen) {
    sidebar.classList.add("sidebar-responsive");
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if(sidebarOpen) {
    sidebar.classList.remove("sidebar-responsive");
    sidebarOpen = false;
  }
}


// ---------- CHARTS ----------
// BAR CHART
let barChartOptions = {
  series: [{
    data: [10, 8, 6, 4, 2],
    name: "Patients served",
  }],
  chart: {
    type: "bar",
    background: "transparent",
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: [
    "#2962ff",
    "#d50000",
    "#2e7d32",
    "#ff6d00",
    "#583cb3",
  ],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
      horizontal: false,
      columnWidth: "40%",
    }
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  grid: {
    borderColor: "#55596e",
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  legend: {
    labels: {
      colors: "#f5f7ff",
    },
    show: true,
    position: "top",
  },
  stroke: {
    colors: ["transparent"],
    show: true,
    width: 2
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: "dark",
  },
  xaxis: {
    categories: ["Alice", "Bob", "Charlie", "Dice", "Eustice"],
    title: {
      style: {
        color: "#f5f7ff",
      },
    },
    axisBorder: {
      show: true,
      color: "#55596e",
    },
    axisTicks: {
      show: true,
      color: "#55596e",
    },
    labels: {
      style: {
        colors: "#f5f7ff",
      },
    },
  },
  yaxis: {
    title: {
      text: "Count",
      style: {
        color:  "#f5f7ff",
      },
    },
    axisBorder: {
      color: "#55596e",
      show: true,
    },
    axisTicks: {
      color: "#55596e",
      show: true,
    },
    labels: {
      style: {
        colors: "#f5f7ff",
      },
    },
  }
};

let barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();


// AREA CHART
let areaChartOptions = {
  series: [{
    name: "In patients",
    data: [31, 40, 28, 51, 42, 109, 100],
  }, {
    name: "Out patients",
    data: [11, 32, 45, 32, 34, 52, 41],
  }],
  chart: {
    type: "area",
    background: "transparent",
    height: 350,
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  colors: ["#00ab57", "#d50000"],
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  dataLabels: {
    enabled: false,
  },
  fill: {
    gradient: {
      opacityFrom: 0.4,
      opacityTo: 0.1,
      shadeIntensity: 1,
      stops: [0, 100],
      type: "vertical",
    },
    type: "gradient",
  },
  grid: {
    borderColor: "#55596e",
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  legend: {
    labels: {
      colors: "#f5f7ff",
    },
    show: true,
    position: "top",
  },
  markers: {
    size: 6,
    strokeColors: "#1b2635",
    strokeWidth: 3,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    axisBorder: {
      color: "#55596e",
      show: true,
    },
    axisTicks: {
      color: "#55596e",
      show: true,
    },
    labels: {
      offsetY: 5,
      style: {
        colors: "#f5f7ff",
      },
    },
  },
  yaxis: 
  [
    {
      title: {
        text: "Purchase Orders",
        style: {
          color: "#f5f7ff",
        },
      },
      labels: {
        style: {
          colors: ["#f5f7ff"],
        },
      },
    },
    {
      opposite: true,
      title: {
        text: "Sales Orders",
        style: {
          color:  "#f5f7ff",
        },
      },
      labels: {
        style: {
          colors: ["#f5f7ff"],
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    theme: "dark",
  }
};

let areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
areaChart.render();