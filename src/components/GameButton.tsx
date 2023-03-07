import { Accessor, Component, Match, Switch } from "solid-js";
import { GameState } from "../types";

export const GameButton: Component<{
  clickHandler: () => void;

  gameState: Accessor<GameState>;
}> = ({ clickHandler, gameState }) => {
  return (
    <button onClick={clickHandler} style={{ "font-size": "30px" }}>
      <Switch fallback={"‎"}>
        <Match when={gameState() === "win"}>😎</Match>
        <Match when={gameState() !== "lose"}>😀</Match>
        <Match when={gameState() === "lose"}>😵</Match>
      </Switch>
    </button>
  );
};
