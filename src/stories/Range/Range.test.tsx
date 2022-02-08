import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Range } from "./Range";
import drag from "./testUtils";

describe("Range component", () => {
  test("renders primary Range with default args", () => {
    render(<Range />);

    const RangeElement = screen.getByRole("slider");

    expect(RangeElement).not.toBeNull();
  });

  test("should change cursor to drag when clicks in the bullet", () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    fireEvent.mouseDown(buttons[0]);

    expect(buttons[0]).toHaveStyle("cursor: move;");

    fireEvent.mouseDown(buttons[1]);

    expect(buttons[1]).toHaveStyle("cursor: move;");
  });
  test("should increase bullet size when hover the bullet", () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    userEvent.hover(buttons[0]);

    expect(buttons[0]).toHaveStyle("cursor: default;");
  });
  test("should move bullet to the right", async () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: 200, y: 0 },
    });

    expect(buttons[1]).toHaveStyle("left: 185px;");
  });
  test("should move bullet to the left", async () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: 200, y: 0 },
    });
    await drag(buttons[1], {
      delta: { x: -2, y: 0 },
    });

    expect(buttons[1]).toHaveStyle("left: 0px;");
  });
  test("should NOT pass MIN value", async () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: -1200, y: 0 },
    });

    expect(buttons[1]).toHaveStyle("left: 0px;");
  });
  test("should NOT pass MAX value", async () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: 1200, y: 0 },
    });

    expect(buttons[1]).toHaveStyle("left: 200px;");
  });
  test("should MIN bullet NOT to be more than MAX", async () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: 50, y: 0 },
    });
    await drag(buttons[0], {
      delta: { x: 100, y: 0 },
    });

    expect(buttons[0]).toHaveStyle("left: 35px;");
  });
  test("should MAX bullet NOT to be less than MIN", async () => {
    render(<Range />);
    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: 100, y: 0 },
    });
    await drag(buttons[0], {
      delta: { x: 50, y: 0 },
    });
    await drag(buttons[1], {
      delta: { x: 0, y: 0 },
    });

    expect(buttons[1]).toHaveStyle("left: 35px;");
  });
  test("should set min and max range from the parent component", async () => {
    render(<Range range={[33, 222]} />);

    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: 300, y: 0 },
    });
    await drag(buttons[0], {
      delta: { x: 0, y: 0 },
    });

    expect(buttons[0]).toHaveStyle("left: 0px;");
    expect(buttons[1]).toHaveStyle("left: 200px;");
  });
  test("should update min value from left input", async () => {
    render(<Range range={[33, 222]} />);

    const inputs = screen.getAllByRole("spinbutton");
    const buttons = screen.getAllByRole("button");

    await drag(buttons[1], {
      delta: { x: 300, y: 0 },
    });
    await drag(buttons[0], {
      delta: { x: 0, y: 0 },
    });

    expect(inputs[0]).toHaveValue(33);
    expect(inputs[1]).toHaveValue(222);
  });
  test("should update slider from inputs", () => {
    render(<Range />);

    const inputs = screen.getAllByRole("spinbutton");
    const buttons = screen.getAllByRole("button");

    userEvent.type(inputs[1], "22");

    expect(buttons[1]).toHaveStyle("left: 44px;");

    userEvent.type(inputs[0], "10");

    expect(buttons[0]).toHaveStyle("left: 20px;");
  });
});
