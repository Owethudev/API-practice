const express = require("express");
const { nanoid } = require("nanoid");
const nodemon = require("nodemon");
const logger = require("./middleware/logger");

const app = express();

const PORT = 3000;

app.use(logger);
app.use(express.json());

const tasks = [
  {
    id: nanoid(),
    title: "Mow the lawn",
    complete: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    complete: true,
    createdAt: new Date().toISOString(),
  },
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id/verify", async (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  if (!task.title) {
    return res.status(400).json({
      message: "Task is missing the required title field",
    });
  }

  res.json({
    message: "Task verified successfully",
    task,
  });
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  const newTask = {
    id: nanoid(),
    title,
    complete: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { title, complete } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  task.title = title;
  task.complete = complete ?? false;

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(
    (task) => task.id === req.params.id
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks.splice(taskIndex, 1);

  res.json({
    message: "Task deleted successfully",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});