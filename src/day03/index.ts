import run from "aocrunner";
import * as R from "ramda";
import { readFile, p } from "../utils/index.js";

const testInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const inputt = readFile("src/day03/input.txt");

const commonPart = R.map(
  R.applySpec({
    nums: (v) =>
      R.pipe(
        R.match(/\d+/g),
        R.reduce((acc, n) => {
          const lastIdx = R.pipe(
            R.last,
            R.unless(R.isNil, R.last),
            R.unless(R.isNil, R.last),
            R.when(R.isNil, R.always(-1)),
          )(acc);
          const start =
            v.slice(lastIdx + 1).indexOf(n) + lastIdx + 1;
          return R.append(
            [n, R.range(start, start + n.length)],
            acc,
          );
        }, []),
      )(v),
    symbols: (v) =>
      R.pipe(R.match(/\*/g), (x) =>
        x.reduce(
          (acc, sym) => [
            ...acc,
            R.findIndex(
              ([z, idx]) =>
                z == sym && idx > (R.last(acc) || -1),
              v.split("").map((c, i) => [c, i]),
            ),
          ],
          [],
        ),
      )(v),
  }),
);
const expandIndexs = (arr) => [
  arr[0] - 1,
  ...arr,
  arr[arr.length - 1] + 1,
];
const part1 = R.pipe(p, commonPart, (arr) =>
  arr.reduce((acc, item, index) => {
    const { nums, symbols } = item;
    const prevSymbols = arr[index - 1]?.symbols || [];
    const nextSymbols = arr[index + 1]?.symbols || [];
    const allSyms = R.uniq([
      ...prevSymbols,
      ...symbols,
      ...nextSymbols,
    ]);
    const lineSum = nums.reduce((acc2, [n, indexes]) => {
      const expandedIndexes = expandIndexs(indexes);
      return acc2 +
        R.difference(expandedIndexes, allSyms).length <
        expandedIndexes.length
        ? Number(n)
        : 0;
    }, 0);
    return acc + lineSum;
  }, 0),
);
const part2 = R.pipe(p, commonPart, (arr) =>
  arr.reduce((acc, item, index) => {
    const { nums, symbols } = item;
    const prevNums = arr[index - 1]?.nums || [];
    const nextNums = arr[index + 1]?.nums || [];
    const allNums = [...nums, ...prevNums, ...nextNums].map(
      R.adjust(1, expandIndexs),
    );
    const lineSum = symbols.reduce((acc, sym) => {
      const adjacentNums = allNums
        .filter(([_n, indexes]) => indexes.includes(sym))
        .map(([n]) => Number(n));
      return acc + adjacentNums.length == 2
        ? R.product(adjacentNums)
        : 0;
    }, 0);
    return acc + lineSum;
  }, 0),
);
run({
  part1: {
    tests: [],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
