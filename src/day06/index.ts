import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `Time:      7  15   30
Distance:  9  40  200`;

const input = readFile("src/day06/input.txt");

type SolutionT = (input: string) => any;

const possibleArrival = ([time, dist]) => {
  let posible = 0;
  for (let i = 1; i < time; i++) {
    const traveled = (time - i) * i;
    if (traveled > dist) posible++;
  }
  return posible;
};
const part1: SolutionT = R.pipe(
  p,
  R.map(R.split(/\s+/)),
  R.map(R.tail),
  R.apply(R.zip),
  R.map(R.map(Number)),
  R.map(possibleArrival),
  R.product,
);

const part2: SolutionT = R.pipe(
  p,
  R.map(R.split(/\s+/)),
  R.map(R.tail),
  R.map(R.join("")),
  possibleArrival,
);

run({
  part1: {
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
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 71503,
      },
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
