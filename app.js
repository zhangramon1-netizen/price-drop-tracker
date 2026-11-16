// JavaScript: the BEHAVIOR. It reacts to what you do on the page.

// Where we save data. localStorage is a small storage area inside YOUR browser,
// so bookings survive a refresh. (Later we'll move this to a real server so alerts can work.)
const STORAGE_KEY = "price-drop-tracker:bookings";

// Load saved bookings, or start with an empty list.
function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// "state": the current list of bookings. The screen is always drawn from this.
let bookings = loadBookings();

const form = document.getElementById("booking-form");
const listEl = document.getElementById("booking-list");
const emptyEl = document.getElementById("empty");

const money = (n) => "$" + Number(n).toFixed(2);

// When the form is submitted, add a booking.
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser's default "reload the page"

  bookings.push({
    id: Date.now(), // a simple unique id
    type: document.getElementById("type").value,
    name: document.getElementById("name").value.trim(),
    date: document.getElementById("date").value,
    paid: Number(document.getElementById("paid").value),
    refundable: document.getElementById("refundable").checked,
    currentPrice: null, // filled in later (by hand now, automatically later)
  });

  saveBookings(bookings);
  form.reset();
  render();
});

// Draw the list on screen from the current data.
function render() {
  listEl.innerHTML = ""; // clear, then rebuild
  emptyEl.hidden = bookings.length > 0;

  for (const b of bookings) {
    const li = document.createElement("li");

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = (b.type === "flight" ? "✈️ " : "🏨 ") + b.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent =
      `${b.date} · paid ${money(b.paid)}` + (b.refundable ? " · refundable" : "");

    const row = document.createElement("div");
    row.className = "row";

    // Manual "current price" box. Later, a script will fill this in automatically.
    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.min = "0";
    priceInput.step = "0.01";
    priceInput.placeholder = "Current $";
    if (b.currentPrice !== null) priceInput.value = b.currentPrice;
    priceInput.addEventListener("change", () => {
      b.currentPrice = priceInput.value === "" ? null : Number(priceInput.value);
      saveBookings(bookings);
      render();
    });
    row.append(priceInput);

    // If the current price is lower than what you paid, show the savings.
    if (b.currentPrice !== null && b.currentPrice < b.paid) {
      const saved = b.paid - b.currentPrice;
      const note = document.createElement("span");
      note.className = "drop";
      note.textContent = `⬇ Dropped ${money(saved)}`;
      row.append(note);

      if (b.refundable) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = "Rebook to save!";
        row.append(badge);
      }
    }

    const del = document.createElement("button");
    del.className = "small";
    del.textContent = "Remove";
    del.addEventListener("click", () => {
      bookings = bookings.filter((x) => x.id !== b.id);
      saveBookings(bookings);
      render();
    });
    row.append(del);

    li.append(title, meta, row);
    listEl.append(li);
  }
}

render(); // draw once when the page loads
