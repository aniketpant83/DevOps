import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []); // Run once on component mount

  const handleTaskClick = (taskId) => {
    // Find the task with the clicked taskId
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: nextStatus(task.status) } : 
task
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

  const handleAddTask = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTaskName }),
      });

      if (response.ok) {
        // Task created successfully, update state or perform other 
actions
        setNewTaskName(""); // Clear input field
        fetchTasks(); // Refetch tasks to update the list
      } else {
        console.error("Error creating task:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("Error fetching tasks:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <h1>Task Management App</h1>
      <TaskForm
        onAddTask={handleAddTask}
        newTaskName={newTaskName}
        setNewTaskName={setNewTaskName}
      />
      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
    </div>
  );
};

export default App;

