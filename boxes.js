let user = null;
let editingBoxId = null;
let allBoxes = [];

const form = document.getElementById("box-form");
const roomInput = document.getElementById("box-room");
const itemsInput = document.getElementById("box-items");
const statusInput = document.getElementById("box-status");
const submitBtn = document.getElementById("box-submit-btn");
const tableBody = document.getElementById("box-table-body");
const logoutBtn = document.getElementById("logout-btn");

const searchInput = document.getElementById("box-search");
const roomFilter = document.getElementById("room-filter");

async function loadBoxes() {
  const { data, error } = await supabaseClient
    .from("boxes")
    .select("*")
    .eq("user_id", user.id)
    .order("box_number", { ascending: true });

  if (error) {
    console.error("Error loading boxes:", error);
    alert("Error loading boxes: " + error.message);
    return;
  }

  allBoxes = data || [];
  populateRoomFilter(allBoxes);
  applyFilters();
}

function populateRoomFilter(boxes) {
  const uniqueRooms = [...new Set(
    boxes
      .map((box) => (box.room || "").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const currentValue = roomFilter.value;

  roomFilter.innerHTML = `<option value="all">All rooms</option>`;

  uniqueRooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.toLowerCase();
    option.textContent = room;
    roomFilter.appendChild(option);
  });

  const stillExists =
    currentValue === "all" ||
    uniqueRooms.some((room) => room.toLowerCase() === currentValue);

  roomFilter.value = stillExists ? currentValue : "all";
}

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedRoom = roomFilter.value;

  const filteredBoxes = allBoxes.filter((box) => {
    const roomText = (box.room || "").toLowerCase();
    const itemsText = (box.items || "").toLowerCase();
    const boxNumberText = String(box.box_number || "");

    const matchesSearch =
      !searchValue ||
      roomText.includes(searchValue) ||
      itemsText.includes(searchValue) ||
      boxNumberText.includes(searchValue);

    const matchesRoom =
      selectedRoom === "all" || roomText === selectedRoom;

    return matchesSearch && matchesRoom;
  });

  renderBoxes(filteredBoxes);
}

function getStatusBadgeClass(status) {
  if (status === "Packed") return "status-badge done";
  if (status === "Unpacked") return "status-badge pending";
  if (status === "Fragile") return "status-badge fragile";
  return "status-badge neutral";
}

function renderBoxes(boxes) {
  tableBody.innerHTML = "";

  if (!boxes.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5">No boxes match your search or filter.</td>`;
    tableBody.appendChild(row);
    return;
  }

  boxes.forEach((box) => {
    const row = document.createElement("tr");

    const boxNumberCell = document.createElement("td");
    boxNumberCell.textContent = box.box_number ?? "-";

    const roomCell = document.createElement("td");
    roomCell.textContent = box.room;

    const itemsCell = document.createElement("td");
    itemsCell.textContent = box.items;

    const statusCell = document.createElement("td");
    const statusBadge = document.createElement("span");
    statusBadge.className = getStatusBadgeClass(box.status);
    statusBadge.textContent = box.status || "Packed";
    statusCell.appendChild(statusBadge);

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
      statusInput.value = box.status || "Packed";
      submitBtn.textContent = "Update Box";
      roomInput.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm(`Are you sure you want to delete Box ${box.box_number}?`);
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
    row.appendChild(statusCell);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  });
}

function resetForm() {
  editingBoxId = null;
  form.reset();
  statusInput.value = "Packed";
  submitBtn.textContent = "Add Box";
}

async function getNextBoxNumber() {
  const { data, error } = await supabaseClient
    .from("boxes")
    .select("box_number")
    .eq("user_id", user.id)
    .order("box_number", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error getting next box number:", error);
    throw error;
  }

  if (!data || data.length === 0 || data[0].box_number == null) {
    return 1;
  }

  return Number(data[0].box_number) + 1;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const roomValue = roomInput.value.trim();
  const itemsValue = itemsInput.value.trim();
  const statusValue = statusInput.value;

  if (!roomValue || !itemsValue || !statusValue) return;

  if (editingBoxId) {
    const { error } = await supabaseClient
      .from("boxes")
      .update({
        room: roomValue,
        items: itemsValue,
        status: statusValue,
      })
      .eq("id", editingBoxId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating box:", error);
      alert("Error updating box: " + error.message);
      return;
    }
  } else {
    let nextBoxNumber;

    try {
      nextBoxNumber = await getNextBoxNumber();
    } catch (error) {
      alert("Error creating box number: " + error.message);
      return;
    }

    const { error } = await supabaseClient
      .from("boxes")
      .insert([
        {
          user_id: user.id,
          box_number: nextBoxNumber,
          room: roomValue,
          items: itemsValue,
          status: statusValue,
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

searchInput.addEventListener("input", applyFilters);
roomFilter.addEventListener("change", applyFilters);

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

  statusInput.value = "Packed";
  loadBoxes();
})();
