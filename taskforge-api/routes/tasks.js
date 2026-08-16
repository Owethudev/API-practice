const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();

const tasksFilePath = path.join(__dirname, "../data/tasks.json");

const readTasks = async () => {
  const data = await fs.readFile(tasksFilePath, "utf-8");

  return JSON.parse(data);
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

module.exports = router;