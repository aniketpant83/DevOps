// src/App.js
import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css"; // Import the CSS file

const App = () => {
  const [tasks, setTasks] = useState([]);

  const handleTaskClick = (taskId) => {
    // Find the task with the clicked taskId
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: nextStatus(task.status) } : task
    );

    setTasks(updatedTasks);
  };

  const nextStatus = (currentStatus) => {
    // Define your logic for transitioning task status here
    switch (currentStatus) {
      case "To Do":
        return "In Progress";
      case "In Progress":
        return "Done";
      case "Done":
        return "To Do";
      default:
        return currentStatus;
    }
  };

  const handleAddTask = (taskName) => {
    const newTask = {
      id: tasks.length + 1, // Unique ID (you can use a more robust solution)
      name: taskName,
      status: "To Do" // Initial status
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div>
      <h1>Task Management App</h1>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
    </div>
  );
};

export default App;
