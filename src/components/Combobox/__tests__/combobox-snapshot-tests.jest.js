import React from "react";
import renderer from "react-test-renderer";
import Combobox from "../Combobox";

describe("Combobox renders correctly", () => {
  it("with empty props", () => {
    const tree = renderer.create(<Combobox />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with className", () => {
    const tree = renderer.create(<Combobox className="test" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with id", () => {
    const tree = renderer.create(<Combobox id="test" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with placeholder", () => {
    const tree = renderer.create(<Combobox placeholder="placeholder" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with another noResultsMessage", () => {
    const tree = renderer.create(<Combobox noResultsMessage="no test text" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("when disabled", () => {
    const tree = renderer.create(<Combobox disabled />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with size", () => {
    const tree = renderer.create(<Combobox size={Combobox.sizes.LARGE} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with optionLineHeight", () => {
    const tree = renderer.create(<Combobox optionLineHeight={50} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with optionsListHeight", () => {
    const tree = renderer.create(<Combobox optionsListHeight={50} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with autoFocus", () => {
    const tree = renderer.create(<Combobox autoFocus />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("with loading", () => {
    const tree = renderer.create(<Combobox loading />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
