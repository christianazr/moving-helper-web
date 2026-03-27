let user = null;
let editingBoxId = null;

const form = document.getElementById("box-form");
const roomInput = document.getElementById("box-room");
const itemsInput = document.getElementById("box-items");
const submitBtn = document.getElementById("box-submit-btn");
const tableBody = document.getElementById("box-table-body");
const logoutBtn = document.getElementById("logout-btn");

async function loadBoxes() {
  const { data, error } = await supabaseClient
    .from("boxes")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error loading boxes:", error);
    alert("Error loading boxes: " + error.message);
    return;
  }

  renderBoxes(data || []);
}

function renderBoxes(boxes) {
  tableBody.innerHTML = "";

  if (!boxes.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">No boxes yet. Add your first box.</td>`;
    tableBody.appendChild(row);
    return;
  }

  boxes.forEach((box, index) => {
    const row = document.createElement("tr");

    const boxNumberCell = document.createElement("td");
    boxNumberCell.textContent = index + 1;

    const roomCell = document.createElement("td");
    roomCell.textContent = box.room;

    const itemsCell = document.createElement("td");
    itemsCell.textContent = box.items;

    const actionsCell = document.createElement("td");
    actionsCell.className = "table-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
      editingBoxId = box.id;
      roomInput.value = box.room;
      itemsInput.value = box.items;
      submitBtn.textContent = "Update Box";
      roomInput.focus();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete this box?");
      if (!confirmed) return;

      const { error } = await supabaseClient
        .from("boxes")
        .delete()
        .eq("id", box.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting box:", error);
        alert("Error deleting box: " + error.message);
        return;
      }

      if (editingBoxId === box.id) {
        resetForm();
      }

      loadBoxes();
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    row.appendChild(boxNumberCell);
    row.appendChild(roomCell);
    row.appendChild(itemsCell);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  });
}

function resetForm() {
  editingBoxId = null;
  form.reset();
  submitBtn.textContent = "Add Box";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const roomValue = roomInput.value.trim();
  const itemsValue = itemsInput.value.trim();

  if (!roomValue || !itemsValue) return;

  if (editingBoxId) {
    const { error } = await supabaseClient
      .from("boxes")
      .update({
        room: roomValue,
        items: itemsValue,
      })
      .eq("id", editingBoxId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating box:", error);
      alert("Error updating box: " + error.message);
      return;
    }
  } else {
    const { error } = await supabaseClient
      .from("boxes")
      .insert([
        {
          user_id: user.id,
          room: roomValue,
          items: itemsValue,
        },
      ]);

    if (error) {
      console.error("Error adding box:", error);
      alert("Error adding box: " + error.message);
      return;
    }
  }

  resetForm();
  loadBoxes();
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

  loadBoxes();
})();
