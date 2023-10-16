// Task.test.jsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Task from "./Task";

test("renders task name and status", () => {
  const task = { name: "Test Task", status: "To Do" };
  const { getByText } = render(<Task task={task} />);
  expect(getByText("Test Task - To Do")).toBeInTheDocument();
});

test("calls onClick when clicked", () => {
  const onClick = jest.fn();
  const task = { name: "Test Task", status: "To Do" };
  const { getByText } = render(<Task task={task} onClick={onClick} />);
  fireEvent.click(getByText("Test Task - To Do"));
  expect(onClick).toHaveBeenCalled();
});
