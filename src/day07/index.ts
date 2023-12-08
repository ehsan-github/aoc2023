import run from "aocrunner";
import * as R from "ramda";
import { readFile, p, pn, trace } from "../utils/index.js";

const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const input = readFile("src/day07/input.txt");

type SolutionT = (input: string) => any;
const map = {
  A: 14,
  K: 13,
  Q: 12,
  J: 1,
  T: 10,
};
const groupIt = (z) => R.values(R.groupBy(R.identity, z));
const ranking = ["51", "42", "32", "33", "23", "24", "15"];
const computeRank = R.pipe(
  groupIt,
  R.map(R.length),
  R.sort((a, b) => b - a),
  R.converge((a, b) => [a, b].join(""), [R.length, R.head]),
  (x) => R.findIndex(R.equals(x), ranking),
);

const compareTwo = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
};

const realCompare = (
  [a]: [{ rank: number; v: number[] }],
  [b]: [{ rank: number; v: number[] }],
) => {
  if (a.rank > b.rank) return 1;
  if (a.rank < b.rank) return -1;
  return compareTwo(a.v, b.v);
};

const part1: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(" "),
      R.adjust(
        0,
        R.pipe(
          R.split(""),
          R.map((x) => map[x] ?? Number(x)),
          R.applySpec({
            rank: computeRank,
            v: R.identity,
          }),
        ),
      ),
    ),
  ),
  R.sort(realCompare),
  (x) =>
    x.map(
      ([{ v }, n]: any) =>
        Number(n) *
        (R.findLastIndex(
          ([{ v: z }]) => z.join("") == v.join(""),
        )(x) +
          1),
    ),
  R.sum,
);

// part 2
const part2Test = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const map2 = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  J: 1,
};

const reverse = {
  1: "J",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "T",
  12: "Q",
  13: "K",
  14: "A",
};

const handleJ = (x: number[]) => {
  const rest = x.filter((z) => z != 1);
  if (rest.length == 0) return "AAAAA".split("");
  const p = R.pipe(
    groupIt,
    R.sort((a, b) => {
      if (a.length > b.length) return -1;
      if (a.length < b.length) return 1;
      const va = map2[a[0]] || Number(a[0]);
      const vb = map2[b[0]] || Number(b[0]);
      if (va < vb) return 1;
      return -1;
    }),
  )(rest);
  const replacement = p[0][0];
  const v = x.map((x) => (x == 1 ? replacement : x));
  return v;
};

const computeRank2 = R.pipe(
  handleJ,
  groupIt,
  R.map(R.length),
  R.sort((a, b) => b - a),
  R.converge((a, b) => [a, b].join(""), [R.length, R.head]),
  (x) => R.findIndex(R.equals(x), ranking),
);

const part2: SolutionT = R.pipe(
  p,
  R.map(
    R.pipe(
      R.split(" "),
      R.adjust(
        0,
        R.pipe(
          R.split(""),
          R.map((x) => map2[x] || Number(x)),
          R.applySpec({
            rank: computeRank2,
            v: R.identity,
          }),
        ),
      ),
    ),
  ),
  R.sort(realCompare),
  // (xs) =>
  //   xs.map((x, i) => {
  //     if (
  //       x[0].v.map((z) => reverse[z]).join("") !=
  //       sortedHands[i][0]
  //     )
  //       console.log(
  //         x[0].v.map((z) => reverse[z]).join(""),
  //         sortedHands[i][0],
  //       );
  //     return x;
  //   }),
  (x) =>
    x.map(
      ([{ v }, n]: any) =>
        Number(n) *
        (R.findLastIndex(
          ([{ v: z }]) => z.join("") == v.join(""),
        )(x) +
          1),
    ),
  R.sum,
);

const hands = input.split("\n").map((x) => x.split(" "));

const cardRank = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 1,
  Q: 12,
  K: 13,
  A: 14,
};

const handsWithRanks = hands.map((pair) => {
  let cards = {};
  let jokers = 0;
  pair[0].split("").forEach((x) => {
    if (x !== "J") {
      !cards[x] ? (cards[x] = 1) : cards[x]++;
    } else {
      jokers++;
    }
  });
  let cardType = Object.values(cards).sort((a, b) => b - a);
  cardType[0]
    ? (cardType[0] += jokers)
    : (cardType[0] = jokers);
  if (cardType[0] === 5) {
    return [...pair, 6];
  } else if (cardType[0] === 4) {
    return [...pair, 5];
  } else if (cardType[0] === 3 && cardType[1] === 2) {
    return [...pair, 4];
  } else if (cardType[0] === 3 && cardType[1] === 1) {
    return [...pair, 3];
  } else if (cardType[0] === 2 && cardType[1] === 2) {
    return [...pair, 2];
  } else if (cardType[0] === 2 && cardType[1] === 1) {
    return [...pair, 1];
  } else {
    return [...pair, 0];
  }
});

const findTotal = (data) => {
  return data.reduce(
    (acc, card, index) => acc + +card[1] * (index + 1),
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 6440,
      },
      {
        input,
        expected: 150082481,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: part2Test,
        expected: 5905,
      },
      {
        input,
        expected: 248029057,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
