const express = require("express");
const nodemon = require("nodemon");
const logger = require("./middleware/logger");
const tasksRoutes = require("./routes/tasks");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(logger);
app.use(express.static("public"));
app.use("/tasks", tasksRoutes);
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});