import run from "aocrunner";
import * as R from "ramda";
import {
  readFile,
  p,
  pn,
  trace,
  convertList,
  splitByChar,
} from "../utils/index.js";

const testInput = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const input = readFile("src/day14/input.txt")!;

type chars = "." | "#" | "O";
const orderMap: Record<chars, number> = {
  "#": 0,
  O: 1,
  ".": 2,
};

type SolutionT = (input: string) => any;
const collectRocks = R.pipe(
  splitByChar("#"),
  R.map(R.sortBy(R.prop(R.__, orderMap))),
  R.flatten,
  R.join(""),
);
const part1: SolutionT = R.pipe(
  p,
  convertList,
  R.map(collectRocks),
  convertList,
  R.reverse,
  (xs) =>
    xs.map((x, i) => R.count(R.equals("O"), x) * (i + 1)),
  R.sum,
);

const part2: SolutionT = R.pipe(p);

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 136,
      },
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
