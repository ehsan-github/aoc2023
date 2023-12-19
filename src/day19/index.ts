import run from "aocrunner";
import * as R from "ramda";
import {
  readFile,
  p,
  pn,
  trace,
  SolutionT,
} from "../utils/index.js";

const input = readFile("src/day19/input.txt")!;

const testInput = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

const parseObj = R.pipe(
  R.tail,
  R.init,
  R.split(","),
  R.map(R.split(":")),
  R.reduce(
    (acc, [key, value]) => R.assoc(key, value, acc),
    {},
  ),
);

const splitByName = (x: string) => {
  const l = [...x.matchAll(/(\w+){(.*)}/g)][0];
  return [l[1], l[2]];
};

const getWorkflow = (x: string) => {
  const wf = R.pipe(
    R.split(","),
    R.map(
      R.pipe(
        R.split(":"),
        R.ifElse(
          (x) => x.length === 1,
          (x) => [R.T, R.always(x[0])],
          ([cond, val]) => {
            if (cond.includes(">")) {
              const [prop, value] = cond.split(">");
              return [
                R.propSatisfies(R.lt(Number(value)), prop),
                R.always(val),
              ];
            }
            const [prop, value] = cond.split("<");
            return [
              R.propSatisfies(R.gt(Number(value)), prop),
              R.always(val),
            ];
          },
        ),
      ),
    ),
    (z) => R.cond(z),
  )(x);
  return wf;
};

const part1: SolutionT = R.pipe(
  p,
  R.splitWhenever(R.isEmpty),
  R.juxt([
    R.pipe(
      R.head,
      R.map(R.pipe(splitByName, R.adjust(1, getWorkflow))),
      R.fromPairs,
    ),
    R.pipe(
      R.last,
      R.map(R.pipe(R.replace(/\=/g, ":"), parseObj)),
    ),
  ]),
  ([rules, objects]) =>
    R.map((obj) =>
      R.until(
        (x) => x.finished,
        ({
          fnName,
          value,
        }: {
          fnName: string;
          value: any;
        }) => {
          const newValue = rules[fnName](value);
          if (newValue === "A")
            return {
              finished: true,
              value: R.pipe(R.values, R.sum)(value),
            };
          if (newValue === "R")
            return { finished: true, value: 0 };
          return { fnName: newValue, value };
        },
      )({ fnName: "in", value: obj }),
    )(objects),
  R.map(R.prop("value")),
  R.sum,
);

type Ranges = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
  v: string | "A" | "R";
};

const computeNextStep =
  (map: Record<string, string>) => (ranges: Ranges[]) =>
    ranges.reduce((acc, range) => {
      if (range.v === "R") return acc;
      if (range.v === "A") return [...acc, range];
      const fn = map[range.v];
      for (let i = 0; i < fn.length; i++) {
        const char = fn[i];
        if (typeof char === "string") {
          acc.push({ ...range, v: char });
          break;
        }
        const [prop, isLess, num, nextFn] = char;
        const [minProp, maxProp] = range[prop];
        if (isLess) {
          if (minProp < num) {
            if (maxProp < num) {
              acc.push({ ...range, v: nextFn });
            } else {
              acc.push({
                ...range,
                [prop]: [minProp, num - 1],
                v: nextFn,
              });
              range[prop] = [num, maxProp];
            }
          } else {
            continue;
          }
        } else {
          // should be > than num
          if (maxProp < num) {
            continue;
          } else {
            if (minProp > num) {
              acc.push({ ...range, v: nextFn });
            } else {
              acc.push({
                ...range,
                [prop]: [num + 1, maxProp],
                v: nextFn,
              });
              range[prop] = [minProp, num];
            }
          }
        }
      }
      return acc;
    }, []);

const part2: SolutionT = R.pipe(
  p,
  R.splitWhenever(R.isEmpty),
  R.head,
  R.map(
    R.pipe(
      splitByName,
      R.adjust(
        1,
        R.pipe(
          R.split(","),
          R.map(
            R.pipe(R.split(":"), (arr) =>
              arr.length === 1
                ? arr[0]
                : [
                    arr[0].charAt(0),
                    arr[0].charAt(1) === "<",
                    Number(arr[0].slice(2)),
                    arr[1],
                  ],
            ),
          ),
        ),
      ),
    ),
  ),
  R.fromPairs,
  (fnDef) =>
    R.until(
      R.all(
        R.where({
          v: R.includes(R.__, ["A", "R"]),
        }),
      ),
      computeNextStep(fnDef),
      [
        {
          x: [1, 4000],
          m: [1, 4000],
          a: [1, 4000],
          s: [1, 4000],
          v: "in",
        },
      ],
    ),
  R.reject(R.where({ v: R.equals("R") })),
  R.map(
    R.pipe(
      R.dissoc("v"),
      R.values,
      R.map(([min, max]) => max - min + 1),
      R.product,
    ),
  ),
  R.sum,
);

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 19114,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
