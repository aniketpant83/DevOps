// Task.js
import React from "react";

const Task = ({ task, onClick }) => {
  return (
    <li onClick={onClick}>
      {task.name} - {task.status}
    </li>
  );
};

export default Task;
