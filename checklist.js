let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    checkbox.onchange = () => {
      task.done = checkbox.checked;
      save();
      render();
    };

    const text = document.createElement("span");
    text.textContent = task.text;

    li.appendChild(checkbox);
    li.appendChild(text);
    list.appendChild(li);
  });
}

form.onsubmit = (e) => {
  e.preventDefault();

  tasks.push({
    text: input.value,
    done: false
  });

  input.value = "";
  save();
  render();
};

render();
