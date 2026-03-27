let boxes = JSON.parse(localStorage.getItem("boxes")) || [];

const form = document.getElementById("box-form");
const table = document.getElementById("box-table");

function save() {
  localStorage.setItem("boxes", JSON.stringify(boxes));
}

function render() {
  table.innerHTML = "";

  boxes.forEach((box, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${box.room}</td>
      <td>${box.items}</td>
    `;

    table.appendChild(row);
  });
}

form.onsubmit = (e) => {
  e.preventDefault();

  const room = document.getElementById("box-room").value;
  const items = document.getElementById("box-items").value;

  boxes.push({ room, items });

  form.reset();
  save();
  render();
};

render();
