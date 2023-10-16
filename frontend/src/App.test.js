import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders Task Management App heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Task Management App/i);
  expect(headingElement).toBeInTheDocument();
});

test("renders TaskForm and TaskList components", () => {
  render(<App />);
  const taskFormElement = screen.getByText(/Add Task/i);
  const taskListElement = screen.getByText(/Task List/i);
  expect(taskFormElement).toBeInTheDocument();
  expect(taskListElement).toBeInTheDocument();
});

test("allows user to add a task", () => {
  render(<App />);
  const taskName = "Test Task";
  const inputElement = screen.getByPlaceholderText(/Task name/i);
  const addButtonElement = screen.getByText(/Add Task/i);

  fireEvent.change(inputElement, { target: { value: taskName } });
  fireEvent.click(addButtonElement);

  const addedTaskElement = screen.getByText(taskName);
  expect(addedTaskElement).toBeInTheDocument();
});

test("allows user to transition task status", () => {
  render(<App />);
  const taskName = "Test Task";
  const inputElement = screen.getByPlaceholderText(/Task name/i);
  const addButtonElement = screen.getByText(/Add Task/i);
  const taskElement = screen.getByText(taskName);

  fireEvent.change(inputElement, { target: { value: taskName } });
  fireEvent.click(addButtonElement);

  // Initial status: To Do
  fireEvent.click(taskElement);
  let updatedTaskElement = screen.getByText(/In Progress/i);
  expect(updatedTaskElement).toBeInTheDocument();

  // Status transition: In Progress -> Done
  fireEvent.click(updatedTaskElement);
  updatedTaskElement = screen.getByText(/Done/i);
  expect(updatedTaskElement).toBeInTheDocument();

  // Status transition: Done -> To Do
  fireEvent.click(updatedTaskElement);
  updatedTaskElement = screen.getByText(/To Do/i);
  expect(updatedTaskElement).toBeInTheDocument();
});

test("allows user to delete a task", () => {
  render(<App />);
  const taskName = "Test Task";
  const inputElement = screen.getByPlaceholderText(/Task name/i);
  const addButtonElement = screen.getByText(/Add Task/i);
  const taskElement = screen.getByText(taskName);

  fireEvent.change(inputElement, { target: { value: taskName } });
  fireEvent.click(addButtonElement);

  fireEvent.contextMenu(taskElement);
  fireEvent.click(screen.getByText(/Delete/i));

  const deletedTaskElement = screen.queryByText(taskName);
  expect(deletedTaskElement).toBeNull();
});
