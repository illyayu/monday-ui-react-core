import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useSliderUi } from "../SliderContext";
import { bem } from "../SliderHelpers";

const SliderRail = forwardRef(({ className, children, onClick }, ref) => {
  const { shapeTestId } = useSliderUi();
  function handleClick(e) {
    if (typeof onClick === "function") {
      onClick(e);
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div data-testid={shapeTestId("rail")} className={bem("rail", "", className)} onClick={handleClick} ref={ref}>
      {children}
    </div>
  );
});

SliderRail.propTypes = {
  /**
   * Consumer/Custom/Extra `class names` to be added to the Component's-Root-Node
   */
  className: PropTypes.string,
  /**
   * onClick callback function
   */
  onClick: PropTypes.func
};

SliderRail.defaultProps = {
  className: "",
  onClick: undefined
};

export default SliderRail;
