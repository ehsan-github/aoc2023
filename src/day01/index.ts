import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const inputt = readFile("src/day01/input.txt") as string;

const test1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const test2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const findNumber = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(""),
      R.juxt([
        R.find((x: any) => Number(x) == +x),
        R.findLast((x: any) => Number(x) == +x),
      ]) as any,
      R.apply(R.concat),
      Number,
    ),
  ),
  R.sum,
);

const part2: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.applySpec({
        a: (z) =>
          R.match(
            /[0-9]|zero|one|two|three|four|five|six|seven|eight|nine/g,
            z,
          )[0],
        b: R.pipe(
          R.reverse,
          (z) =>
            R.match(
              /[0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|orez/g,
              z,
            )[0],
          R.reverse,
        ),
      }),
      R.juxt([R.prop("a"), R.prop("b")]),
      R.map((x) => R.propOr(x, x, findNumber)),
      R.join(""),
      Number,
    ),
  ),
  R.sum,
);

run({
  part1: {
    tests: [
      {
        input: test1,
        expected: 142,
      },
      // {
      //   input: inputt,
      //   expected: 0,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: test2,
        expected: 281,
      },
      // {
      //   input: inputt,
      //   expected: 0,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
