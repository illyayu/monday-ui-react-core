import { useCallback, useLayoutEffect, useState } from "react";
import { useFocusWithin } from "@react-aria/interactions";
import useFullKeyboardListeners, { NAV_DIRECTIONS } from "./useFullKeyboardListeners";

const NO_ACTIVE_INDEX = -1;

export default function useGridKeyboardNavigation({
  ref, // the reference for the component that listens to keyboard
  itemsCount,
  numberOfItemsInLine,
  onSelectionKey,
  focusOnMount,
  onOutboundNavigation
}) {
  const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_INDEX);

  const getIndexRow = useCallback(index => Math.ceil((index + 1) / numberOfItemsInLine), [numberOfItemsInLine]);

  const onArrowNavigation = direction => {
    if (activeIndex === NO_ACTIVE_INDEX) {
      setActiveIndex(0);
      return;
    }

    const calcNextIndex = () => {
      const horizontalChange = isIndexIncrease => {
        const nextIndex = activeIndex + (isIndexIncrease ? 1 : -1);
        if (nextIndex < 0 || itemsCount <= nextIndex) {
          return { isOutbound: true };
        }
        const currentRow = getIndexRow(activeIndex);
        const nextIndexRow = getIndexRow(nextIndex);
        if (currentRow !== nextIndexRow) {
          return { isOutbound: true };
        }

        return { isOutbound: false, nextIndex };
      };

      const verticalChange = isIndexIncrease => {
        const nextIndex = activeIndex + numberOfItemsInLine * (isIndexIncrease ? 1 : -1);
        if (nextIndex < 0 || itemsCount <= nextIndex) {
          return { isOutbound: true };
        }
        return { isOutbound: false, nextIndex };
      };

      switch (direction) {
        case NAV_DIRECTIONS.RIGHT:
          return horizontalChange(true);
        case NAV_DIRECTIONS.LEFT:
          return horizontalChange(false);
        case NAV_DIRECTIONS.DOWN:
          return verticalChange(true);
        case NAV_DIRECTIONS.UP:
          return verticalChange(false);
      }
    };

    const { isOutbound, nextIndex } = calcNextIndex();
    if (isOutbound) {
      onOutboundNavigation?.(direction);
    } else {
      setActiveIndex(nextIndex);
    }
  };

  useLayoutEffect(() => {
    if (activeIndex > -1) {
      requestAnimationFrame(() => {
        ref?.current?.focus();
      });
    }
  }, [activeIndex, ref]);

  const blurTargetElement = useCallback(() => ref.current?.blur(), [ref]);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: isFocused => {
      if (!isFocused) {
        setActiveIndex(NO_ACTIVE_INDEX);
        return;
      }
      if (activeIndex === NO_ACTIVE_INDEX) {
        setActiveIndex(0);
      }
    }
  });

  const _onSelectionKey = useCallback(() => {
    onSelectionKey?.(activeIndex);
  }, [onSelectionKey, activeIndex]);

  useFullKeyboardListeners({
    ref,
    onArrowNavigation,
    onSelectionKey: _onSelectionKey,
    onEscape: blurTargetElement,
    focusOnMount
  });

  return { onBlur: focusWithinProps.onBlur, onFocus: focusWithinProps.onFocus, activeIndex, setActiveIndex };
}
