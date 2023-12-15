import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

const input = readFile("src/day15/input.txt")!;

const computeHash = (input: string) => {
  let start = 0;
  for (let i = 0; i < input.length; i++) {
    start += input.charCodeAt(i);
    start *= 17;
    start %= 256;
  }
  return start;
};

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.head,
  R.split(","),
  R.map(computeHash),
  R.sum,
);

const part2: SolutionT = R.pipe(p);

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1320,
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
