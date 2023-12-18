import run from "aocrunner";
import * as R from "ramda";
import {
  readFile,
  p,
  pn,
  trace,
  SolutionT,
} from "../utils/index.js";

const input = readFile("src/day17/input.txt")!;

const testInput = `9413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const opositeDir = {
  U: "D",
  D: "U",
  L: "R",
  R: "L",
};

const getNeighbors = ({
  point,
  dir,
  dirRep: dirRep_,
  p,
}: {
  point: [number, number];
  dir: null | string;
  dirRep: number;
  p: number[][];
}) => {
  const [y, x] = point;
  const dirRep = dirRep_ ?? 0;
  const up = {
    dir: "U",
    dirRep: dir === "U" ? dirRep + 1 : 1,
    point: [y - 1, x],
  };
  const down = {
    dir: "D",
    dirRep: dir === "D" ? dirRep + 1 : 1,
    point: [y + 1, x],
  };
  const left = {
    dir: "L",
    dirRep: dir === "L" ? dirRep + 1 : 1,
    point: [y, x - 1],
  };
  const right = {
    dir: "R",
    dirRep: dir === "R" ? dirRep + 1 : 1,
    point: [y, x + 1],
  };
  return [up, down, left, right].filter(
    ({ point: [yy, xx], dirRep, dir: myDir }) =>
      yy >= 0 &&
      yy < p.length &&
      xx >= 0 &&
      xx < p[0].length &&
      dirRep <= 3 &&
      myDir !== opositeDir[dir],
  );
};

const compute = ({
  p,
  costs,
  parents,
  processed,
}: {
  p: number[][];
  costs: Record<string, number>;
  parents: Record<string, null | number>;
  processed: string[];
}) => {
  let node = findLowestCostNeighbor(costs, processed);

  while (node) {
    let cost = costs[node];
    const { point, dir, dirRep } = R.pipe(
      R.split("-"),
      ([p, d]) => ({
        point: p.split(",").map(Number),
        dir: d[0],
        dirRep: Number(d[1]),
      }),
    )(node);
    const neighbors = getNeighbors({
      point,
      dir,
      dirRep,
      p,
    });
    for (let n in neighbors) {
      const pp = neighbors[n];
      const { point, dir: nDir, dirRep } = pp;
      const key = `${point.join(",")}-${nDir}${dirRep}`;
      let newCost = cost + p[point[0]][point[1]];
      if (!costs[key] || costs[key] > newCost) {
        costs[key] = newCost;
        parents[key] = node;
      }
    }

    processed.push(node);
    node = findLowestCostNeighbor(costs, processed);
  }

  const possibleSol = Object.entries(costs)
    .filter(([key, value]) =>
      key.startsWith(`${p.length - 1},${p[0].length - 1}`),
    )
    .reduce(
      (acc, [key, value]) => {
        if (value < acc[1]) return [key, value];
        return acc;
      },
      ["", Infinity],
    );

  // let optimalPath = [possibleSol[0]];
  // let parent = parents[possibleSol[0]];
  // while (parent) {
  //   optimalPath.push(parent);
  //   parent = parents[parent];
  // }
  // optimalPath.reverse();

  return possibleSol[1];
};

const part1: SolutionT = R.pipe(
  p,
  R.map(R.pipe(R.split(""), R.map(Number))),
  R.applySpec({
    p: R.identity,
    costs: (p) => ({
      "0,1-R1": p[0][1],
      "1,0-D1": p[1][0],
    }),
    processed: R.always(["0,0"]),
    parents: (p) => ({
      [`${p.length - 1},${p[0].length - 1}`]: null,
    }),
    point: R.always([0, 0]),
    dir: R.always(null),
    dirRep: R.always(0),
  }) as any,
  compute,
  // (x) => .costs[`${x.p.length - 1},${x.p[0].length - 1}`],
);

const part2: SolutionT = R.pipe(p);

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 102,
      },
      // {
      //   input: testInput2,
      //   expected: tes2res,
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
  onlyTests: true,
});

/// dijkstra
function findLowestCostNeighbor(costs, processed) {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
}

`
2>>34^>>>1323
32v>>>35v5623
32552456v>>54
3446585845v52
4546657867v>6
14385987984v4
44578769877v6
36378779796v>
465496798688v
456467998645v
12246868655<v
25465488877v5
43226746555v>
`;
