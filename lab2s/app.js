// Адрес Flask backend.
const API_URL = "/api/items";

async function getItems() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Ошибка загрузки записей");
  }

  return await response.json();
}

async function postItem(title) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Ошибка сохранения записи");
  }

  return data;
}

// Находим элементы на странице по id
const peekBtn  = document.getElementById("peekBtn");
const feedBtn  = document.getElementById("feedBtn");
const closeBtn = document.getElementById("closeBtn");
const feedForm = document.getElementById("feedForm");
const feedInput = document.getElementById("feedInput");
const doorPanel = document.getElementById("doorPanel");
const list      = document.getElementById("list");
const empty     = document.getElementById("empty");
const errorEl   = document.getElementById("error");
const controls  = document.querySelector(".controls");

const creature = document.getElementById("creature");

function blink() {
  creature.classList.add("blinking");
  setTimeout(() => creature.classList.remove("blinking"), 250);
}

function chew() {
  creature.classList.add("eating");
  setTimeout(() => creature.classList.remove("eating"), 350);
}

// Функции отрисовки:

// Показать/спрятать сообщение об ошибке
function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.textContent = "";
  errorEl.hidden = true;
}

// Отобразить список записей
function renderItems(items) {
  list.innerHTML = "";

  if (items.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.title;
    list.appendChild(li);
  });
}

// Загрузить список с "сервера" и отобразить
async function loadItems() {
  try {
    clearError();
    const items = await getItems();
    renderItems(items);
  } catch (err) {
    showError("Не удалось загрузить записи: " + err.message);
  }
}

// Обработчики событий:

// Кнопка "Загляни в меня"
peekBtn.addEventListener("click", () => {
  blink();
  setTimeout(async () => {
    controls.hidden = true;
    feedForm.hidden = true;
    doorPanel.hidden = false;
    await loadItems();
  }, 280);
});

// Кнопка "Покорми меня"
feedBtn.addEventListener("click", () => {
  feedForm.hidden = false;
  feedInput.focus();
});

// Отправка формы (клик по "Скормить" или Enter)
feedForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = feedInput.value.trim();
  if (title === "") return;

  try {
    clearError();
    chew();

    feedForm.hidden = true;
    controls.hidden = true;
    doorPanel.hidden = false;

    await postItem(title);
    feedInput.value = "";
    await loadItems();
  } catch (err) {
    showError("Не удалось сохранить: " + err.message);
  }
});

// Кнопка "Закрыть" в дверце
closeBtn.addEventListener("click", () => {
  doorPanel.hidden = true;
  controls.hidden = false;
  clearError();
});