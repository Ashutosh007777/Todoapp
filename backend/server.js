const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Todo = require("./models/Todo");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Connect to MongoDB Atlas
mongoose
  .connect("mongodb+srv://ashutoshchatur07_db_user:u6jkSgMynsyvpu8O@cluster0.ric4fav.mongodb.net/todoDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Default homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// ✅ Add new todo
app.post("/todos", async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
});

// ✅ Toggle done/undone
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

// ✅ Delete todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
