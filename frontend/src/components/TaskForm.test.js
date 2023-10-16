// TaskForm.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';

test('renders TaskForm', () => {
  const mockOnAddTask = jest.fn();
  const { getByText, getByPlaceholderText } = render(<TaskForm onAddTask={mockOnAddTask} />);
  
  // Check if the component renders correctly
  expect(getByText('Add Task')).toBeInTheDocument();
  expect(getByPlaceholderText('Task name')).toBeInTheDocument();
  expect(getByText('Add')).toBeInTheDocument();

  // Simulate user input and click
  fireEvent.change(getByPlaceholderText('Task name'), { target: { value: 'Test Task' } });
  fireEvent.click(getByText('Add'));

  // Verify if the function was called with the correct argument
  expect(mockOnAddTask).toHaveBeenCalledWith('Test Task');
});
