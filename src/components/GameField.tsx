import { Component, createEffect, createSignal, on } from "solid-js";
import { CellView } from "./CellView";
import { GameButton } from "./GameButton";
import "../styles.css";

import {
  floodFillReveal,
  generateField,
  isGameWined,
  revealAllBombs,
} from "../gameplay";
import { Field, GameState } from "../types";

export const GameField: Component<{
  fieldSize: [number, number];
  bombsCount: number;
}> = (props) => {
  const [field, setField] = createSignal<Field | null>();
  const [gameState, setGameState] = createSignal<GameState>("idle");
  const [bombs, setBombs] = createSignal(props.bombsCount);
  const [time, setTime] = createSignal(0);

  createEffect(
    on([() => props.fieldSize, () => props.bombsCount], () => {
      startNewGame();
    })
  );

  let timeoutId: number | undefined;

  const startTimer = () => {
    timeoutId = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timeoutId);
    timeoutId = undefined;
  };

  const resetTimer = () => {
    setTime(0);
  };

  const startNewGame = () => {
    const field = generateField(props.fieldSize, props.bombsCount);
    setBombs(props.bombsCount);
    setGameState("idle");
    setField(field);
    stopTimer();
    resetTimer();
  };

  const winGame = () => {
    setGameState("win");
    stopTimer();
  };

  const looseGame = () => {
    setGameState("lose");
    stopTimer();
  };

  const handleFieldClick = (x: number, y: number) => {
    if (gameState() === "lose" || gameState() === "win") {
      return;
    }
    if (!timeoutId) {
      startTimer();
    }
    setGameState("running");
    setField((f) => {
      if (!f) {
        return;
      }
      const newField = [...f];
      if (newField[x][y].payload === "bomb") {
        revealAllBombs(newField);
        newField[x][y].state = "exploded";
        looseGame();
      } else {
        floodFillReveal(newField, x, y);
        newField[x][y].state = "revealed";
      }
      if (isGameWined(newField)) {
        winGame();
      }
      return newField;
    });
  };

  const handleSetFlag = (x: number, y: number) => {
    if (gameState() === "lose" || gameState() === "win" || bombs() <= 0) {
      return;
    }
    setBombs((b) => b - 1);
    setField((f) => {
      if (!f) {
        return;
      }
      const newField = [...f];
      newField[x][y].state = "marked";
      return newField;
    });
  };

  return (
    <div class="container">
      <div class="controls">
        <span>{bombs()}</span>
        <GameButton clickHandler={startNewGame} gameState={gameState} />
        <span>{time()}</span>
      </div>
      <table>
        {field()?.map((item, x) => (
          <tr>
            {item.map((cell, y) => (
              <td>
                <CellView
                  revealCell={() => handleFieldClick(x, y)}
                  placeFlag={() => handleSetFlag(x, y)}
                  cell={cell}
                />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};
