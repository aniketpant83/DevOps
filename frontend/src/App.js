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
  const navigate = useNavigate();
  const flask_url = 'http://localhost:5000/'

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []); // Run once on component mount
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("token is:",token);
    if (token) {
      fetch(flask_url + 'validate_token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Token validation failed');
        }
      }).then(data => {
        if (data.valid) {
          setUser(data.user); // Set the user data here after validating the token
        } else {
          // Handle the case where the token is not valid
          console.error('Token is not valid');
        }
      }).catch(error => {
        console.error('Error validating token:', error);
        // Possibly clear the token if it's not valid
        localStorage.removeItem('token');
        setUser(null); // Reset user state if the token is invalid
      });
    }
  }, []);
  
  

 
  const handleRegister = async (username, email, password) => {
    
    try {
      const response = await fetch(flask_url + 'register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
      // Assuming the API returns the user data on successful registration:
      setUser(data.user);

      if (response.ok) {
        localStorage.setItem('token', data.token);
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
      const response = await fetch(flask_url + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      setUser(data.user);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Loggedin, token is: ', data.token);
        console.log('Login successfully', data);
      } else {
        console.error('Login failed');
        console.error('Error Details:', data);
  
      navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);

    }
  };

  const handleLogout = async () => {
    // Send a POST request to the server to handle server-side logout if necessary
    try {
      const response = await fetch(flask_url + 'logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error('Logout failed:', data);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  
    // Remove the token from localStorage regardless of server response
    localStorage.removeItem('token');
    
    // Update the user state to null
    setUser(null);
  
    // Redirect to login page or home page
    navigate('/'); // or wherever you want to redirect after logout
  };
  

  // =============================== User Login & Register ========================================================


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

      const response = await fetch(flask_url + `tasks/${taskId}`, {
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
      const response = await fetch(flask_url + `tasks/${taskId}`, {
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

      const response = await fetch(flask_url + "tasks", {
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
      const response = await fetch(flask_url + "tasks");
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
        onLogout={handleLogout}
      />
      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      </>
      )}
    </div>
  );
};

export default App;
