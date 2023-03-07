import { Component, createSignal, For } from "solid-js";
import { GameField } from "./GameField";
import { Difficulty } from "../types";
import "../styles.css";

const DIFFICULTY_PRESETS: Record<
  Difficulty,
  { fieldSize: [number, number]; bombsCount: number }
> = {
  beginner: {
    fieldSize: [10, 10],
    bombsCount: 10,
  },
  intermediate: {
    fieldSize: [15, 15],
    bombsCount: 40,
  },
  expert: {
    fieldSize: [25, 25],
    bombsCount: 99,
  },
};

export const App: Component = () => {
  const [difficulty, setDifficulty] = createSignal<Difficulty>("beginner");

  const fieldSize = () => DIFFICULTY_PRESETS[difficulty()].fieldSize;
  const bombsCount = () => DIFFICULTY_PRESETS[difficulty()].bombsCount;

  return (
    <div>
      <div class="difficulty">
        <For
          each={Object.keys(DIFFICULTY_PRESETS)}
          fallback={<div>Loading...</div>}
        >
          {(item) => (
            <button onClick={() => setDifficulty(item as Difficulty)}>
              {item}
            </button>
          )}
        </For>
      </div>
      <GameField fieldSize={fieldSize()} bombsCount={bombsCount()} />
    </div>
  );
};
