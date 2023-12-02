import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const input = readFile("src/day02/input.txt");

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(":"),
      R.adjust(0, R.pipe(R.split(" "), R.nth(1), Number)),
      R.adjust(
        1,
        R.pipe(
          R.split(/,|;/gi),
          R.map(R.trim),
          R.map(R.split(" ")),
          R.reduce(
            (acc, item) =>
              R.evolve({
                red: R.max(
                  item[1] === "red" ? Number(item[0]) : 0,
                ),
                blue: R.max(
                  item[1] === "blue" ? Number(item[0]) : 0,
                ),
                green: R.max(
                  item[1] === "green" ? Number(item[0]) : 0,
                ),
              })(acc),
            { red: 0, blue: 0, green: 0 },
          ),
        ),
      ),
    ),
  ),
  R.filter(
    R.pipe(
      R.nth(1),
      R.where({
        red: R.gte(12),
        green: R.gte(13),
        blue: R.gte(14),
      }),
    ),
  ),
  R.map(R.nth(0)),
  R.sum,
);

const part2: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(":"),
      R.nth(1) as () => string,
      R.pipe(
        R.split(/,|;/gi),
        R.map(R.trim),
        R.map(R.split(" ")),
        R.reduce(
          (acc, item) =>
            R.evolve({
              red: R.max(
                item[1] === "red" ? Number(item[0]) : 0,
              ),
              blue: R.max(
                item[1] === "blue" ? Number(item[0]) : 0,
              ),
              green: R.max(
                item[1] === "green" ? Number(item[0]) : 0,
              ),
            })(acc),
          { red: 0, blue: 0, green: 0 },
        ),
      ),
      R.juxt(
        R.map(R.prop, ["red", "blue", "green"]),
      ) as () => number[],
      R.product,
    ),
  ),
  R.sum,
);

run({
  // part1: {
  //   tests: [
  //     {
  //       input: testInput,
  //       expected: 8,
  //     },
  //     {
  //       input: input as string,
  //       expected: 0,
  //     },
  //   ],
  //   solution: part1,
  // },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2286,
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
