import run from "aocrunner";
import * as R from "ramda";
import {
  readFile,
  p,
  pn,
  trace,
  SolutionT,
} from "../utils/index.js";

const input = readFile("src/day18/input.txt")!;

const testInput = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

type Pos = [number, number];

type DigMore = {
  currPos: Pos;
  visited: string[];
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  map: Record<string, string>;
  last: string;
};

const oposite = {
  R: "L",
  L: "R",
  U: "D",
  D: "U",
};
const updateLast = ({
  map,
  last,
  dir,
}: {
  map: Record<string, string>;
  last: string;
  dir: string;
}): void => {
  const lastChar = map[last];
  if (dir === "R") map[last] = lastChar === "U" ? "F" : "L";
  if (dir === "L") map[last] = lastChar === "U" ? "7" : "J";
  if (dir === "U") map[last] = lastChar === "R" ? "J" : "L";
  if (dir === "D") map[last] = lastChar === "R" ? "7" : "F";
};
const digMore = (
  {
    currPos,
    visited,
    maxX,
    maxY,
    minX,
    minY,
    map,
    last,
  }: DigMore,
  [dir, steps]: [string, number],
) => {
  if (last !== "0,0") {
    updateLast({ map, last, dir });
  }
  if (last === "0,0") {
    map["0,0"] = "R";
  }
  for (let i = 1; i <= steps; i++) {
    if (dir == "R") currPos = [currPos[0], currPos[1] + 1];
    if (dir == "L") currPos = [currPos[0], currPos[1] - 1];
    if (dir == "U") currPos = [currPos[0] - 1, currPos[1]];
    if (dir == "D") currPos = [currPos[0] + 1, currPos[1]];
    // if (!visited.includes(currPos.join(","))) {
    visited.push(currPos.join(","));
    if (visited.includes(currPos.join(","))) {
      console.log("visited", currPos.join(","));
    }
    if (map[currPos.join(",")] === undefined) {
      if (i !== steps) {
        map[currPos.join(",")] =
          dir === "R" || dir === "L" ? "-" : "|";
      } else {
        map[currPos.join(",")] = dir;
      }
    }
    if (i === steps) {
      last = currPos.join(",");
    }
    if (i === steps && currPos.join(",") === "0,0") {
      const newDir = oposite[map[last]];
      map[last] = dir;
      updateLast({ map, last: "0,0", dir: newDir });
    }
  }
  minX = R.min(minX, currPos[1]);
  maxX = R.max(maxX, currPos[1]);
  minY = R.min(minY, currPos[0]);
  maxY = R.max(maxY, currPos[0]);
  return {
    currPos,
    visited,
    maxX,
    maxY,
    minX,
    minY,
    map,
    last,
  };
};

const opMap = {
  J: "F",
  F: "J",
  L: "7",
  7: "L",
};
const getRow = ({
  map,
  y,
  minX,
  maxX,
}: {
  map: Record<string, string>;
  y: number;
  minX: number;
  maxX: number;
}) => {
  const row = [];
  for (let x = minX; x <= maxX; x++) {
    row.push(map[[y, x].join(",")] ?? ".");
  }
  return row;
};

const isInside = ({
  row,
  x,
  minX,
}: {
  row: Record<string, string>;
  y: number;
  x: number;
  minX: number;
}) => {
  let lines = 0;
  let edges = [];
  for (let i = 0; i < x - minX; i++) {
    const char = row[i];
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

const commonPart = R.pipe(
  R.reduce(digMore, {
    currPos: [0, 0],
    visited: [],
    maxX: 0,
    maxY: 0,
    minX: 0,
    minY: 0,
    map: { "0,0": "K" },
    last: "0,0",
  }),
  ({ map, visited, minX, minY, maxX, maxY }) => {
    let counter = visited.length;
    const hashMap = [];
    for (let j = minY; j <= maxY; j++) {
      let line = "";
      const row = getRow({ map, y: j, minX, maxX });
      for (let i = minX; i <= maxX; i++) {
        if (visited.includes([j, i].join(","))) {
          line += map[[j, i].join(",")];
        } else {
          if (
            isInside({
              visited,
              row,
              minX,
              x: i,
              y: j,
            })
          ) {
            counter++;
            line += "X";
          } else {
            line += ".";
          }
        }
      }
      hashMap.push(line);
    }
    console.log(hashMap.join("\n"));
    return counter;
  },
);

const part1: SolutionT = R.pipe(
  p,
  R.map(R.pipe(R.split(" "), R.adjust(1, Number))),
  commonPart,
);

const dirPos = ["R", "D", "L", "U"];
const part2: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(" "),
      R.last,
      (x) => x.replace("(#", "").replace(")", ""),
      R.juxt([
        R.pipe(R.last, (x) => dirPos[+x]),
        R.pipe(R.init, (x) => parseInt(x, 16)),
      ]),
    ),
  ),
  commonPart,
);

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 62,
      },
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
        expected: 952408144115,
      },
      // {
      //   input,
      //   expected: 0,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
