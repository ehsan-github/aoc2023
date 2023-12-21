import run from "aocrunner";
import * as R from "ramda";
import {
  readFile,
  p,
  pn,
  trace,
  SolutionT,
} from "../utils/index.js";

const input = readFile("src/day21/input.txt")!;

const testInput = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const commonSolution = (
  st: number,
  getN: Function,
): SolutionT =>
  R.pipe(
    p,
    R.map(R.split("")),
    R.applySpec({
      board: R.identity,
      steps: R.always(0),
      startingPoints: (p) => {
        const rowIdx = R.findIndex(R.includes("S"), p);
        const colIdx = R.findIndex(
          R.includes("S"),
          p[rowIdx],
        );
        return [`${rowIdx}, ${colIdx}`];
      },
    }),
    R.until(R.where({ steps: R.equals(st) }), (all) =>
      R.evolve({
        steps: R.inc,
        startingPoints: R.pipe(
          R.reduce((acc, item) => {
            const neighbors = getN(all.board, item);
            return [...acc, ...neighbors];
          }, []),
          R.uniq,
        ),
      })(all),
    ),
    R.prop("startingPoints"),
    R.length,
  );

const getNeighbors1 = (board: string[][], pos: string) => {
  const [y, x] = pos.split(",").map(Number);
  const neighbors = [];
  if (y > 0 && board[y - 1][x] !== "#")
    neighbors.push(`${y - 1}, ${x}`);
  if (x > 0 && board[y][x - 1] !== "#")
    neighbors.push(`${y}, ${x - 1}`);
  if (y < board.length - 1 && board[y + 1][x] !== "#")
    neighbors.push(`${y + 1}, ${x}`);
  if (x < board[0].length - 1 && board[y][x + 1] !== "#")
    neighbors.push(`${y}, ${x + 1}`);
  return neighbors;
};
const part1 = commonSolution(6, getNeighbors1);

// part2
const getFromMap = (
  dir: number[],
  board: string[][],
  y: number,
  x: number,
) => {
  const [dy, dx] = dir;
  const [ny, nx] = [y + dy, x + dx];
  const h = board.length;
  const w = board[0].length;
  const boardY = R.cond([
    [R.lte(h), R.modulo(R.__, h)],
    [
      R.gt(0),
      R.pipe(
        R.modulo(R.__, h),
        R.unless(R.equals(-0), R.add(h)),
        Math.abs,
      ),
    ],
    [R.T, R.identity],
  ])(ny);

  const boardX = R.cond([
    [R.lte(w), R.modulo(R.__, w)],
    [
      R.gt(0),
      R.pipe(
        R.modulo(R.__, w),
        R.unless(R.equals(-0), R.add(w)),
        Math.abs,
      ),
    ],
    [R.T, R.identity],
  ])(nx);
  const value = board[boardY][boardX];
  if (value !== "#") return [ny, nx].join(",");
  return null;
};

const getNeighbors2 = (board: string[][], pos: string) => {
  const [y, x] = pos.split(",").map(Number);
  const up = getFromMap([-1, 0], board, y, x);
  const down = getFromMap([1, 0], board, y, x);
  const left = getFromMap([0, -1], board, y, x);
  const right = getFromMap([0, 1], board, y, x);
  return [up, down, left, right].filter(R.identity);
};

const part2 = commonSolution(10, getNeighbors2);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 16,
      // },
      // {
      //   input,
      //   expected: 3649,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 0,
      },
      // {
      //   input,
      //   expected: 0,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
