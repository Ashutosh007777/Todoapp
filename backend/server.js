import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// For resolving __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Schema & Model =====
const todoSchema = new mongoose.Schema({
  text: String,
  done: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// ===== API Routes =====

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
app.post("/todos", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  await todo.save();
  res.json(todo);
});

// Toggle done
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

// ===== Serve Frontend (Fixed for Express v5) =====
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`✅ Todo App Backend is running on port ${PORT}`));
