const apiBase = "/api/todos";

async function fetchTodos() {
  const res = await fetch(apiBase);
  const todos = await res.json();
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span style="text-decoration: ${todo.completed ? "line-through" : "none"}">
        ${todo.text}
      </span>
      <div>
        <button onclick="toggleComplete('${todo._id}', ${!todo.completed})">✔</button>
        <button onclick="deleteTodo('${todo._id}')">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function addTodo() {
  const input = document.getElementById("todo-input");
  const text = input.value.trim();
  if (!text) return alert("Enter a task!");
  await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  fetchTodos();
}

async function toggleComplete(id, completed) {
  await fetch(`${apiBase}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`${apiBase}/${id}`, { method: "DELETE" });
  fetchTodos();
}

document.getElementById("add-btn").addEventListener("click", addTodo);
fetchTodos();
