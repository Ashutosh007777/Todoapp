const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo"); // Make sure this exists

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas (replace <password> with your DB password)
mongoose.connect(
  "mongodb+srv://ashutoshchatur07_db_user:u6jkSgMynsyvpu8O@cluster0.ric4fav.mongodb.net/todoDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 🟢 Root route to prevent 404
app.get("/", (req, res) => {
  res.send("✅ Todo App Backend is running!");
});

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
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

// 🟢 Delete todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
