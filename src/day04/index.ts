import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const input = readFile("src/day04/input.txt");

type SolutionT = (input: string) => any;
const commonPart = R.map(
  R.pipe(
    R.split(":"),
    R.nth(1),
    R.split("|"),
    R.map(R.pipe(R.split(" "), R.reject(R.isEmpty))),
    R.apply(R.intersection),
    R.length,
  ),
);
const part1: SolutionT = R.pipe(
  p,
  commonPart,
  R.reject(R.equals(0)),
  R.map((x) => Math.pow(2, x - 1)),
  R.sum,
);

const part2: SolutionT = R.pipe(
  p,
  commonPart,
  (items) =>
    items.reduce(
      (acc0: any, n: number, idx: number) =>
        R.evolve(
          R.range(idx + 2, idx + 2 + n).reduce(
            (acc, x) =>
              R.assoc(x, R.add(acc0[idx + 1] + 1), acc),
            { [idx + 1]: 1 },
          ),
        )(acc0),
      items.reduce(
        (acccc, _n, idx) => R.assoc(idx + 1, 0, acccc),
        { [items.length + 1]: items.length },
      ),
    ),
  R.values,
  R.sum,
);

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
