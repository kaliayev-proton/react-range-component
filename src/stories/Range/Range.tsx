import { useEffect, useRef, useState } from "react";
import "./range.css";

const computeMovement = (
  clientX: number,
  buttonRef: any,
  offsetLeft: number,
  buttonSize: number
): number => {
  const eventPosition = clientX - (offsetLeft + buttonSize / 2);
  const buttonPosition = buttonRef.position;

  const diff = Math.abs(buttonPosition - eventPosition);
  const positionInt = parseInt(buttonRef.target.style.left.split("px")[0]);

  let compute: number = 0;
  if (buttonPosition < eventPosition) {
    compute = positionInt + diff;
  }
  if (buttonPosition > eventPosition) {
    compute = positionInt - diff;
  }
  if (buttonPosition === eventPosition) {
    compute = positionInt;
  }
  return compute;
};

const checkMinMaxLength = (
  compute: number,
  width: number,
  buttonRef: any,
  minButton: any,
  maxButton: any,
  maxInputRef: any,
  minInputRef: any
): boolean => {
  if (compute > width) {
    buttonRef.position = width;
    buttonRef.target.style.left = `${width}px`;
    maxButton.current = width;
    maxInputRef.current.value = width;
    return true;
  }
  if (compute < 0) {
    buttonRef.position = 0;
    buttonRef.target.style.left = `${0}px`;
    minButton.current = 0;
    minInputRef.current.value = 0;
    return true;
  }
  return false;
};

interface RangeProps {
  value?: string;
  width?: number;
  buttonSize?: number;
}

enum RangeButton {
  MIN = "min",
  MAX = "max",
}

export const Range = ({
  value: val,
  width = 200,
  buttonSize = 30,
  ...props
}: RangeProps) => {
  const [value, setValue] = useState(val);

  const rangeRef = useRef<any>(null);
  const lengthRef = useRef<any>(null);

  const minInputRef = useRef<any>(null);
  const maxInputRef = useRef<any>(null);

  const active = useRef<boolean>(false);
  const offsetLeft = useRef<number>(0);
  const minButton = useRef<number>(0);
  const maxButton = useRef<number>(1);
  const buttonActive = useRef<RangeButton>();
  const positionObj = useRef<{ position: number; target: any }>({
    position: 0,
    target: null,
  });

  const changeRangeLength = () => {
    lengthRef.current.style.width = `${
      maxButton.current - minButton.current
    }px`;
    lengthRef.current.style.left = `${minButton.current}px`;
  };

  const handleOnMouseMove = (event: any) => {
    if (!active.current) {
      return;
    }

    const buttonRef = positionObj.current;
    const isMinButton = buttonActive.current === RangeButton.MIN;
    const isMaxButton = buttonActive.current === RangeButton.MAX;

    const compute: number = computeMovement(
      event.clientX,
      buttonRef,
      offsetLeft.current,
      buttonSize
    );

    // Min button is not more than max
    if (isMinButton && compute >= maxButton.current) {
      console.log(maxButton.current);
      buttonRef.position = maxButton.current;
      minButton.current = maxButton.current;
      minInputRef.current.value = maxButton.current;
      buttonRef.target.style.left = `${maxButton.current}px`;
      return;
    }
    if (isMaxButton && compute <= minButton.current) {
      buttonRef.position = minButton.current;
      maxButton.current = minButton.current;
      maxInputRef.current.value = minButton.current;
      buttonRef.target.style.left = `${minButton.current}px`;
      return;
    }

    // Return if max or min length reached
    if (
      checkMinMaxLength(
        compute,
        width,
        buttonRef,
        minButton,
        maxButton,
        maxInputRef,
        minInputRef
      )
    ) {
      changeRangeLength();
      return;
    }

    if (isMaxButton) {
      maxButton.current = compute;
      maxInputRef.current.value = compute;
    }
    if (isMinButton) {
      minButton.current = compute;
      minInputRef.current.value = compute;
    }

    changeRangeLength();

    buttonRef.position = compute;
    buttonRef.target.style.left = `${compute}px`;
  };

  useEffect(() => {
    const handleDocumentMouseUp = () => {
      active.current = false;
      positionObj.current.target.style.cursor = "w-resize";
    };

    const { offsetLeft: offset } = rangeRef.current;
    offsetLeft.current = offset;

    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("mousemove", handleOnMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mousemove", handleOnMouseMove);
    };
  }, []);

  const setActiveButton = (event: any, btn: RangeButton) => {
    const { target, clientX } = event;
    active.current = true;

    // In the first render left style is undefined
    target.style.left = positionObj.current.position || 0;

    // Set z-index to 1 from the current target
    if (positionObj.current.target) {
      positionObj.current.target.style.zIndex = "1";
    }
    target.style.zIndex = "2";
    target.style.cursor = "move";

    // Define which button is active
    if (btn === RangeButton.MIN) {
      buttonActive.current = RangeButton.MIN;
    } else {
      buttonActive.current = RangeButton.MAX;
    }

    positionObj.current = {
      target,
      position: clientX - (offsetLeft.current + buttonSize / 2),
    };
  };

  const handleOnMouseDownMinButton = (event: any) =>
    setActiveButton(event, RangeButton.MIN);
  const handleOnMouseDownMaxButton = (event: any) =>
    setActiveButton(event, RangeButton.MAX);

  // Pending for implement
  const handleFocus = () => {};
  const handleOnKeyDown = () => {};
  const handleOnKeyUp = () => {};

  return (
    <div role="slider" className="slider">
      <input type="number" ref={minInputRef} className="slider__input" />
      <div ref={rangeRef} className="slider__range" style={{ width }}>
        <button
          onMouseDown={handleOnMouseDownMinButton}
          className="slider__range__btn"
        />
        <div ref={lengthRef} className="slider__range__length" />
        <button
          onMouseDown={handleOnMouseDownMaxButton}
          className="slider__range__btn"
        />
      </div>
      <input
        type="number"
        ref={maxInputRef}
        className="slider__input slider__input--max"
      />
      <input value={value} type="hidden" {...props} />
    </div>
  );
};
