let user = null;

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout-btn");

async function loadTasks() {
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error loading tasks:", error);
    alert("Error loading tasks: " + error.message);
    return;
  }

  renderTasks(data || []);
}

function renderTasks(tasks) {
  list.innerHTML = "";

  if (!tasks.length) {
    const empty = document.createElement("li");
    empty.textContent = "No tasks yet. Add your first moving task.";
    list.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const leftDiv = document.createElement("div");
    leftDiv.className = "item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!task.completed;

    checkbox.addEventListener("change", async () => {
      const { error } = await supabaseClient
        .from("tasks")
        .update({ completed: checkbox.checked })
        .eq("id", task.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating task:", error);
        alert("Error updating task: " + error.message);
        return;
      }

      loadTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    if (task.completed) {
      text.classList.add("completed");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", async () => {
      const { error } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", task.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting task:", error);
        alert("Error deleting task: " + error.message);
        return;
      }

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
      completed: false,
    },
  ]);

  if (error) {
    console.error("Error adding task:", error);
    alert("Error adding task: " + error.message);
    return;
  }

  input.value = "";
  loadTasks();
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

  loadTasks();
})();
