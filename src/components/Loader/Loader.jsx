import React from "react";
import PropTypes from "prop-types";
import "./Loader.scss";

const Loader = ({ svgClassName }) => {
  return (
    <div className="monday-loader-component">
      <svg
        className={`circle-loader-spinner ${svgClassName}`}
        viewBox="0 0 50 50"
      >
        <circle
          className="circle-loader-spinner-path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
};

Loader.propTypes = {
  svgClassName: PropTypes.string
};

Loader.defaultProps = {
  svgClassName: ""
};

export default Loader;
