let user = null;

const logoutBtn = document.getElementById("logout-btn");

const summaryCompleted = document.getElementById("summary-completed");
const summaryTotalTasks = document.getElementById("summary-total-tasks");
const summaryBoxes = document.getElementById("summary-boxes");
const summaryBudget = document.getElementById("summary-budget");

const statProgress = document.getElementById("stat-progress");
const statBoxes = document.getElementById("stat-boxes");
const statBudget = document.getElementById("stat-budget");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const progressSubtext = document.getElementById("progress-subtext");

const recentTasksList = document.getElementById("recent-tasks");
const recentBoxesList = document.getElementById("recent-boxes");

async function loadDashboard() {
  const [
    { data: tasks, error: tasksError },
    { data: boxes, error: boxesError },
    { data: budgetItems, error: budgetError }
  ] = await Promise.all([
    supabaseClient
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabaseClient
      .from("boxes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabaseClient
      .from("budget_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (tasksError) {
    console.error("Tasks error:", tasksError);
    alert("Error loading tasks summary: " + tasksError.message);
    return;
  }

  if (boxesError) {
    console.error("Boxes error:", boxesError);
    alert("Error loading boxes summary: " + boxesError.message);
    return;
  }

  if (budgetError) {
    console.error("Budget error:", budgetError);
    alert("Error loading budget summary: " + budgetError.message);
    return;
  }

  const safeTasks = tasks || [];
  const safeBoxes = boxes || [];
  const safeBudgetItems = budgetItems || [];

  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((task) => task.completed).length;
  const totalBoxes = safeBoxes.length;
  const totalBudget = safeBudgetItems.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const progressPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  summaryCompleted.textContent = completedTasks;
  summaryTotalTasks.textContent = totalTasks;
  summaryBoxes.textContent = totalBoxes;
  summaryBudget.textContent = `£${totalBudget.toFixed(2)}`;

  statProgress.textContent = `${completedTasks} / ${totalTasks}`;
  statBoxes.textContent = totalBoxes;
  statBudget.textContent = `£${totalBudget.toFixed(2)}`;

  progressText.textContent = `${progressPercent}%`;
  progressFill.style.width = `${progressPercent}%`;
  progressSubtext.textContent = `${completedTasks} of ${totalTasks} tasks completed`;

  renderRecentTasks(safeTasks.slice(0, 3));
  renderRecentBoxes(safeBoxes.slice(0, 3));
}

function renderRecentTasks(tasks) {
  recentTasksList.innerHTML = "";

  if (!tasks.length) {
    const li = document.createElement("li");
    li.className = "mini-list-empty";
    li.textContent = "No tasks yet.";
    recentTasksList.appendChild(li);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "mini-list-item";

    const badge = document.createElement("span");
    badge.className = task.completed ? "status-badge done" : "status-badge pending";
    badge.textContent = task.completed ? "Done" : "Pending";

    const content = document.createElement("div");
    content.className = "mini-list-content";

    const title = document.createElement("strong");
    title.textContent = task.text;

    const meta = document.createElement("span");
    meta.textContent = "Checklist item";

    content.appendChild(title);
    content.appendChild(meta);

    li.appendChild(content);
    li.appendChild(badge);

    recentTasksList.appendChild(li);
  });
}

function renderRecentBoxes(boxes) {
  recentBoxesList.innerHTML = "";

  if (!boxes.length) {
    const li = document.createElement("li");
    li.className = "mini-list-empty";
    li.textContent = "No boxes yet.";
    recentBoxesList.appendChild(li);
    return;
  }

  boxes.forEach((box, index) => {
    const li = document.createElement("li");
    li.className = "mini-list-item";

    const content = document.createElement("div");
    content.className = "mini-list-content";

    const title = document.createElement("strong");
    title.textContent = box.room;

    const meta = document.createElement("span");
    meta.textContent = box.items;

    const badge = document.createElement("span");
    badge.className = "status-badge neutral";
    badge.textContent = `Box ${index + 1}`;

    content.appendChild(title);
    content.appendChild(meta);

    li.appendChild(content);
    li.appendChild(badge);

    recentBoxesList.appendChild(li);
  });
}

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

  loadDashboard();
})();
