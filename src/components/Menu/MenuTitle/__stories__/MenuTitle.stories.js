import React from "react";
import MenuTitle from "../MenuTitle";
import Menu from "../../Menu/Menu";
import MenuItem from "../../MenuItem/MenuItem";
import { createComponentTemplate } from "../../../../storybook/functions/create-component-story";

export const menuTitleTemplate = createComponentTemplate(MenuTitle);

export const menuTitleCaptionPositionsTemplate = () => [
  <Menu>
    <MenuTitle caption="Top caption" captionPosition={MenuTitle.positions.top} />
    <MenuItem title="Menu item" />
  </Menu>,
  <Menu>
    <MenuTitle caption="Center caption" captionPosition={MenuTitle.positions.CENTER} />
    <MenuItem title="Menu item" />
  </Menu>
];
