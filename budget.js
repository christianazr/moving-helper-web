let items = JSON.parse(localStorage.getItem("budget")) || [];

const form = document.getElementById("budget-form");
const list = document.getElementById("budget-list");
const totalEl = document.getElementById("total");

function save() {
  localStorage.setItem("budget", JSON.stringify(items));
}

function render() {
  list.innerHTML = "";
  let total = 0;

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - £${item.amount}`;
    list.appendChild(li);

    total += Number(item.amount);
  });

  totalEl.textContent = "£" + total;
}

form.onsubmit = (e) => {
  e.preventDefault();

  const name = document.getElementById("budget-name").value;
  const amount = document.getElementById("budget-amount").value;

  items.push({ name, amount });

  form.reset();
  save();
  render();
};

render();
