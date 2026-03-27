const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const boxForm = document.getElementById('box-form');
const boxRoom = document.getElementById('box-room');
const boxItems = document.getElementById('box-items');
const boxList = document.getElementById('box-list');

const budgetForm = document.getElementById('budget-form');
const budgetName = document.getElementById('budget-name');
const budgetAmount = document.getElementById('budget-amount');
const budgetList = document.getElementById('budget-list');
const budgetTotal = document.getElementById('budget-total');

const clearAllBtn = document.getElementById('clear-all');

let tasks = JSON.parse(localStorage.getItem('movemate_tasks')) || [];
let boxes = JSON.parse(localStorage.getItem('movemate_boxes')) || [];
let budgets = JSON.parse(localStorage.getItem('movemate_budgets')) || [];

// Generador de ID compatible
function createId() {
return Date.now().toString() + Math.random().toString(16).slice(2);
}

function saveData() {
localStorage.setItem('movemate_tasks', JSON.stringify(tasks));
localStorage.setItem('movemate_boxes', JSON.stringify(boxes));
localStorage.setItem('movemate_budgets', JSON.stringify(budgets));
}

function renderTasks() {
taskList.innerHTML = '';

tasks.forEach((task) => {
const li = document.createElement('li');

```
const left = document.createElement('div');
left.className = 'item-left';

const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.checked = task.completed;
checkbox.addEventListener('change', () => {
  task.completed = checkbox.checked;
  saveData();
  renderTasks();
});

const span = document.createElement('span');
span.textContent = task.text;
if (task.completed) span.classList.add('completed');

const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Delete';
deleteBtn.className = 'delete-btn';
deleteBtn.addEventListener('click', () => {
  tasks = tasks.filter((item) => item.id !== task.id);
  saveData();
  renderTasks();
});

left.appendChild(checkbox);
left.appendChild(span);
li.appendChild(left);
li.appendChild(deleteBtn);
taskList.appendChild(li);
```

});
}

function renderBoxes() {
boxList.innerHTML = '';

boxes.forEach((box) => {
const li = document.createElement('li');

```
const text = document.createElement('span');
text.textContent = `${box.label} — ${box.room}: ${box.items}`;

const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Delete';
deleteBtn.className = 'delete-btn';
deleteBtn.addEventListener('click', () => {
  boxes = boxes.filter((item) => item.id !== box.id);
  saveData();
  renderBoxes();
});

li.appendChild(text);
li.appendChild(deleteBtn);
boxList.appendChild(li);
```

});
}

function renderBudgets() {
budgetList.innerHTML = '';
let total = 0;

budgets.forEach((entry) => {
total += Number(entry.amount);

```
const li = document.createElement('li');
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
```

});

budgetTotal.textContent = `£${total.toFixed(2)}`;
}

// EVENTOS

taskForm.addEventListener('submit', (e) => {
e.preventDefault();

const value = taskInput.value.trim();
if (!value) return;

tasks.push({
id: createId(),
text: value,
completed: false,
});

taskInput.value = '';
saveData();
renderTasks();
});

boxForm.addEventListener('submit', (e) => {
e.preventDefault();

const roomValue = boxRoom.value.trim();
const itemsValue = boxItems.value.trim();
if (!roomValue || !itemsValue) return;

boxes.push({
id: createId(),
label: `Box ${boxes.length + 1}`,
room: roomValue,
items: itemsValue,
});

boxRoom.value = '';
boxItems.value = '';
saveData();
renderBoxes();
});

budgetForm.addEventListener('submit', (e) => {
e.preventDefault();

const nameValue = budgetName.value.trim();
const amountValue = budgetAmount.value;
if (!nameValue || !amountValue) return;

budgets.push({
id: createId(),
name: nameValue,
amount: amountValue,
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

// Render inicial
renderTasks();
renderBoxes();
renderBudgets();
