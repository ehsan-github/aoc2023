import run from "aocrunner";
import * as R from "ramda";
import {
  readFile,
  p,
  pn,
  trace,
  SolutionT,
} from "../utils/index.js";

const input = readFile("src/day20/input.txt")!;

const testInput = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

// const mType = "b" | "c" | "f";

const getNextValue = ({ module, value, from }: any) => {
  if (module.type === "b") {
    return { value };
  }
  if (module.type === "f") {
    if (value === true) {
      return null;
    }
    return { value: !module.state, state: !module.state };
  }
  // modeule.type === "c"
  const state = { ...module.state, [from]: value };
  return {
    state,
    value: R.not(R.all(R.equals(true), R.values(state))),
  };
};
const flow = ({ board, history, onGoingFlows }: any) => {
  const {
    newFlows,
    newBoard,
    newHistory,
    pulsesToRx = [],
  } = onGoingFlows.reduce(
    (acc: any, { from, to, value }: any) => {
      const updatedHistory = R.evolve(
        value ? { high: R.inc } : { low: R.inc },
        acc.newHistory,
      );
      if (!board[to]) {
        // console.log(`to rx -> ${value ? "high" : "low"}`);
        return {
          ...acc,
          newHistory: updatedHistory,
          pulsesToRx: [...(acc.pulsesToRx ?? []), !value],
        };
      }
      const newValue = getNextValue({
        module: board[to],
        value,
        from,
      });
      if (!newValue)
        return {
          ...acc,
          newHistory: updatedHistory,
        };

      const outs = board[to].out;
      return {
        newBoard: {
          ...acc.newBoard,
          [to]: { ...board[to], state: newValue.state },
        },
        newFlows: [
          ...acc.newFlows,
          ...outs.map((out: string) => ({
            from: to,
            to: out,
            value: newValue.value,
          })),
        ],
        newHistory: updatedHistory,
      };
    },
    {
      newBoard: board,
      newHistory: history,
      newFlows: [],
    },
  );

  return {
    board: newBoard,
    history: history,
    onGoingFlows: newFlows,
    lowPulseToRX:
      pulsesToRx.length === 1 &&
      R.equals(true, pulsesToRx[0]),
  };
};
const buttonPressFlow = ({ board, time, history }: any) => {
  const values = R.until(
    R.where({ onGoingFlows: R.isEmpty }),
    flow,
    {
      board,
      history,
      onGoingFlows: [
        { from: "button", to: "broadcaster", value: false },
      ],
    },
  );
  return { ...values, time: time + 1 };
};

const createBoard = R.pipe(
  R.map(
    R.pipe(R.split(" -> "), ([name, out]: string[]) => {
      if (name === "broadcaster")
        return {
          name,
          type: "b",
          out: out.split(",").map(R.trim),
        };
      if (name.startsWith("%"))
        return {
          name: name.slice(1),
          type: "f",
          state: false,
          out: out.split(",").map(R.trim),
        };
      // name.startsWith('&')
      return {
        name: name.slice(1),
        type: "c",
        state: {},
        out: out.split(",").map(R.trim),
      };
    }),
  ),
  // update conj inputs
  (all) =>
    all.map((x) => {
      if (x.type !== "c") return x;
      const ins = all.filter((y) => y.out.includes(x.name));
      return {
        ...x,
        state: ins.reduce(
          (acc, x) => ({
            ...acc,
            [x.name]: false,
          }),
          {},
        ),
      };
    }),
  R.reduce(
    (acc, { name, ...rest }) => ({
      ...acc,
      [name]: rest,
    }),
    {},
  ),
);

const part1: SolutionT = R.pipe(
  p,
  createBoard,
  R.applySpec({
    board: R.identity,
    time: R.always(0),
    history: R.always({ low: 0, high: 0 }),
  }),
  R.until(
    R.where({ time: R.equals(1000) }),
    buttonPressFlow,
  ),
  R.juxt([
    R.path(["history", "low"]),
    R.path(["history", "high"]),
  ]),
  R.product,
);

const part2: SolutionT = R.pipe(
  p,
  createBoard,
  R.applySpec({
    board: R.identity,
    time: R.always(0),
    lowPulseToRX: R.F,
    history: R.always({ low: 0, high: 0 }),
  }),
  R.until(
    R.where({ lowPulseToRX: R.equals(true) }),
    buttonPressFlow,
  ),
);

const test2 = `broadcaster -> a
%a -> inv, con
&inv -> b, rx
%b -> con
&con -> output
`;
run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 32000000,
      // },
      // {
      //   input: test2,
      //   expected: 11687500,
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
      //   input: test2,
      //   expected: 0,
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
