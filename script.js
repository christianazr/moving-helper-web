const taskForm = document.getElementById('task-form');
    const text = document.createElement('span');
    text.textContent = `${entry.name} — £${Number(entry.amount).toFixed(2)}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      budgets = budgets.filter((item) => item.id !== entry.id);
      saveData();
      renderBudgets();
    });

    li.appendChild(text);
    li.appendChild(deleteBtn);
    budgetList.appendChild(li);
  });

  budgetTotal.textContent = `£${total.toFixed(2)}`;
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  tasks.push({
    id: crypto.randomUUID(),
    text: taskInput.value.trim(),
    completed: false,
  });

  taskInput.value = '';
  saveData();
  renderTasks();
});

boxForm.addEventListener('submit', (e) => {
  e.preventDefault();

  boxes.push({
    id: crypto.randomUUID(),
    label: `Box ${boxes.length + 1}`,
    room: boxRoom.value.trim(),
    items: boxItems.value.trim(),
  });

  boxRoom.value = '';
  boxItems.value = '';
  saveData();
  renderBoxes();
});

budgetForm.addEventListener('submit', (e) => {
  e.preventDefault();

  budgets.push({
    id: crypto.randomUUID(),
    name: budgetName.value.trim(),
    amount: budgetAmount.value,
  });

  budgetName.value = '';
  budgetAmount.value = '';
  saveData();
  renderBudgets();
});

clearAllBtn.addEventListener('click', () => {
  const confirmed = confirm('Are you sure you want to delete all saved data?');
  if (!confirmed) return;

  tasks = [];
  boxes = [];
  budgets = [];
  saveData();
  renderTasks();
  renderBoxes();
  renderBudgets();
});

renderTasks();
renderBoxes();
renderBudgets();
