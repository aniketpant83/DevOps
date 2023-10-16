// TaskForm.js
import React, { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");

  const handleAddTask = () => {
    console.log('Task Name:', taskName);
    if (taskName.trim()) {
      onAddTask(taskName);
      setTaskName(""); // Clear the input after adding the task
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
      <button onClick={handleAddTask}>Add</button>
    </div>
  );
};

export default TaskForm;
