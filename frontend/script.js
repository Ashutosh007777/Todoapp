// Replace with your Render backend URL
const baseURL = "https://todoapp-o4bc.onrender.com"; // <-- use your actual Render URL

async function loadTodos() {
  const res = await fetch(`${baseURL}/todos`);
  const todos = await res.json();

  const list = document.getElementById("todoList");
  list.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.textContent = todo.text;
    if (todo.done) li.classList.add("done");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.done ? "Undo" : "Done";
    toggleBtn.onclick = () => toggleDone(todo._id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => deleteTodo(todo._id);

    li.appendChild(toggleBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input.value.trim()) return;

  await fetch(`${baseURL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value })
  });

  input.value = "";
  loadTodos();
}

async function toggleDone(id) {
  await fetch(`${baseURL}/todos/${id}`, { method: "PUT" });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`${baseURL}/todos/${id}`, { method: "DELETE" });
  loadTodos();
}

// Initial load
loadTodos();
