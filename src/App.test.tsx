import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("should render a link to exercise 1", () => {
    render(<App />);
    const linkToExercise1 = screen.getByText(/Exercise 1/i);
    expect(linkToExercise1).toBeInTheDocument();
  });
  it("should render a link to exercise 2", () => {
    render(<App />);
    const linkToExercise2 = screen.getByText(/Exercise 2/i);
    expect(linkToExercise2).toBeInTheDocument();
  });
});
