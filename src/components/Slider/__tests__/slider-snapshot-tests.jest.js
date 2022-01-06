import React from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { snapshotDiff } from "../../../../jest/utils";
import Sound from "../../Icon/Icons/components/Sound";
import Chips from "../../Chips/Chips";
import Slider from "../Slider";
import { renderComponentForSnapshot } from "./slider-tests.utils";

describe("Slider Render", async () => {
  let defaultRender;
  beforeAll(async () => {
    defaultRender = await renderComponentForSnapshot();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("01. with empty props", async () => {
    expect(defaultRender).toMatchSnapshot();
  });

  it("02. with ariaLabel", async () => {
    const props = { ariaLabel: "My Slider" };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it("03. with ariaLabelledby", async () => {
    const props = { ariaLabelledby: "id-of-the-custom-label" };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it("04. with custom className", async () => {
    const props = { className: "slide-me" };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it("05. with id and data-testid", async () => {
    const props = { id: "my-slider", "data-testid": "my-slider" };
    const currentRender = await renderComponentForSnapshot(props, "my-slider__thumb-0");
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it("06. with disabled", async () => {
    const props = { disabled: true };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it("07. with color", async () => {
    const props = { color: Slider.colors.POSITIVE };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`08. with size`, async () => {
    const props = { size: Slider.sizes.LARGE };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`09. with min, max, and step`, async () => {
    const props = { min: 10, max: 20, step: 2 };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`10. with showValue`, async () => {
    const props = { showValue: true };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`11. with valueFormatter`, async () => {
    const props = { valueFormatter: value => `--${value}GB--` };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`12. with value (controlled component)`, async () => {
    const props = { value: 12 };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`13. with value, valueText (controlled component)`, async () => {
    const props = { value: 15, valueText: "15kg" };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`14. with indicateSelection`, async () => {
    const props = { indicateSelection: true };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`15. with prefix (string) and postfix (Icon)`, async () => {
    const props = { prefix: "Vol", postfix: { icon: Sound } };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender)).toMatchSnapshot();
  });

  it(`16. with prefix (custom) and postfix (render-props)`, async () => {
    const props = {
      prefix: <Chips label="Custom component" readOnly />,
      postfix: (value, valueText) => `Render Props result: ${valueText} (${value})`
    };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender)).toMatchSnapshot();
  });

  it(`17. with isRange (ranged slider)`, async () => {
    const props = { isRange: true };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });

  it(`18. ranged slider with options`, async () => {
    const props = { isRange: true, defaultValue: [20, 30], min: 10, max: 50, step: 2 };
    const currentRender = await renderComponentForSnapshot(props);
    expect(snapshotDiff(defaultRender, currentRender, { props })).toMatchSnapshot();
  });
});