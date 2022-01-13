import { useCallback, useLayoutEffect, useState, useContext } from "react";
import { useFocusWithin } from "@react-aria/interactions";
import useFullKeyboardListeners, { NAV_DIRECTIONS } from "./useFullKeyboardListeners";
import { GridKeyboardNavigationContext } from "../components/ColorPicker/GridKeyboardNavigationContext";

const NO_ACTIVE_INDEX = -1;

export default function useGridKeyboardNavigation({
  ref, // the reference for the component that listens to keyboard
  itemsCount,
  numberOfItemsInLine,
  onSelectionKey,
  focusOnMount
}) {
  const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_INDEX);

  const getIndexRow = useCallback(index => Math.ceil((index + 1) / numberOfItemsInLine), [numberOfItemsInLine]);

  const keyboardContext = useContext(GridKeyboardNavigationContext);

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
      keyboardContext?.onOutboundNavigation?.(ref, direction);
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

  const setIndexFromNavigationDirection = useCallback(
    direction => {
      function getRawIndex() {
        const firstRowMiddleIndex = Math.floor(numberOfItemsInLine / 2);
        //TODO: this can probably be extracted somehow
        if (direction === NAV_DIRECTIONS.UP) {
          // last row, middle
          let result = firstRowMiddleIndex;
          while (result + numberOfItemsInLine < itemsCount) {
            console.log("increasing from ", result, "by ", numberOfItemsInLine, " to ", result + numberOfItemsInLine);
            result += numberOfItemsInLine;
          }
          return result;
        }
        if (direction === NAV_DIRECTIONS.DOWN) {
          // first row, middle
          return firstRowMiddleIndex;
        }
        if (direction === NAV_DIRECTIONS.LEFT) {
          // middle row, last item
          let result = numberOfItemsInLine - 1;
          const midIndex = Math.floor(itemsCount - 1 / 2);
          while (result < midIndex) {
            result += numberOfItemsInLine;
          }
          return result;
        }
        if (direction === NAV_DIRECTIONS.RIGHT) {
          // middle row, first item
          let result = 0;
          const midIndex = Math.floor(itemsCount - 1 / 2);
          while (result + itemsCount < midIndex) {
            result += numberOfItemsInLine;
          }
          return result;
        }
      }

      const rawIndex = getRawIndex();
      const index = Math.max(0, Math.min(rawIndex, itemsCount - 1));
      setActiveIndex(index);
    },
    [itemsCount, numberOfItemsInLine]
  );
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: e => {
      const direction = e.detail?.keyboardDirection;
      if (direction) {
        setIndexFromNavigationDirection(direction);
        return;
      }
      if (activeIndex === NO_ACTIVE_INDEX) {
        setActiveIndex(0);
      }
    },
    onBlurWithin: () => {
      setActiveIndex(NO_ACTIVE_INDEX);
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
