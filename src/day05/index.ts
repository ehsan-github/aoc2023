import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
const startTime = Date.now();

const inputt = readFile("src/day05/input.txt");

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.splitWhenever(R.isEmpty),
  R.splitAt(1),
  R.applySpec({
    seeds: R.pipe(
      R.head,
      R.head,
      R.head,
      R.split(":"),
      R.nth(1),
      R.trim,
      R.split(" "),
      R.map(Number),
    ),
    mappings: R.pipe(
      R.last,
      R.map(
        R.pipe(
          R.tail,
          R.map(R.split(" ")),
          R.map(R.map(Number)),
        ),
      ),
    ),
  }),

  ({ seeds, mappings }) =>
    seeds.map((seed) =>
      R.reduce(
        (lastMapping, mapping) => {
          const activeMapping = mapping.find(
            ([end, start, len]) =>
              lastMapping >= start &&
              lastMapping < start + len,
          );
          if (activeMapping) {
            const newValue =
              lastMapping +
              activeMapping[0] -
              activeMapping[1];

            return newValue;
          }
          return lastMapping;
        },
        seed,
        mappings,
      ),
    ),
  R.apply(Math.min),
);

const part2: SolutionT = R.pipe(
  p,
  R.splitWhenever(R.isEmpty),
  R.splitAt(1),
  (realInput) => {
    const seeds = R.pipe(
      R.head,
      R.head,
      R.head,
      R.split(":"),
      R.nth(1),
      R.trim,
      R.split(" "),
      R.map(Number),
      R.splitEvery(2),
    )(realInput);

    const mappings = R.pipe(
      R.last,
      R.map(
        R.pipe(
          R.tail,
          R.map(R.split(" ")),
          R.map(R.map(Number)),
        ),
      ),
    )(realInput);
    let min = Infinity;

    for (let idx = 0; idx < seeds.length; idx++) {
      const [start, range] = seeds[idx];
      for (let idx1 = start; idx1 < start + range; idx1++) {
        const value = R.reduce(
          (lastMapping, mapping) => {
            const activeMapping = mapping.find(
              ([end, start, len]) =>
                lastMapping >= start &&
                lastMapping < start + len,
            );
            if (activeMapping) {
              return (
                lastMapping +
                activeMapping[0] -
                activeMapping[1]
              );
            }
            return lastMapping;
          },
          idx1,
          mappings,
        );
        min = Math.min(min, value);
      }
    }
    return min;
  },
);

const endTime = Date.now();

console.log(
  "Took",
  (endTime - startTime) / 1000,
  "seconds",
);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 35,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputt,
        expected: 46,
      },
      {
        input: testInput,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
