const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const router = express.Router();

const tasksFilePath = path.join(__dirname, "../data/tasks.json");

const readTasks = async () => {
  const data = await fs.readFile(tasksFilePath, "utf-8");

  return JSON.parse(data);
};

const writeTasks = async (tasks) => {
  await fs.writeFile(
    tasksFilePath,
    JSON.stringify(tasks, null, 2),
    "utf-8"
  );
};

router.get("/", async (req, res) => {
  const tasks = await readTasks();

  res.json(tasks);
});

router.get("/:id", async (req, res) => {
  const tasks = await readTasks();

  const task = tasks.find((task) => task.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
});

router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  const tasks = await readTasks();

  const newTask = {
    id: nanoid(),
    title: title.trim(),
    complete: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  await writeTasks(tasks);

  res.status(201).json(newTask);
});

router.put("/:id", async (req, res) => {
  const { title, complete } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (typeof complete !== "boolean") {
    return res.status(400).json({
      message: "Complete must be a boolean",
    });
  }

  const tasks = await readTasks();

  const task = tasks.find((task) => task.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  task.title = title.trim();
  task.complete = complete;

  await writeTasks(tasks);

  res.json(task);
});

module.exports = router;