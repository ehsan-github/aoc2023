import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";
const input = readFile("src/day16/input.txt")!;

const testInput = `.|...v....
|.-.v.....
.....|-...
........|.
..........
.........v
..../.vv..
.-.-/..|..
.|....-|.v
..//.|....`;

type PosDir = {
  pos: number[];
  dir: number[];
};
type Beam = {
  board: string[];
  posAndDir: PosDir[];
  eTiles: number;
  prevETiles: number;
  visited: Set<string>;
  exactVisit: Set<string>;
};

const newDirMap = {
  "-,0,1": [[0, 1]],
  "-,0,-1": [[0, -1]],
  "-,1,0": [
    [0, 1],
    [0, -1],
  ],
  "-,-1,0": [
    [0, 1],
    [0, -1],
  ],

  "|,0,1": [
    [1, 0],
    [-1, 0],
  ],
  "|,0,-1": [
    [1, 0],
    [-1, 0],
  ],
  "|,1,0": [[1, 0]],
  "|,-1,0": [[-1, 0]],

  "/,0,1": [[-1, 0]],
  "/,0,-1": [[1, 0]],
  "/,1,0": [[0, -1]],
  "/,-1,0": [[0, 1]],

  "v,0,1": [[1, 0]],
  "v,0,-1": [[-1, 0]],
  "v,1,0": [[0, 1]],
  "v,-1,0": [[0, -1]],
};

const getDirs = ({
  board,
  newPos,
  dir,
}: {
  board: string[];
  newPos: number[];
  dir: number[];
}) => {
  const posChar = board[newPos[0]][newPos[1]];
  if (posChar == ".") return [dir];

  const newDirs = newDirMap[
    `${posChar},${dir[0]},${dir[1]}`
  ] as unknown as any[];
  return newDirs;
};
const beamFlow = ({
  board,
  posAndDir,
  eTiles,
  visited,
  exactVisit,
}: Beam) => {
  const newPosAndDirs: PosDir[] = [];
  posAndDir.forEach(({ pos, dir }) => {
    const newPos = [pos[0] + dir[0], pos[1] + dir[1]];
    if (newPos[0] < 0 || newPos[0] > board.length - 1)
      return;
    if (newPos[1] < 0 || newPos[1] > board[0].length - 1)
      return;

    if (
      !visited.has(
        [newPos.join(","), dir.join(",")].join("-"),
      )
    )
      visited.add(
        [newPos.join(","), dir.join(",")].join("-"),
      );

    if (!exactVisit.has(newPos.join(",")))
      exactVisit.add(newPos.join(","));

    const newDirs = getDirs({ board, newPos, dir });
    newDirs.forEach((newDir) => {
      newPosAndDirs.push({
        pos: newPos,
        dir: newDir,
      });
    });
  });

  return {
    board,
    posAndDir: newPosAndDirs,
    visited,
    exactVisit,
    eTiles: visited.size,
    prevETiles: eTiles,
  };
};

const computeForStart = (start: PosDir) =>
  R.pipe(
    R.applySpec({
      posAndDir: R.always([start]),
      eTiles: 0,
      prevEtiles: -1,
      board: R.identity,
      visited: R.always(new Set()),
      exactVisit: R.always(new Set()),
    }) as () => Beam,
    R.until(
      (r: Beam) => r.prevETiles == r.eTiles,
      beamFlow,
    ),
    ({ exactVisit }) => exactVisit.size,
  );

type SolutionT = (input: string) => any;
const part1: SolutionT = R.pipe(
  p,
  computeForStart({ pos: [0, -1], dir: [0, 1] }),
);

const part2: SolutionT = R.pipe(p, (p) => {
  const posibleStarts: PosDir[] = [];
  R.range(0, p.length - 1).forEach((x) => {
    posibleStarts.push({ pos: [x, -1], dir: [0, 1] });
    posibleStarts.push({
      pos: [x, p[0].length],
      dir: [0, -1],
    });
  });
  R.range(0, p[0].length - 1).forEach((x) => {
    posibleStarts.push({ pos: [-1, x], dir: [1, 0] });
    posibleStarts.push({
      pos: [p.length, x],
      dir: [-1, 0],
    });
  });
  return posibleStarts.reduce(
    (acc, start) =>
      Math.max(computeForStart(start)(p), acc),
    0,
  );
});

run({
  part1: {
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
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 51,
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
