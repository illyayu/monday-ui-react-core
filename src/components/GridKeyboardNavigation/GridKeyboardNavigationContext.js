import React, { useRef, useContext, useCallback } from "react";
import { NAV_DIRECTIONS } from "../../hooks/useFullKeyboardListeners";

export const GridKeyboardNavigationContext = React.createContext();

const calcMapping = positions => {
  const directionsMaps = {
    [NAV_DIRECTIONS.RIGHT]: new WeakMap(),
    [NAV_DIRECTIONS.LEFT]: new WeakMap(),
    [NAV_DIRECTIONS.UP]: new WeakMap(),
    [NAV_DIRECTIONS.DOWN]: new WeakMap()
  };
  positions.forEach(position => {
    if (position.topElement && position.bottomElement) {
      directionsMaps[NAV_DIRECTIONS.UP].set(position.bottomElement, position.topElement);
      directionsMaps[NAV_DIRECTIONS.DOWN].set(position.topElement, position.bottomElement);
    }
    if (position.leftElement && position.rightElement) {
      directionsMaps[NAV_DIRECTIONS.LEFT].set(position.rightElement, position.leftElement);
      directionsMaps[NAV_DIRECTIONS.RIGHT].set(position.leftElement, position.rightElement);
    }
  });
  return directionsMaps;
};

//TODO: deal with components that are removed, should be unset
export const useGridKeyboardNavigationContext = (positions, wrapperRef) => {
  const verticalPositioning = useRef(calcMapping(positions));
  const upperContext = useContext(GridKeyboardNavigationContext);

  const onOutboundNavigation = useCallback(
    (elementRef, direction) => {
      const maybeNextElement = verticalPositioning.current[direction].get(elementRef);
      if (maybeNextElement?.current) {
        elementRef.current?.blur();
        maybeNextElement.current.dispatchEvent(new CustomEvent("focus", { detail: { keyboardDirection: direction } }));
        return;
      }
      // nothing on that direction - try updating the upper context
      upperContext?.onOutboundNavigation(wrapperRef, direction);
    },
    [upperContext, wrapperRef]
  );
  return { onOutboundNavigation };
};
