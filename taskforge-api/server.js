const express = require("express");
const { nanoid } = require("nanoid");

const app = express();

const PORT = 3000;

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
    title: "Clean the office",
    complete: true,
    createdAt: new Date().toISOString(),
  },
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});