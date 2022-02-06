import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("should render a button", () => {
    render(<App />);
    const buttonEl = screen.getByText(/Tócame/i);
    expect(buttonEl).toBeInTheDocument();
  });
});
