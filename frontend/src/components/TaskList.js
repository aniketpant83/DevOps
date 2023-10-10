// src/components/TaskList.js
import React from "react";
import Task from "./Task";

const TaskList = ({ tasks, onTaskClick }) => {
  // Separate tasks based on status
  const toDoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  return (
    <div>
      <h2>Task List</h2>

      <div>
        <h3>To Do</h3>
        <ul>
          {toDoTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </ul>
      </div>

      <div>
        <h3>In Progress</h3>
        <ul>
          {inProgressTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </ul>
      </div>

      <div>
        <h3>Done</h3>
        <ul>
          {doneTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
