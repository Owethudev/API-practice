const express = require("express");
const logger = require("./middleware/logger");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");
const nodemon = require("nodemon");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use(express.static("public"));

app.use("/tasks", taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});