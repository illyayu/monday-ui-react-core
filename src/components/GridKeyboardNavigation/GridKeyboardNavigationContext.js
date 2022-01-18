import React, { useRef, useContext, useCallback } from "react";
import useEventListener from "../../hooks/useEventListener";
import { NAV_DIRECTIONS } from "../../hooks/useFullKeyboardListeners";

export const GridKeyboardNavigationContext = React.createContext();

const getDirectionMaps = positions => {
  const directionMaps = {
    [NAV_DIRECTIONS.RIGHT]: new Map(),
    [NAV_DIRECTIONS.LEFT]: new Map(),
    [NAV_DIRECTIONS.UP]: new Map(),
    [NAV_DIRECTIONS.DOWN]: new Map()
  };
  positions.forEach(position => {
    if (position.topElement && position.bottomElement) {
      directionMaps[NAV_DIRECTIONS.UP].set(position.bottomElement, position.topElement);
      directionMaps[NAV_DIRECTIONS.DOWN].set(position.topElement, position.bottomElement);
    }
    if (position.leftElement && position.rightElement) {
      directionMaps[NAV_DIRECTIONS.LEFT].set(position.rightElement, position.leftElement);
      directionMaps[NAV_DIRECTIONS.RIGHT].set(position.leftElement, position.rightElement);
    }
  });
  return directionMaps;
};

const focusElementWithDirection = (elementRef, direction) =>
  elementRef?.current?.dispatchEvent(new CustomEvent("focus", { detail: { keyboardDirection: direction } }));

// TODO: extract and test
const getOutmostElementToFocus = (directionMaps, keyboardDirection) => {
  const oppositeDirection = (() => {
    if (keyboardDirection === NAV_DIRECTIONS.LEFT) return NAV_DIRECTIONS.RIGHT;
    if (keyboardDirection === NAV_DIRECTIONS.RIGHT) return NAV_DIRECTIONS.LEFT;
    if (keyboardDirection === NAV_DIRECTIONS.UP) return NAV_DIRECTIONS.DOWN;
    if (keyboardDirection === NAV_DIRECTIONS.DOWN) return NAV_DIRECTIONS.UP;
  })();
  const directionMap = directionMaps[oppositeDirection];
  const firstEntry = [...directionMap][0]; // start with any element
  if (!firstEntry) {
    // no relations were registered for this direction - fallback to a different direction
    if ([NAV_DIRECTIONS.LEFT, NAV_DIRECTIONS.RIGHT].includes(keyboardDirection)) {
      // there are no registered horizontal relations registered, try vertical relations. Get the top-most element.
      return getOutmostElementToFocus(directionMaps, NAV_DIRECTIONS.BOTTOM);
    }
    // there are no registered vertical relations registered, try horizontal relations. Get the left-most element.
    return getOutmostElementToFocus(directionMaps, NAV_DIRECTIONS.RIGHT);
  }
  let result = firstEntry?.[0];
  while (directionMap.get(result)) {
    // as long as there's an element which is outward of the keyboard direction, take it.
    result = directionMap.get(result);
  }
  return result;
};

export const useGridKeyboardNavigationContext = (positions, wrapperRef) => {
  const directionMaps = useRef(getDirectionMaps(positions));
  const upperContext = useContext(GridKeyboardNavigationContext);

  const onWrapperFocus = useCallback(
    e => {
      const keyboardDirection = e?.detail?.keyboardDirection;
      if (!keyboardDirection) {
        return;
      }

      const elementToFocus = getOutmostElementToFocus(directionMaps.current, keyboardDirection);
      focusElementWithDirection(elementToFocus, keyboardDirection);
    },
    [directionMaps]
  );
  useEventListener({ eventName: "focus", callback: onWrapperFocus, ref: wrapperRef });

  const onOutboundNavigation = useCallback(
    (elementRef, direction) => {
      const maybeNextElement = directionMaps.current[direction].get(elementRef);
      if (maybeNextElement?.current) {
        elementRef.current?.blur();
        focusElementWithDirection(maybeNextElement, direction);
        return;
      }
      // nothing on that direction - try updating the upper context
      upperContext?.onOutboundNavigation(wrapperRef, direction);
    },
    [upperContext, wrapperRef]
  );
  return { onOutboundNavigation };
};
