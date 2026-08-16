const express = require("express");
const nodemon = require("nodemon");
const logger = require("./middleware/logger");
const tasksRoutes = require("./routes/tasks");

const app = express();

const PORT = 3000;

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/tasks", tasksRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});