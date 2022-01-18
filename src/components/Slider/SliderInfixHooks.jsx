import React from "react";
import { INFIX_KIND } from "./SliderConstants";
import { useSliderInfix, useSliderSelection } from "./SliderContext";
import Icon from "../Icon/Icon";
import SelectionIndicator from "./SelectionIndicator";

const defaultIconProps = {
  clickable: false,
  iconSize: 18,
  ignoreFocusStyle: true
};

export function useSliderInfixComponent(kind) {
  const { prefix, postfix, indicateSelection, selectionIndicatorWidth } = useSliderInfix();
  const { ranged, value, valueText } = useSliderSelection();
  const infix = kind === INFIX_KIND.POSTFIX ? postfix : prefix;

  const isPostfix = kind === INFIX_KIND.POSTFIX;
  if (indicateSelection && (isPostfix || ranged)) {
    return [true, "", <SelectionIndicator kind={kind} />, { width: selectionIndicatorWidth }];
  }
  if (typeof infix === "object" && infix.icon) {
    const { icon, ...restIconProps } = infix;
    const iconProps = { ...defaultIconProps, ...restIconProps };
    return [true, "", <Icon icon={icon} {...iconProps} />, {}];
  }
  if (typeof infix === "function") {
    return [true, "", infix(value, valueText), {}];
  }
  if (typeof infix === "string") {
    return [true, "txt", infix, {}];
  }
  if (typeof infix === "undefined") {
    return [false, "", null, {}];
  }
  return [true, "", infix, {}];
}
