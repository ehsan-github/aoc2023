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
const addNew = (
  { label, value }: { label: string; value: number },
  oldValue: { label: string; value: number }[],
) => {
  if (R.any((x) => x.label === label, oldValue)) {
    return oldValue.map((x) =>
      x.label === label ? { label, value } : x,
    );
  }
  return R.append({ label, value }, oldValue);
};

const part2: SolutionT = R.pipe(
  p,
  R.head,
  R.split(","),
  R.reduce((acc, item) => {
    if (item.includes("=")) {
      const [label, v] = item.split("=");
      const hash = computeHash(label);
      let oldValue = acc[hash] ?? [];
      return {
        ...acc,
        [hash]: addNew(
          { label, value: Number(v) },
          oldValue,
        ),
      };
    }
    const label = item.replace("-", "");
    const hash = computeHash(label);
    let oldValue = acc[hash];
    if (oldValue) {
      return {
        ...acc,
        [hash]: oldValue.filter((x) => x.label !== label),
      };
    }

    return acc;
  }, {}),
  R.toPairs,
  R.map(([hash, values]) =>
    values.map(({ value }, idx) =>
      R.product([R.inc(Number(hash)), value, R.inc(idx)]),
    ),
  ),
  R.flatten,
  R.sum,
);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 1320,
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
        expected: 145,
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
