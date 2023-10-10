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
  
  
  const handleAddTask = async (newTaskName) => {
    try {
        const payload = { name: newTaskName };

        // Log the payload before sending the request
        console.log('Request Payload:', payload);

        const response = await fetch("http://localhost:5000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            // Log the response data
            const data = await response.json();
            console.log('Response from backend:', data);

            // Task added successfully
            console.log('Task added successfully');
        } else {
            // Log detailed error information
            const errorData = await response.json();
            console.error('Failed to add task:', response.statusText);
            console.error('Error Details:', errorData);
        }
    } catch (error) {
        // Log generic error information
        console.error('Error adding task:', error);
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

