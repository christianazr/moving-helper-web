let user = null;

const logoutBtn = document.getElementById("logout-btn");

const summaryCompleted = document.getElementById("summary-completed");
const summaryTotalTasks = document.getElementById("summary-total-tasks");
const summaryBoxes = document.getElementById("summary-boxes");
const summaryBudget = document.getElementById("summary-budget");

const statProgress = document.getElementById("stat-progress");
const statBoxes = document.getElementById("stat-boxes");
const statBudget = document.getElementById("stat-budget");

async function loadDashboard() {
  const [{ data: tasks, error: tasksError }, { data: boxes, error: boxesError }, { data: budgetItems, error: budgetError }] =
    await Promise.all([
      supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", user.id),
      supabaseClient
        .from("boxes")
        .select("*")
        .eq("user_id", user.id),
      supabaseClient
        .from("budget_items")
        .select("*")
        .eq("user_id", user.id),
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

  const totalTasks = (tasks || []).length;
  const completedTasks = (tasks || []).filter((task) => task.completed).length;
  const totalBoxes = (boxes || []).length;
  const totalBudget = (budgetItems || []).reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  summaryCompleted.textContent = completedTasks;
  summaryTotalTasks.textContent = totalTasks;
  summaryBoxes.textContent = totalBoxes;
  summaryBudget.textContent = `£${totalBudget.toFixed(2)}`;

  statProgress.textContent = `${completedTasks} / ${totalTasks}`;
  statBoxes.textContent = totalBoxes;
  statBudget.textContent = `£${totalBudget.toFixed(2)}`;
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
