import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const testInput2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const input = readFile("src/day08/input.txt");

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.applySpec({
    steps: R.always(0),
    curr: R.always("AAA"),
    pattern: R.head,
    mappings: R.pipe(
      R.drop(2),
      R.map(
        R.pipe(
          R.split("="),
          R.map(R.trim),
          R.adjust(
            1,
            R.pipe(R.slice(1, -1), R.split(", ")),
          ),
        ),
      ),
      R.reduce(
        (acc, [key, value]) => R.assoc(key, value, acc),
        {},
      ),
    ),
  }),
  R.until(
    R.whereAny({
      curr: R.equals("ZZZ"),
    }),
    (obj) => {
      const currDir = obj.pattern.charAt(
        obj.steps % obj.pattern.length,
      );
      return R.evolve({
        steps: R.inc,
        curr: (c) =>
          R.prop(c, obj.mappings)[Number(currDir == "R")],
      })(obj);
    },
  ),
  R.prop("steps"),
);

const testInputP2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

const part2: SolutionT = R.pipe(
  p,
  R.applySpec({
    curr: R.always("AAA"),
    pattern: R.head,
    mappings: R.pipe(
      R.drop(2),
      R.map(
        R.pipe(
          R.split("="),
          R.map(R.trim),
          R.adjust(
            1,
            R.pipe(R.slice(1, -1), R.split(", ")),
          ),
        ),
      ),
      R.reduce(
        (acc, [key, value]) => R.assoc(key, value, acc),
        {},
      ),
    ),
  }),
  (obj) => ({
    ...obj,
    steps: 0,
    curr: R.pipe(
      R.keys,
      R.filter(R.endsWith("A")),
    )(obj.mappings),
  }),
  R.until(
    R.whereAny({
      curr: R.all(R.endsWith("Z")),
    }),
    (obj) => {
      const currDir = obj.pattern.charAt(
        obj.steps % obj.pattern.length,
      );
      return R.evolve({
        steps: R.inc,
        curr: R.map(
          (c) =>
            R.prop(c, obj.mappings)[Number(currDir == "R")],
        ),
      })(obj);
    },
  ),
  R.prop("steps"),
);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 2,
      // },
      // {
      //   input: testInput2,
      //   expected: 6,
      // },
      // {
      //   input,
      //   expected: 15517,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInputP2,
      //   expected: 6,
      // },
      {
        input,
        expected: 0,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
