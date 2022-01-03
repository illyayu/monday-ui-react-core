import { useEffect, useRef, useState } from "react";

function ensureSingleValueText(valueText, value, formatter) {
  console.log("ensureValueText", value, valueText);
  if (valueText) {
    return valueText;
  }
  if (typeof value === "undefined") {
    return undefined;
  }
  if (typeof formatter !== "function") {
    return value;
  }
  return formatter(value);
}

function ensureValueText(valueText, value, formatter) {
  console.log("ensureValueText", value, valueText, typeof value);
  if (!Array.isArray(value)) {
    return ensureSingleValueText(valueText, value, formatter);
  }
  return value.map((valueSingle, index) => {
    const valueTextSingle = Array.isArray(valueText) ? valueText[index] : undefined;
    return ensureSingleValueText(valueTextSingle, valueSingle, formatter);
  });
}

export function useControlledOrInternal(value) {
  const [isControlled] = useState(typeof value !== "undefined");
  return isControlled;
}

export function useSliderRail() {
  const railRef = useRef(null);
  const [railCoords, setRailCoords] = useState({ left: 0, right: 100, width: 100 });

  function defineRailCoords() {
    const railRect = railRef.current.getBoundingClientRect();
    const { left, right, width } = railRect;
    setRailCoords({ left, right, width });
  }

  useSliderResize(() => {
    defineRailCoords();
  });

  useEffect(() => {
    defineRailCoords();
  }, []);

  return { railCoords, railRef };
}

// TODO: can be used as global common/shared util-hooks
export function useSliderResize(onResize) {
  function handleResize() {
    if (typeof onResize === "function") {
      onResize();
    }
  }
  useEffect(() => {
    // TODO: enhance by ResizeObserve
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onResize]);
}

export function useSliderValue({ isControlled, value, valueDefault }) {
  const initialValue = isControlled ? value : valueDefault;
  const [internalStateValue, setInternalStateValue] = useState(initialValue);
  if (isControlled) {
    return [value, () => {}];
  }
  return [internalStateValue, setInternalStateValue];
}

export function useSliderValues({ value, valueDefault, valueFormatter, valueText }) {
  const isControlled = useControlledOrInternal(value);
  const [actualValue, setSelectedValue] = useSliderValue({ isControlled, value, valueDefault });
  const actualValueText = ensureValueText(valueText, actualValue, valueFormatter);
  return { actualValue, actualValueText, isControlled, setSelectedValue };
}
