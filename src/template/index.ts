import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = ``;

const input = readFile("src/day00/input.txt")!;

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(p);

const part2: SolutionT = R.pipe(p);

run({
  part1: {
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
  onlyTests: true,
});
