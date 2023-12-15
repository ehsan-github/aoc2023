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

const computeNextStep = ({
  s,
  currentPos,
  visited,
  routes,
  steps,
  sIs,
}: any) => {
  const [dy, dx] = [routes.length, routes[0].length];
  const [sY, sX] = R.isEmpty(currentPos) ? s : currentPos;
  const possibleRoutes: any[] = [];
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

  if (R.isEmpty(sIs)) {
    sIs.push([currPos[0] - sY, currPos[1] - sX]);
  }
  if (!currPos) {
    sIs.push([currentPos[0] - s[0], currentPos[1] - s[1]]);
  }
  return {
    s,
    currentPos: currPos,
    visited: currPos
      ? [...visited, currPos.join(",")]
      : visited,
    routes,
    steps: steps + 1,
    sIs,
  };
};

const findPoligon = R.pipe(
  (routes) => {
    const sY = routes.findIndex((x) => x.includes("S"));
    const sX = routes[sY].indexOf("S");
    return {
      s: [sY, sX],
      currentPos: [],
      visited: [[sY, sX].join(",")],
      routes,
      steps: 0,
      sIs: [],
    };
  },
  R.until(
    (obj) => obj.currentPos == undefined,
    computeNextStep,
  ),
);

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  R.map(R.split("")),
  findPoligon,
  R.prop("steps"),
  R.divide(R.__, 2),
  Math.ceil,
);

const opMap = {
  J: "F",
  F: "J",
  L: "7",
  7: "L",
};

const isInside = (
  routes: string[][],
  visited: string[],
  y: number,
  x: number,
) => {
  let lines = 0;
  let edges = [];
  const row = routes[y];
  for (let i = 0; i < x; i++) {
    const char = row[i];
    if (!visited.includes([y, i].join(","))) continue;
    if (char == "|") {
      lines++;
      continue;
    }
    if (char == ".") continue;
    if (char == "-") continue;
    if (R.isEmpty(edges)) {
      edges.push(char);
    } else {
      if (opMap[char] == R.last(edges)) {
        lines++;
      }
      edges.pop();
    }
  }
  const inside = lines % 2 == 1;
  return inside;
};

const whatIsS = (sIs: number[][]) => {
  const sortedSis = R.sortBy(R.prop(0), sIs)
    .map(R.join(","))
    .join("|");
  return R.pipe(
    R.toPairs,
    R.map((x) => [
      x[0],
      R.sortBy(R.prop(0), x[1]).map(R.join(",")).join("|"),
    ]),
    R.find(([_sym, str]) => str === sortedSis),
    R.head,
  )(map);
};

const part2: SolutionT = R.pipe(
  p,
  R.map(R.split("")),
  findPoligon,
  ({ routes, visited, sIs, s }) => {
    const S = whatIsS(sIs);
    routes[s[0]][s[1]] = S;
    let inDots = 0;
    for (let i = 0; i < routes.length; i++) {
      for (let j = 0; j < routes[i].length; j++) {
        if (visited.includes([i, j].join(","))) continue;
        if (isInside(routes, visited, i, j)) inDots++;
      }
    }
    return inDots;
  },
);

run({
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
