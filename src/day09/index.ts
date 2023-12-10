import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const input = readFile("src/day09/input.txt");

const produceNext = (x: number[][]) => {
  const last = R.last(x);
  return [
    ...x,
    last.reduce(
      (acc, v, idx) =>
        idx !== 0 ? [...acc, v - last[idx - 1]] : acc,
      [],
    ),
  ];
};

const goUp = (x: number[][]) => {
  const v = R.last(R.head(x));
  return R.pipe(
    R.tail,
    R.adjust(0, (z) => [...z, R.last(z) + v]),
  )(x);
};

const predictNext = R.pipe(
  (z) => [z],
  R.until(R.pipe(R.last, R.all(R.equals(0))), produceNext),
  R.reverse,
  R.until((x) => x.length === 1, goUp),
  R.pipe(R.head, R.last),
);

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.map(R.pipe(R.split(" "), R.map(Number), predictNext)),
  R.sum,
);

const goDown = (x: number[][]) => {
  const v = R.head(R.head(x));
  return R.pipe(
    R.tail,
    R.adjust(0, (z) => [R.head(z) - v, ...z]),
  )(x);
};
const predictPrevious = R.pipe(
  (z) => [z],
  R.until(R.pipe(R.last, R.all(R.equals(0))), produceNext),
  R.reverse,
  R.until((x) => x.length === 1, goDown),
  R.pipe(R.head, R.head),
);

const part2: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(R.split(" "), R.map(Number), predictPrevious),
  ),
  R.sum,
);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 114,
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
      {
        input: testInput,
        expected: 2,
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
