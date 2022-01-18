import React, { forwardRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./SliderBase.scss";
import { useSliderActions, useSliderSelection, useSliderUi } from "../SliderContext";
import { bem, calcDimensions, getNearest, moveToPx } from "../SliderHelpers";
import { useSliderRail } from "../SliderHooks";
import SliderRail from "./SliderRail";
import SliderTrack from "./SliderTrack";
import SliderFilledTrack from "./SliderFilledTrack";
import SliderThumb from "./SliderThumb";
import {
  isArrowDownEvent,
  isArrowLeftEvent,
  isArrowRightEvent,
  isArrowUpEvent,
  isPageDownEvent,
  isPageUpEvent,
  isEndEvent,
  isHomeEvent
} from "../../../utils/dom-event-utils";

const SliderBase = forwardRef(({ className }, ref) => {
  const { color, disabled, dragging, size, shapeTestId } = useSliderUi();
  const { definePageStep, min, max, ranged, step, value } = useSliderSelection();
  const { changeValue, increaseValue, decreaseValue } = useSliderActions();
  const { railCoords, railRef } = useSliderRail({ min, max, step, ref });
  const { dimension, offset, positions, thumbKeys } = calcDimensions({ max, min, ranged, value });

  function handlePointerMove(e) {
    if (dragging === null) {
      return;
    }
    const offsetInPx = Math.round(e.clientX - railCoords.left);
    const newValue = moveToPx({ offsetInPx, min, max, railCoords, step });
    changeValue(newValue);
  }

  const handleRailClick = useCallback(
    e => {
      const offsetInPx = e.clientX - railCoords.left;
      const newValue = moveToPx({ offsetInPx, min, max, railCoords, step });
      const thumbIndex = getNearest({ newValue, ranged, value });
      changeValue(newValue, { thumbIndex, isChangeFocus: true });
    },
    [changeValue, min, max, railCoords, ranged, step, value]
  );

  function handleKeyDown(e) {
    if (isArrowUpEvent(e) || isArrowRightEvent(e)) {
      return increaseValue();
    }
    if (isArrowDownEvent(e) || isArrowLeftEvent(e)) {
      return decreaseValue();
    }
    if (isPageUpEvent(e)) {
      e.preventDefault();
      return increaseValue(definePageStep());
    }
    if (isPageDownEvent(e)) {
      e.preventDefault();
      return decreaseValue(definePageStep());
    }
    if (isHomeEvent(e)) {
      e.preventDefault();
      return changeValue(max);
    }
    if (isEndEvent(e)) {
      e.preventDefault();
      return changeValue(min);
    }
  }

  return (
    <div
      className={bem("base", { [size]: size, [color]: color, disabled }, className)}
      data-testid={shapeTestId("base")}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
    >
      <SliderRail onClick={handleRailClick} ref={railRef}>
        <SliderTrack />
        {railRef.current && (
          <>
            <SliderFilledTrack dimension={dimension} offset={offset} />
            {positions.map((position, index) => {
              return <SliderThumb key={thumbKeys[index]} index={index} position={position} />;
            })}
          </>
        )}
      </SliderRail>
    </div>
  );
});

SliderBase.propTypes = {
  /**
   * Custom `class name` to be added to the component-root-node
   */
  className: PropTypes.string
};

SliderBase.defaultProps = {
  className: ""
};

export default SliderBase;
