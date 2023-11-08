import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Register from "./components/Register"; 
import Login from "./components/Signin";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []); // Run once on component mount
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally validate token with backend here and fetch user data if needed
      fetch('http://localhost:5000/validate_token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => response.json())
        .then(data => {
          if (data.valid) {
            setUser(data.user); // Set the user data here after validating the token
          }
        }).catch(error => {
          console.error('Error validating token:', error);
        });
    }
  }, []);
  

  const navigate = useNavigate();
  const handleRegister = async (username, email, password) => {
    
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
      // Assuming the API returns the user data on successful registration:
      setUser(data);
      // If you have a token returned from your backend, you might want to store it:
      // localStorage.setItem('token', data.token);

      if (response.ok) {
        console.log('Response from backend:', data);
        console.log('Registration successfully');
      } else {
        console.error('Registration failed');
        console.error('Error Details:', data);
      }
      
      navigate('/');

    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleLogin = async (username, email, password) => {

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      setUser(data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Login successfully', data);
      } else {
        console.error('Login failed');
        console.error('Error Details:', data);
  
      
      //localStorage.setItem('token', data.token); // Save the token to localStorage
      navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);

    }
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
      {!user ? (
        <>
          <Register onRegister={handleRegister} />
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <>
      <h1>Task Management App</h1>
      <TaskForm
        onAddTask={handleAddTask}
        newTaskName={newTaskName}
        setNewTaskName={setNewTaskName}
      />
      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      </>
      )}
    </div>
  );
};

export default App;
