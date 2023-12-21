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

const getNeighbors = (board: string[][], pos: string) => {
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

const part1: SolutionT = R.pipe(
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
  R.until(R.where({ steps: R.equals(64) }), (all) =>
    R.evolve({
      steps: R.inc,
      startingPoints: R.pipe(
        R.reduce((acc, item) => {
          const neighbors = getNeighbors(all.board, item);
          return [...acc, ...neighbors];
        }, []),
        R.uniq,
      ),
    })(all),
  ),
  R.prop("startingPoints"),
  R.length,
);

const part2: SolutionT = R.pipe(p);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 42,
      // },
      // {
      //   input,
      //   expected: 0,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 0,
      // },
      // {
      //   input,
      //   expected: 0,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
