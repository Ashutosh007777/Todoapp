// Replace with your Render backend URL
const BASE_URL = 'https://todoapp-o4bc.onrender.com';  // <-- change to your actual Render URL

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Fetch all todos
async function fetchTodos() {
  const res = await fetch(`${BASE_URL}/todos`);
  const todos = await res.json();
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.task;
    li.style.textDecoration = todo.completed ? 'line-through' : 'none';

    // Toggle completed
    li.addEventListener('click', async () => {
      await fetch(`${BASE_URL}/todos/${todo._id}`, { method: 'PUT' });
      fetchTodos();
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await fetch(`${BASE_URL}/todos/${todo._id}`, { method: 'DELETE' });
      fetchTodos();
    });

    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

// Add new todo
addBtn.addEventListener('click', async () => {
  const task = taskInput.value.trim();
  if (!task) return alert('Enter a task!');
  await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  taskInput.value = '';
  fetchTodos();
});

// Initial load
fetchTodos();
