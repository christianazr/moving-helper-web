let user = null;
let editingBudgetId = null;

const form = document.getElementById("budget-form");
const nameInput = document.getElementById("budget-name");
const amountInput = document.getElementById("budget-amount");
const submitBtn = document.getElementById("budget-submit-btn");
const tableBody = document.getElementById("budget-table-body");
const totalEl = document.getElementById("budget-total");
const logoutBtn = document.getElementById("logout-btn");

async function loadBudgetItems() {
  const { data, error } = await supabaseClient
    .from("budget_items")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error loading budget items:", error);
    alert("Error loading budget items: " + error.message);
    return;
  }

  renderBudgetItems(data || []);
}

function renderBudgetItems(items) {
  tableBody.innerHTML = "";

  if (!items.length) {
    totalEl.textContent = "£0.00";
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">No expenses yet. Add your first budget item.</td>`;
    tableBody.appendChild(row);
    return;
  }

  let total = 0;

  items.forEach((item, index) => {
    total += Number(item.amount);

    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = index + 1;

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;

    const amountCell = document.createElement("td");
    amountCell.textContent = `£${Number(item.amount).toFixed(2)}`;

    const actionsCell = document.createElement("td");
    actionsCell.className = "table-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
      editingBudgetId = item.id;
      nameInput.value = item.name;
      amountInput.value = item.amount;
      submitBtn.textContent = "Update Expense";
      nameInput.focus();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete this expense?");
      if (!confirmed) return;

      const { error } = await supabaseClient
        .from("budget_items")
        .delete()
        .eq("id", item.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting budget item:", error);
        alert("Error deleting budget item: " + error.message);
        return;
      }

      if (editingBudgetId === item.id) {
        resetForm();
      }

      loadBudgetItems();
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    row.appendChild(numberCell);
    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  });

  totalEl.textContent = `£${total.toFixed(2)}`;
}

function resetForm() {
  editingBudgetId = null;
  form.reset();
  submitBtn.textContent = "Add Expense";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameValue = nameInput.value.trim();
  const amountValue = amountInput.value;

  if (!nameValue || !amountValue) return;

  if (editingBudgetId) {
    const { error } = await supabaseClient
      .from("budget_items")
      .update({
        name: nameValue,
        amount: Number(amountValue),
      })
      .eq("id", editingBudgetId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating budget item:", error);
      alert("Error updating budget item: " + error.message);
      return;
    }
  } else {
    const { error } = await supabaseClient
      .from("budget_items")
      .insert([
        {
          user_id: user.id,
          name: nameValue,
          amount: Number(amountValue),
        },
      ]);

    if (error) {
      console.error("Error adding budget item:", error);
      alert("Error adding budget item: " + error.message);
      return;
    }
  }

  resetForm();
  loadBudgetItems();
});

logoutBtn.addEventListener("click", async () => {
  await signOutUser();
  window.location.href = "login.html";
});

(async function init() {
  user = await getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadBudgetItems();
})();
