const router = require("express").Router();
const Task = require("../Models/task");
const User = require("../Models/user");
const { authenticateToken } = require("./auth");

// Create Task  --->>>
router.post("/create-task", authenticateToken , async(req, res) => {
    try {
        const { title , desc } = req.body;
        const { id } = req.headers;
        const newTask = new Task({title: title, desc: desc});
        const saveTask = await newTask.save();
        const taskId = saveTask._id;
        await User.findByIdAndUpdate(id, {$push: { tasks: taskId._id }});
        res.status(200).json({ message: "Task created"});
    } 
    catch (error) {
        console.log(error);
        res.status(400).json({ message:"Internal server error"});
    }
});

router.get("/get-all-tasks", authenticateToken , async(req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "tasks" , 
            options: { sort: {createdAt: -1} }
        });
        res.status(200).json({data: userData});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message:"Internal server error"});
    }
});

router.delete("/delete-tasks/:id", authenticateToken , async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId), {$pull: { tasks: id }};
        res.status(200).json({messege: "Task deleted successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message:"Internal server error"});
    }
});

router.put("/update-tasks/:id", authenticateToken , async(req, res) => {
    try {
        const { id } = req.params;
        const{ title , desc } = req.body;
        await Task.findByIdAndUpdate(id, {title: title , desc: desc});
        res.status(200).json({messege: "Task updated successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message:"Internal server error"});
    }
});

router.put("/update-imp-tasks/:id", authenticateToken , async(req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id, {important: !ImpTask});
        res.status(200).json({messege: "Task updated successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message:"Internal server error"});
    }
});

router.put("/update-complete-tasks/:id", authenticateToken , async(req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const CompletedTask = TaskData.completed;
        await Task.findByIdAndUpdate(id, {completed: !CompletedTask});
        res.status(200).json({messege: "Task updated successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message:"Internal server error"});
    }
});

module.exports = router;