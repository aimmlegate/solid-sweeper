import { random } from "lodash";
import { Cell, Field } from "./types";

export function generateField(
  size: [number, number],
  bombCount: number
): Field {
  const [sizeX, sizeY] = size;
  const field: Field = [...Array(sizeX)].map((_) =>
    [...Array(sizeY)].map((_) => ({
      state: "hidden",
      payload: "nothing",
      risk: 0,
    }))
  );

  while (bombCount) {
    const r = random(0, sizeX * sizeY);
    const x = r % sizeX;
    const y = Math.floor(r / sizeY);
    if (field[x][y].payload === "bomb") {
      continue;
    }
    field[x][y] = { ...field[x][y], payload: "bomb" };
    bombCount--;
  }

  populateRiskNumbers(field);

  return field;
}

export function floodFillReveal(field: Field, x: number, y: number) {
  const cell = getSafe(field, x, y);
  if (!cell) {
    return;
  }

  if (cell.state === "revealed") {
    return;
  }

  if (cell.risk > 0) {
    cell.state = "revealed";
    return;
  }
  cell.state = "revealed";

  floodFillReveal(field, x + 1, y);
  floodFillReveal(field, x - 1, y);
  floodFillReveal(field, x, y + 1);
  floodFillReveal(field, x, y - 1);
}

export function revealAllBombs(field: Field) {
  field.forEach((row) => {
    row.forEach((cell) => {
      if (cell.payload === "bomb") {
        cell.state = "revealed";
      }
    });
  });
}

export function isGameWined(field: Field): boolean {
  return field.every((row) =>
    row.every((cell) => {
      if (cell.payload === "nothing") {
        return cell.state === "revealed";
      } else return true;
    })
  );
}

function populateRiskNumbers(field: Field) {
  for (let indexX = 0; indexX < field.length; indexX++) {
    const row = field[indexX];
    for (let indexY = 0; indexY < row.length; indexY++) {
      const cell = row[indexY];
      if (cell.payload === "bomb") {
        continue;
      }
      const neighbors = getNeighbors(field, indexX, indexY);
      cell.risk = neighbors.reduce((sum, n) => {
        if (!n || n.payload !== "bomb") {
          return sum;
        }
        return sum + 1;
      }, 0);
    }
  }
}

function getNeighbors(
  field: Field,
  x: number,
  y: number
): (Cell | undefined)[] {
  return [
    getSafe(field, x + 1, y + 1),
    getSafe(field, x - 1, y - 1),
    getSafe(field, x + 1, y - 1),
    getSafe(field, x - 1, y + 1),
    getSafe(field, x, y - 1),
    getSafe(field, x, y + 1),
    getSafe(field, x - 1, y),
    getSafe(field, x + 1, y),
  ];
}

function getSafe(field: Field, x: number, y: number) {
  if (field[x]) {
    return field[x][y];
  }
}
