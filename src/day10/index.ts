import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const input = readFile("src/day10/input.txt");
const map = {
  S: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ],
  F: [
    [1, 0],
    [0, 1],
  ],
  J: [
    [-1, 0],
    [0, -1],
  ],
  L: [
    [-1, 0],
    [0, 1],
  ],
  7: [
    [1, 0],
    [0, -1],
  ],
  "|": [
    [1, 0],
    [-1, 0],
  ],
  "-": [
    [0, 1],
    [0, -1],
  ],
};

const test3 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;
const res3 = 8;

const computeNextStep = ({
  s,
  currentPos,
  visited,
  routes,
  steps,
}: any) => {
  const [dy, dx] = [routes.length, routes[0].length];
  const [sY, sX] = R.isEmpty(currentPos) ? s : currentPos;
  const possibleRoutes = [];
  const currPipe = map[routes[sY][sX]];
  const possiblePoints = currPipe
    .map(([y, x]) => [sY + y, sX + x])
    .filter(
      ([x, y]) => x >= 0 && x < dx && y >= 0 && y < dy,
    );

  possiblePoints.forEach(([pY, pX]) => {
    const char = routes[pY][pX];
    const possibleRoute = R.any(
      ([y, x]) => pY + y == sY && pX + x == sX,
      map[char] ?? [],
    );

    if (possibleRoute) possibleRoutes.push([pY, pX]);
  });

  const currPos = possibleRoutes.find(
    (p) => !visited.includes(p.join(",")),
  );
  return {
    s,
    currentPos: currPos,
    visited: currPos
      ? [...visited, currPos.join(",")]
      : visited,
    routes,
    steps: steps + 1,
  };
};

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.map(R.split("")),
  (routes) => {
    const sY = routes.findIndex((x) => x.includes("S"));
    const sX = routes[sY].indexOf("S");
    return {
      s: [sY, sX],
      currentPos: [],
      visited: [[sY, sX].join(",")],
      routes,
      steps: 0,
    };
  },
  R.until(
    (obj) => obj.currentPos == undefined,
    computeNextStep,
  ),
  R.prop("steps"),
  R.divide(R.__, 2),
  Math.ceil,
);

const part2: SolutionT = R.pipe(p);

const test2 = `.....
.S-7.
.|.|.
.L-J.
.....`;
const res2 = 4;

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 8,
      // },
      // {
      //   input: test2,
      //   expected: res2,
      // },
      {
        input: test3,
        expected: res3,
      },
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
