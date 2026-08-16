const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const router = express.Router();

// helper to forward errors from async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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



router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tasks = await readTasks();

    res.json(tasks);
  })
);

router.get(
  "/:id/verify",
  asyncHandler(async (req, res) => {
    const tasks = await readTasks();

    const task = tasks.find((task) => task.id === req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    // simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!task.title || typeof task.title !== "string" || task.title.trim() === "") {
      const error = new Error("Task is missing the required title field");
      error.status = 400;
      throw error;
    }

    res.json({ message: "Task verified successfully", task });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const tasks = await readTasks();

    const task = tasks.find((task) => task.id === req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    res.json(task);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title } = req.body || {};

    if (!title || typeof title !== "string" || title.trim() === "") {
      const error = new Error("Title is required");
      error.status = 400;
      throw error;
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
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { title, complete } = req.body || {};

    if (!title || typeof title !== "string" || title.trim() === "") {
      const error = new Error("Title is required");
      error.status = 400;
      throw error;
    }

    if (typeof complete !== "boolean") {
      const error = new Error("Complete must be a boolean");
      error.status = 400;
      throw error;
    }

    const tasks = await readTasks();

    const task = tasks.find((task) => task.id === req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    task.title = title.trim();
    task.complete = complete;

    await writeTasks(tasks);

    res.json(task);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const tasks = await readTasks();

    const taskIndex = tasks.findIndex((task) => task.id === req.params.id);

    if (taskIndex === -1) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    tasks.splice(taskIndex, 1);

    await writeTasks(tasks);

    res.status(204).send();
  })
);

module.exports = router;