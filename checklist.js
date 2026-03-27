let user = null;

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

async function loadTasks() {
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  render(data || []);
}

function render(tasks) {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const leftDiv = document.createElement("div");
    leftDiv.className = "item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", async () => {
      await supabaseClient
        .from("tasks")
        .update({ completed: checkbox.checked })
        .eq("id", task.id);

      loadTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.completed) text.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", async () => {
      await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", task.id);

      loadTasks();
    });

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(text);

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  const { error } = await supabaseClient.from("tasks").insert([
    {
      user_id: user.id,
      text: value,
      completed: false
    }
  ]);

  if (error) {
    console.error(error);
    return;
  }

  input.value = "";
  loadTasks();
});

(async function init() {
  user = await getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  loadTasks();
})();
