let user = null;

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

async function init() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    await signIn();
    return;
  }

  user = data.session.user;
  loadTasks();
}

async function loadTasks() {
  const { data } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", user.id);

  render(data);
}

function render(tasks) {
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.onchange = async () => {
      await supabaseClient
        .from("tasks")
        .update({ completed: checkbox.checked })
        .eq("id", task.id);

      loadTasks();
    };

    const text = document.createElement("span");
    text.textContent = task.text;

    li.appendChild(checkbox);
    li.appendChild(text);
    list.appendChild(li);
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();

  await supabaseClient.from("tasks").insert([
    {
      text: input.value,
      completed: false,
      user_id: user.id
    }
  ]);

  input.value = "";
  loadTasks();
};

init();
