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

  const handleTaskClick = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (taskToUpdate.status === 'Done') {
        await deleteTask(taskId);
      }
      // Find the task with the clicked taskId
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: nextStatus(task.status) }
          : task
      );

      setTasks(updatedTasks);

      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus(tasks.find(task => task.id === taskId).status) }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from backend:', data);
        console.log('Task updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to update task:', response.statusText);
        console.error('Error Details:', errorData);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete task:', response.statusText);
        console.error('Error Details:', errorData);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  const handleAddTask = async (newTaskName) => {
    try {
      const payload = { name: newTaskName };

      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from backend:', data);
        console.log('Task added successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to add task:', response.statusText);
        console.error('Error Details:', errorData);
      }
    } catch (error) {
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
