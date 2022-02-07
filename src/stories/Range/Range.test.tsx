import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { Range } from "./Range";
import * as stories from "./Range.stories";

const { Primary, Secondary } = composeStories(stories);

test("renders primary Range with default args", () => {
  render(<Primary />);
  const RangeElement = screen.getByRole("slider");
  expect(RangeElement).not.toBeNull();
});

test("renders primary Range with default args", () => {
  render(<Range />);
  const RangeElement = screen.getByRole("slider");
  expect(RangeElement).not.toBeNull();
});
