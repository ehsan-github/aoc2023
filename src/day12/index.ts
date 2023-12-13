import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const input = readFile("src/day12/input.txt")!;

const arrangements = ({
  str,
  nums,
}: {
  str: string;
  nums: number[];
}): number => {
  if (str === "" && nums.length === 0) return 1;
  if (str === "") return 0;

  if (/^(#+\.)/g.test(str) || /^(#+)$/g.test(str)) {
    const [match] = str.match(/^(#+)/g) ?? "";
    if (match && match.length === nums[0])
      return arrangements({
        str: str.replace(match, ""),
        nums: nums.slice(1),
      });
    return 0;
  }
  if (str.startsWith(".")) {
    return arrangements({
      str: str.replace(".", ""),
      nums,
    });
  }

  return (
    arrangements({ str: str.replace("?", "."), nums }) +
    arrangements({ str: str.replace("?", "#"), nums })
  );
};

type SolutionT = (input: string) => number;
const part1: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(" "),
      ([str, nums]) => ({
        str,
        nums: nums.split(",").map(Number),
      }),
      arrangements,
    ),
  ),
  R.sum,
);

const repArrangements = ({ str, nums }) => {
  const p1 = arrangements({ str, nums });
  const p2 = arrangements({ str: "?" + str, nums: nums });
  return p1 * Math.pow(p2, 4);
};

const part2: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(" "),
      ([str, nums]) => ({
        str,
        nums: R.pipe(R.split(","), R.map(Number))(nums),
      }),
      repArrangements,
    ),
  ),
  R.sum,
);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 21,
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
      {
        input: testInput,
        expected: 525152,
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
