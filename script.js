let transactions = JSON.parse(localStorage.getItem("financifyData")) || [];

const incomeForm = document.getElementById("incomeForm");
const expenseForm = document.getElementById("expenseForm");

const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");

const transactionList = document.getElementById("transactionList");
const categoryList = document.getElementById("categoryList");

const resetBtn = document.getElementById("resetBtn");


// SAVE TO LOCAL STORAGE
function saveData() {
    localStorage.setItem("financifyData", JSON.stringify(transactions));
}

// ADD INCOME
incomeForm.addEventListener("submit", e => {
    e.preventDefault();

    transactions.push({
        type: "income",
        name: incomeSource.value,
        amount: +incomeAmount.value
    });

    incomeForm.reset();
    saveData();
    renderUI();
});

// ADD EXPENSE
expenseForm.addEventListener("submit", e => {
    e.preventDefault();

    transactions.push({
        type: "expense",
        name: expenseName.value,
        amount: +expenseAmount.value,
        category: expenseCategory.value
    });

    expenseForm.reset();
    saveData();
    renderUI();
});

// RENDER EVERYTHING (ASYNC JUST FOR DEMO)
async function renderUI() {
    await new Promise(r => setTimeout(r, 100)); // async touch

    let income = 0;
    let expense = 0;
    let categories = {};

    transactionList.innerHTML = "";
    categoryList.innerHTML = "";

    transactions.forEach((t, index) => {
        if (t.type === "income") income += t.amount;
        else {
            expense += t.amount;
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        }

        const li = document.createElement("li");
        li.className = t.type;
        li.innerHTML = `
            ${t.type === "income" ? "+" : "-"} ${t.name} ₹${t.amount}
            <button class="delete" onclick="deleteTransaction(${index})">✖</button>
        `;
        transactionList.appendChild(li);
    });

    for (let cat in categories) {
        const li = document.createElement("li");
        li.textContent = `${cat}: ₹${categories[cat]}`;
        categoryList.appendChild(li);
    }

    totalIncomeEl.textContent = `₹${income}`;
    totalExpenseEl.textContent = `₹${expense}`;

    const balance = income - expense;
    balanceEl.textContent = `₹${balance}`;
    balanceEl.style.color = balance < 0 ? "#DC2626" : "#16A34A";
}

resetBtn.addEventListener("click", () => {
    const confirmReset = confirm("Are you sure you want to reset all data?");

    if (!confirmReset) return;

    transactions = [];                // clear array
    localStorage.removeItem("financifyData"); // clear storage
    renderUI();                        // update DOM
});


// DELETE TRANSACTION
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveData();
    renderUI();
}

// INITIAL LOAD
renderUI();
