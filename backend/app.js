const express = require("express");
const cors = require("cors");
const storage = require("node-persist");

const app = express();
app.use(express.json());
app.use(cors());
// Clear the storage on application restart
storage.init({ dir: "tasks-storage" }).then(() => {
  console.log("Node-persist storage initialized");
});

app.get("/todos/clear", (req, res) => {
  // Clear the storage on application restart
  storage.clear().then(() => {
    console.log("Node-persist storage cleared");
  });
});

// GET all tasks
app.get("/todos/", async (req, res) => {
  try {
    const tasks = (await storage.getItem("tasks")) || [];
    res.json(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new task
app.post("/todos/new", async (req, res) => {
  try {
    const { name } = req.body;
    const tasks = (await storage.getItem("tasks")) || [];
    let task;
    if (tasks.length > 0) {
      task = { id: tasks[tasks.length - 1].id + 1, name };
    } else {
      task = { id: 1, name };
    }
    tasks.push(task);
    await storage.setItem("tasks", tasks);
    res.status(201).json({ task });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
