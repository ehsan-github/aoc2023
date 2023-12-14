import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const input = readFile("src/day13/input.txt")!;

const isMirrorAt = (n: number, str: string) => {
  const [p1, p2] = R.splitAt(n + 1, str);
  if (p1.length <= p2.length)
    return R.startsWith(R.reverse(p1), p2);

  return R.endsWith(R.reverse(p2), p1);
};

const getVerticalMirror = (xs: string[]) => {
  let possibleVerticals = new Set(
    R.range(0, xs[0].length - 1),
  );
  for (let i = 0; i < xs.length; i++) {
    for (let key of possibleVerticals) {
      if (!isMirrorAt(key, xs[i])) {
        possibleVerticals.delete(key);
      }
    }
  }
  return possibleVerticals;
};
const convertList = (xs: string[]) =>
  R.pipe(
    R.splitAt(1),
    ([[firstPar], rest]) => R.reduce(R.zip, firstPar, rest),
    R.map(R.pipe(R.flatten, R.join(""))),
  )(xs);

const compute = (xs: string[]) => {
  const verticalMirror = getVerticalMirror(xs);
  if (verticalMirror.size > 0)
    return verticalMirror.keys().next().value + 1;
  const horizontalMirror = R.pipe(
    convertList,
    getVerticalMirror,
    (x) => {
      if (x.size > 0)
        return (x.keys().next().value + 1) * 100;
      return 0;
    },
  )(xs);
  return horizontalMirror;
};

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.splitWhenever(R.isEmpty),
  R.map(compute),
  R.sum,
);

const getOneDiffs = (xs: string[]) => {
  const oneDiffs = [];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = i + 1; j < xs.length; j++) {
      let diffs = [];
      for (let k = 0; k < xs[i].length; k++) {
        if (xs[i][k] != xs[j][k]) {
          diffs.push(k);
        }
      }
      if (diffs.length == 1) {
        oneDiffs.push([i, j, diffs[0]]);
      }
    }
  }
  return oneDiffs.filter(([i, j]) => (j - i) % 2 == 1);
};

const updateList = (xs: string[], i: number, j: number) => {
  return xs.map((x, idx) => (idx == i ? xs[j] : x));
};

const getExactVerticalMirror = (
  xs: string,
  i: number,
  j: number,
) => {
  let correct = true;
  const middle = (i + j - 1) / 2;
  for (let it = 0; it <= middle; it++) {
    const revIt = 2 * middle - it + 1;
    if (!xs[revIt]) continue;
    if (xs[revIt] != xs[it]) {
      correct = false;
      break;
    }
  }
  if (correct) return middle + 1;
  return null;
};

const getHorizontalOneDiffs = (xs: string[]) => {
  const oneDiffs = getOneDiffs(xs);
  for (let [i, j] of oneDiffs) {
    const newXs = updateList(xs, i, j);
    const verticalMirror = getExactVerticalMirror(
      newXs,
      i,
      j,
    );
    if (verticalMirror) {
      return verticalMirror;
    }
  }
  return null;
};
const findSmug = (xs: string[]) => {
  const verticalVal = getHorizontalOneDiffs(xs);
  if (verticalVal) return verticalVal * 100;
  const horizontalVal = getHorizontalOneDiffs(
    convertList(xs),
  );
  if (horizontalVal) return horizontalVal;
  return 0;
};

const part2: SolutionT = R.pipe(
  p,
  R.splitWhenever(R.isEmpty),
  R.map(findSmug),
  R.sum,
);

run({
  part1: {
    tests: [],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
