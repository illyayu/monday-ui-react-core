import { useCallback, useLayoutEffect, useState, useContext } from "react";
import { useFocusWithin } from "@react-aria/interactions";
import useFullKeyboardListeners, { NAV_DIRECTIONS } from "../useFullKeyboardListeners";
import { GridKeyboardNavigationContext } from "../../components/GridKeyboardNavigation/GridKeyboardNavigationContext";

const NO_ACTIVE_INDEX = -1;

/**
 * @typedef useGridKeyboardNavigationResult
 * @property {function} onBlur - the `onBlur` callback which should be injected to the referenced element
 * @property {function} onFocus - the `onFocus` callback which should be injected to the referenced element
 * @property {number} activeIndex - the currently active index
 * @property {function} onSelectionAction - the callback which should be used when to select an item. Use this callback for onClick handlers, for example.
 */

/**
 * A hook which is used for accessible keyboard navigation. Useful for components rendering a list of items that can be navigated with a keyboard.
 * @param {Object} options
 * @param {React.ElementRef} options.ref - the reference for the component that listens to keyboard
 * @param {number} options.itemsCount - the number of items
 * @param {number} options.numberOfItemsInLine - the number of items on each line of the grid
 * @param {function} options.onItemClicked - the callback for selecting an item. It will be called when an active item is selected, for example with "Enter".
 * @param {function} options.getItemByIndex - a function which gets an index as a param, and returns the item on that index
 * @param {boolean} options.focusOnMount - if true, the referenced element will be focused when mounted
 * @returns {useGridKeyboardNavigationResult}
 */
export default function useGridKeyboardNavigation({
  ref,
  itemsCount,
  numberOfItemsInLine,
  onItemClicked, // the callback to call when an item is selected
  focusOnMount,
  getItemByIndex = () => {}
}) {
  const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_INDEX);

  const getIndexLine = useCallback(index => Math.ceil((index + 1) / numberOfItemsInLine), [numberOfItemsInLine]);

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
        const currentLine = getIndexLine(activeIndex);
        const nextIndexLine = getIndexLine(nextIndex);
        if (currentLine !== nextIndexLine) {
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
      keyboardContext?.onOutboundNavigation(ref, direction);
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
        const firstLineMiddleIndex = Math.floor(numberOfItemsInLine / 2);
        //TODO: this can probably be extracted somehow
        if (direction === NAV_DIRECTIONS.UP) {
          // last line, middle
          let result = firstLineMiddleIndex;
          while (result + numberOfItemsInLine < itemsCount) {
            console.log("increasing from ", result, "by ", numberOfItemsInLine, " to ", result + numberOfItemsInLine);
            result += numberOfItemsInLine;
          }
          return result;
        }
        if (direction === NAV_DIRECTIONS.DOWN) {
          // first line, middle
          return firstLineMiddleIndex;
        }
        if (direction === NAV_DIRECTIONS.LEFT) {
          // middle line, last item
          let result = numberOfItemsInLine - 1;
          const midIndex = Math.floor(itemsCount - 1 / 2);
          while (result < midIndex) {
            result += numberOfItemsInLine;
          }
          return result;
        }
        if (direction === NAV_DIRECTIONS.RIGHT) {
          // middle line, first item
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

  const onSelectionAction = useCallback(
    index => {
      setActiveIndex(index);
      onItemClicked(getItemByIndex(index), index);
    },
    [onItemClicked, getItemByIndex]
  );

  const onKeyboardSelection = useCallback(() => onSelectionAction(activeIndex), [onSelectionAction, activeIndex]);

  useFullKeyboardListeners({
    ref,
    onArrowNavigation,
    onSelectionKey: onKeyboardSelection,
    onEscape: blurTargetElement,
    focusOnMount
  });

  return {
    onBlur: focusWithinProps.onBlur,
    onFocus: focusWithinProps.onFocus,
    activeIndex,
    onSelectionAction
  };
}
