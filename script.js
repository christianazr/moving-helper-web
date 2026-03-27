const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("movemate_tasks")) || [];

function saveTasks() {
  localStorage.setItem("movemate_tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const leftDiv = document.createElement("div");
    leftDiv.className = "item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    if (task.completed) {
      text.classList.add("completed");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(text);

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = taskInput.value.trim();
  if (!value) return;

  tasks.push({
    id: Date.now(),
    text: value,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

renderTasks();
