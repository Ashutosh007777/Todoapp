const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to local MongoDB
mongoose.connect("mongodb://localhost:27017/todoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 🟢 Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 🟢 Add a new todo
app.post("/todos", async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
});

// 🟢 Toggle done/undone
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

// 🟢 Delete todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
