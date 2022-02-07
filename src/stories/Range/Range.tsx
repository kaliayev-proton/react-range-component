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

interface RangeProps {
  value?: string;
  width?: number;
  withDecimals?: boolean;
  buttonSize?: number;
  range?: number[];
}

enum RangeButton {
  MIN = "min",
  MAX = "max",
}

export const Range = ({
  value: val,
  range = [0, 100],
  width = 200,
  buttonSize = 30,
  withDecimals = false,
}: RangeProps) => {
  const [rangeValues, setRangeValues] = useState(range);

  useEffect(() => {
    setRangeValues(range);
  }, [range]);

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

  const changeRangeLength = (): void => {
    lengthRef.current.style.width = `${
      maxButton.current - minButton.current
    }px`;
    lengthRef.current.style.left = `${minButton.current}px`;
  };

  const calcValueOp = (compute: number): number => {
    const calc: number =
      (compute * (rangeValues[rangeValues.length - 1] - rangeValues[0])) /
      width;
    if (withDecimals) {
      return calc + rangeValues[0];
    }
    if (rangeValues.length > 2) {
      // Add second exercise logic
      let number: number = calc;
      rangeValues.forEach((value, i: number) => {
        if (calc < value && !rangeValues[i - 1]) {
          number = value;
        }
        if (calc < value && calc > rangeValues[i - 1]) {
          number = value;
        }
      });
      return number;
    }
    return Math.round(calc + rangeValues[0]);
  };

  const reverseCalcValueOp = (value: string): number => {
    const absolute = rangeValues[rangeValues.length - 1] - rangeValues[0];
    const reverseCalc: number =
      ((parseInt(value, 10) - rangeValues[0]) * width) / absolute;
    return Math.round(reverseCalc);
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
      maxInputRef.current.value = rangeValues[rangeValues.length - 1];
      return true;
    }
    if (compute < 0) {
      bulletRef.style.left = `${0}px`;
      minButton.current = 0;
      minInputRef.current.value = rangeValues[0];
      return true;
    }
    return false;
  };

  const updateBulletPosition = (
    compute: number,
    bulletCurrent: any,
    buttonType: RangeButton | undefined
  ): void => {
    const isMinButton: boolean = buttonType === RangeButton.MIN;
    const isMaxButton: boolean = buttonType === RangeButton.MAX;

    // Skip if Min button is more than max or max less than min
    if (isMinButton && compute >= maxButton.current) {
      minButton.current = maxButton.current;
      minInputRef.current.value = calcValueOp(maxButton.current);
      bulletCurrent.style.left = `${maxButton.current}px`;
      changeRangeLength();
      return;
    }
    if (isMaxButton && compute <= minButton.current) {
      maxButton.current = minButton.current;
      maxInputRef.current.value = calcValueOp(minButton.current);
      bulletCurrent.style.left = `${minButton.current}px`;
      changeRangeLength();
      return;
    }

    // Skip if max or min length reached
    if (
      checkMinMaxLength(
        compute,
        width,
        bulletCurrent,
        minButton,
        maxButton,
        maxInputRef,
        minInputRef
      )
    ) {
      changeRangeLength();
      return;
    }

    // Update position and input refs
    if (isMaxButton) {
      maxButton.current = compute;
      maxInputRef.current.value = calcValueOp(compute);
    }
    if (isMinButton) {
      minButton.current = compute;
      minInputRef.current.value = calcValueOp(compute);
    }

    changeRangeLength();

    bulletCurrent.style.left = `${compute}px`;
  };

  const handleOnMouseMove = (event: any): void => {
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
  }, [rangeValues]);

  const setActiveButton = (
    event: any,
    btn: RangeButton,
    bulletPosition: any,
    bulletRefCurrent: any
  ): void => {
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
      reverseCalcValueOp(event.target.value),
      minBulletRef.current,
      RangeButton.MIN
    );
  };
  const handleMaxInputChange = (event: any) => {
    updateBulletPosition(
      reverseCalcValueOp(event.target.value),
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

  return (
    <div role="slider" className="slider">
      <input
        type="number"
        ref={minInputRef}
        className="slider__input"
        onChange={handleMinInputChange}
        disabled={rangeValues.length > 2}
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
        disabled={rangeValues.length > 2}
      />
    </div>
  );
};
