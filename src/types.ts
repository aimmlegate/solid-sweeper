export type CellState = "hidden" | "revealed" | "marked" | "exploded";

export type CellPayload = "nothing" | "bomb";

export type Cell = {
  state: CellState;
  payload: CellPayload;
  risk: number;
};

export type Field = Cell[][];

export type GameState = "idle" | "running" | "lose" | "win";

export type Difficulty = "beginner" | "intermediate" | "expert";
