import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const input = readFile("src/day11/input.txt")!;

type SolutionT = (input: string) => any;
const bothSolutions: (e: number) => SolutionT = (
  expand = 1,
) =>
  R.pipe(
    p,
    (all) =>
      all.reduce(
        (
          { galexies, missingRows, missingCols },
          str,
          idx,
        ) => {
          for (let i = 0; i < str.length; i++) {
            if (str[i] == "#") {
              galexies.push([idx, i]);
              missingCols.delete(i);
              missingRows.delete(idx);
            }
          }
          return { galexies, missingRows, missingCols };
        },
        {
          galexies: [] as [number, number][],
          missingRows: new Set(R.range(0, all.length)),
          missingCols: new Set(R.range(0, all[0].length)),
        },
      ),
    R.evolve({
      missingRows: (x) => Array.from(x) as number[],
      missingCols: (x) => Array.from(x) as number[],
    }),
    ({ galexies, missingRows, missingCols }) =>
      galexies.reduce((acc, [y, x], i) => {
        for (let n = i + 1; n < galexies.length; n++) {
          const [ny, nx] = galexies[n];
          const [minY, maxY] = [
            Math.min(y, ny),
            Math.max(y, ny),
          ];
          const rows =
            maxY -
            minY +
            missingRows.filter((c) => c > minY && c < maxY)
              .length *
              expand;
          const [minX, maxX] = [
            Math.min(x, nx),
            Math.max(x, nx),
          ];
          const cols =
            maxX -
            minX +
            missingCols.filter((c) => c > minX && c < maxX)
              .length *
              expand;
          acc += rows + cols;
        }
        return acc;
      }, 0),
  );

const part1 = bothSolutions(1);

const part2: SolutionT = bothSolutions(999999);

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 82000210,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
