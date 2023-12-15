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
const collectRocks = (r: boolean) =>
  R.pipe(
    splitByChar("#"),
    R.map(
      R.pipe(
        R.sortBy(R.prop(R.__, orderMap)),
        R.when(R.always(r), R.reverse),
      ),
    ),
    R.flatten,
    R.join(""),
  );
const computeRest = R.pipe(
  (xs) =>
    xs.map((x, i) => R.count(R.equals("O"), x) * (i + 1)),
  R.sum,
);
const part1: SolutionT = R.pipe(
  p,
  convertList,
  R.map(collectRocks(false)),
  convertList,
  R.reverse,
  computeRest,
);

const roundMap = {
  north: R.pipe(
    convertList,
    R.map(collectRocks(false)),
    convertList,
  ),
  west: R.map(collectRocks(false)),
  south: R.pipe(
    convertList,
    R.map(collectRocks(true)),
    convertList,
  ),
  east: R.map(collectRocks(true)),
};
const oneRound = R.pipe(
  convertList,
  R.map(collectRocks(false)),
  convertList,
  R.map(collectRocks(false)),
  convertList,
  R.map(collectRocks(true)),
  convertList,
  R.map(collectRocks(true)),
);
const REPEAT = 1_000_000_000;
const part2: SolutionT = R.pipe(
  p,
  R.applySpec({
    t: R.always(0),
    v: R.identity,
    col: R.always([]),
  }),
  R.until(
    R.whereAny({
      t: R.equals(590 + (REPEAT % 59)),
    }),
    (r) =>
      R.evolve({
        t: R.inc,
        v: oneRound,
      })(r),
  ),
  R.prop("v"),
  R.reverse,
  computeRest,
);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 136,
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
      //   expected: 64,
      // },
      {
        input,
        expected: 103445,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
