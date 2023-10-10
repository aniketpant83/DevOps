// TaskForm.js
import React, { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");

  const handleAddTask = () => {
    if (taskName.trim()) {
      onAddTask(taskName);
      setTaskName("");
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <input
        type="text"
        placeholder="Task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskForm;
