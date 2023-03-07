import { Component, Match, Switch } from "solid-js";
import { Cell } from "../types";

export const CellView: Component<{
  revealCell: () => void;
  placeFlag: () => void;
  cell: Cell;
}> = (props) => {
  return (
    <button
      onClick={() => props.revealCell()}
      onContextMenu={(e) => {
        e.preventDefault();
        props.placeFlag();
      }}
      disabled={props.cell.state === "revealed"}
      style={{
        background: props.cell.state === "exploded" ? "red" : "light",
        padding: "0",
        width: "20px",
        height: "20px",
      }}
    >
      <Switch fallback={"‎"}>
        <Match when={props.cell.state === "hidden"}>{"‎"}</Match>
        <Match when={props.cell.state === "marked"}>⚑</Match>
        <Match when={props.cell.risk !== 0}>{props.cell.risk}</Match>
        <Match when={props.cell.payload === "nothing"}>{"‎"}</Match>
        <Match when={props.cell.payload === "bomb"}>{"✱"}</Match>
      </Switch>
    </button>
  );
};
