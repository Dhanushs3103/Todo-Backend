//packages
const express = require('express');
const router = express.Router();
const TodoModel = require('../model/Todo.model');
const UserModel = require('../model/User.model');

//Parent Router 
let todoRouter = router;

//Endpoint for getting all todos
todoRouter.get('/getTodos', async (req, res) => {   
    try { 
        let todos = await TodoModel.find();
        if(todos.length == 0) {
           return res.status(404).json({message:"No todos are found"});
        }
        res.status(200).json({message:"All todos fetched successfully", data:todos});
    } catch (error) {
        res.json({message:error.message});
    }
});

//Endpoint for the todo creation
todoRouter.post("/addTodo", async (req, res) => {
  let { title, description, status } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "fill all the fields" });
  }
  let user = await UserModel.findById(user_id);
  if (!user) return res.status(404).json({ message: "User not found" });
  try {
    let todo = new TodoModel({
      title,
      description,
      status,
      user:user._id
    });
    await todo.save();
    res.status(201).json({ message: "Todo created successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Endpoint for the todo updation
todoRouter.patch("/updateTodo/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, status } = req.body;
  try {
    let todo = await TodoModel.findById(id);
    if (!todo) {
      res.json({ message: "Todo not found" });
    } else {
      if (title) todo.title = title;
      if (description) todo.description = description;
      if (status) todo.status = status;
      await todo.save();
      res.status(201).json({ message: "Todo updated successfully" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Endpoint for the todo deletion
todoRouter.delete("/deleteTodo/:id",async (req, res) => {
  let { id } = req.params;
  try {
    let todo = await TodoModel.findById(id);
    if (!todo) {
      res.json({ message: "Todo not found" });
    } else {
      await TodoModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Todo deleted successfully" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

//exporting the parent routes
module.exports = todoRouter