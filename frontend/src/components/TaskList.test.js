// src/components/TaskList.test.js
import React from 'react';
import { render } from '@testing-library/react';
import TaskList from './TaskList';

test('renders TaskList component', () => {
  const tasks = [
    { id: 1, name: 'Task 1', status: 'To Do' },
    { id: 2, name: 'Task 2', status: 'In Progress' },
    { id: 3, name: 'Task 3', status: 'Done' },
  ];

  const { getByText } = render(<TaskList tasks={tasks} onTaskClick={() => {}} />);

  // Check if TaskList component renders
  const taskListElement = getByText(/Task List/i);
  expect(taskListElement).toBeInTheDocument();

  // Check if each task is displayed in the correct category
  tasks.forEach((task) => {
    const taskElement = getByText(task.name);
    expect(taskElement).toBeInTheDocument();

    if (task.status === 'To Do') {
      const toDoHeader = getByText(/To Do/i);
      expect(toDoHeader).toBeInTheDocument();
    } else if (task.status === 'In Progress') {
      const inProgressHeader = getByText(/In Progress/i);
      expect(inProgressHeader).toBeInTheDocument();
    } else if (task.status === 'Done') {
      const doneHeader = getByText(/Done/i);
      expect(doneHeader).toBeInTheDocument();
    }
  });
});
