import { useEffect, useRef, useState } from "react";
import "./range.css";

const computeMovement = (
  clientX: number,
  buttonRef: any,
  offsetLeft: number,
  buttonSize: number,
  buttonPosition: number
): number => {
  const eventPosition = clientX - (offsetLeft + buttonSize / 2);

  const diff = Math.abs(buttonPosition - eventPosition);
  const positionInt = parseInt(buttonRef.style.left.split("px")[0]);

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
  bulletRef: any,
  minButton: any,
  maxButton: any,
  maxInputRef: any,
  minInputRef: any
): boolean => {
  if (compute > width) {
    bulletRef.style.left = `${width}px`;
    maxButton.current = width;
    maxInputRef.current.value = width;
    return true;
  }
  if (compute < 0) {
    bulletRef.style.left = `${0}px`;
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

  // Inputs
  const minInputRef = useRef<any>(null);
  const maxInputRef = useRef<any>(null);

  // Bullets
  const minBulletRef = useRef<any>(null);
  const maxBulletRef = useRef<any>(null);

  // Positions
  const minButton = useRef<number>(0);
  const maxButton = useRef<number>(1);

  const active = useRef<boolean>(false);
  const buttonActive = useRef<RangeButton>();
  const offsetLeft = useRef<number>(0);

  const changeRangeLength = () => {
    lengthRef.current.style.width = `${
      maxButton.current - minButton.current
    }px`;
    lengthRef.current.style.left = `${minButton.current}px`;
  };

  const updateBulletPosition = (
    compute: number,
    bulletRef: any,
    buttonType: RangeButton | undefined
  ) => {
    const isMinButton = buttonType === RangeButton.MIN;
    const isMaxButton = buttonType === RangeButton.MAX;

    // Min button is not more than max
    if (isMinButton && compute >= maxButton.current) {
      minButton.current = maxButton.current;
      minInputRef.current.value = maxButton.current;
      bulletRef.style.left = `${maxButton.current}px`;
      return;
    }

    if (isMaxButton && compute <= minButton.current) {
      maxButton.current = minButton.current;
      maxInputRef.current.value = minButton.current;
      bulletRef.style.left = `${minButton.current}px`;
      return;
    }

    // Return if max or min length reached
    if (
      checkMinMaxLength(
        compute,
        width,
        bulletRef,
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

    bulletRef.style.left = `${compute}px`;
  };

  const handleOnMouseMove = (event: any) => {
    if (!active.current) {
      return;
    }

    let bulletCurrent;
    let buttonPosition;
    if (buttonActive.current === RangeButton.MIN) {
      bulletCurrent = minBulletRef.current;
      buttonPosition = minButton.current;
    } else {
      bulletCurrent = maxBulletRef.current;
      buttonPosition = maxButton.current;
    }

    const compute: number = computeMovement(
      event.clientX,
      bulletCurrent,
      offsetLeft.current,
      buttonSize,
      buttonPosition
    );

    updateBulletPosition(compute, bulletCurrent, buttonActive.current);
  };

  useEffect(() => {
    const handleDocumentMouseUp = () => {
      active.current = false;
      if (buttonActive.current === RangeButton.MIN) {
        minBulletRef.current.style.cursor = "w-resize";
      } else {
        maxBulletRef.current.style.cursor = "w-resize";
      }
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

  const setActiveButton = (
    event: any,
    btn: RangeButton,
    bulletPosition: any,
    bulletRefCurrent: any
  ) => {
    const { target, clientX } = event;
    active.current = true;

    // In the first render left style is undefined
    target.style.left = bulletPosition || 0;

    // Set z-index to 1 from the current target
    if (bulletRefCurrent) {
      bulletRefCurrent.style.zIndex = "1";
    }
    target.style.zIndex = "2";
    target.style.cursor = "move";

    // Define which button is active
    buttonActive.current = btn;

    bulletPosition = clientX - (offsetLeft.current + buttonSize / 2);
  };

  const handleMinInputChange = (event: any) => {
    updateBulletPosition(
      parseInt(event.target.value),
      minBulletRef.current,
      RangeButton.MIN
    );
  };
  const handleMaxInputChange = (event: any) => {
    updateBulletPosition(
      parseInt(event.target.value),
      maxBulletRef.current,
      RangeButton.MAX
    );
  };

  const handleOnMouseDownMinButton = (event: any) =>
    setActiveButton(
      event,
      RangeButton.MIN,
      minButton.current,
      minBulletRef.current
    );
  const handleOnMouseDownMaxButton = (event: any) =>
    setActiveButton(
      event,
      RangeButton.MAX,
      maxButton.current,
      maxBulletRef.current
    );

  // Pending for implement
  const handleFocus = () => {};
  const handleOnKeyDown = () => {};
  const handleOnKeyUp = () => {};

  return (
    <div role="slider" className="slider">
      <input
        type="number"
        ref={minInputRef}
        className="slider__input"
        onChange={handleMinInputChange}
      />
      <div ref={rangeRef} className="slider__range" style={{ width }}>
        <button
          ref={minBulletRef}
          onMouseDown={handleOnMouseDownMinButton}
          className="slider__range__btn"
        />
        <div ref={lengthRef} className="slider__range__length" />
        <button
          ref={maxBulletRef}
          onMouseDown={handleOnMouseDownMaxButton}
          className="slider__range__btn"
        />
      </div>
      <input
        type="number"
        ref={maxInputRef}
        className="slider__input slider__input--max"
        onChange={handleMaxInputChange}
      />
      <input value={value} type="hidden" {...props} />
    </div>
  );
};
