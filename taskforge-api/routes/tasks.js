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

module.exports = router;