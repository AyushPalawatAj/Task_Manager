const express = require("express");
const app = express();

require("dotenv").config();
require("./Connection/conn");

const cors = require("cors");
const UserAPI = require("./Routes/userRoutes");
const TaskAPI = require("./Routes/taskRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);

app.use("/", (req, res) => {
    res.send("Hello From Backend !!");
});

const PORT = 1000;
app.listen(PORT, () => {
    console.log("Server started");
});