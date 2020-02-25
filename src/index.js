import React, { useReducer, useEffect } from "react";
import { render } from "react-dom";
import "./index.css";

const ROWS = 12;
const COLUMNS = 6;

const BLOCKS = {
  triangle: {
    type: "triangle",
    character: "t"
  },
  circle: {
    type: "circle",
    character: "c"
  },
  diamond: {
    type: "diamond",
    character: "d"
  },
  star: {
    type: "star",
    character: "s"
  },
  heart: {
    type: "heart",
    character: "s"
  }
};

const range = n =>
  Array(n)
    .fill()
    .map((_, i) => i);

const sample = xs => xs[Math.floor(Math.random() * xs.length)];

const emptyBlock = () => ({ type: "empty" });
const randomBlock = () => sample(Object.values(BLOCKS));

const toIndex = ({ x, y }) => COLUMNS * y + x;

const toXY = index => ({
  x: index % ROWS,
  y: Math.floor(index / ROWS)
});

const tap = x => (console.log(x), x);

const flatten = xss => xss.reduce((acc, xs) => acc.concat(xs), []);

const Grid = ({ cursor, blocksGrid }) => {
  const leftCursor = toIndex(cursor);
  const rightCursor = leftCursor + 1;
  const isSelected = i => leftCursor === i || rightCursor === i;
  return (
    <div className="grid">
      {flatten(blocksGrid).map((block, i) =>
        block.type === "empty" ? (
          <div
            className={["block", isSelected(i) && "selected"]
              .filter(Boolean)
              .join(" ")}
          />
        ) : (
          <div
            className={["block", isSelected(i) && "selected"]
              .filter(Boolean)
              .join(" ")}
            children={block.character}
          />
        )
      )}
    </div>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "MOVEMENT": {
      switch (action.direction) {
        case "ArrowLeft":
          if (state.cursor.x === 0) return state;
          return {
            ...state,
            cursor: { x: state.cursor.x - 1, y: state.cursor.y }
          };
        case "ArrowRight":
          if (state.cursor.x === COLUMNS - 2) return state;
          return {
            ...state,
            cursor: { x: state.cursor.x + 1, y: state.cursor.y }
          };
        case "ArrowUp":
          if (state.cursor.y === 0) return state;
          return {
            ...state,
            cursor: { x: state.cursor.x, y: state.cursor.y - 1 }
          };
        case "ArrowDown":
          if (state.cursor.y === ROWS - 1) return state;
          return {
            ...state,
            cursor: { x: state.cursor.x, y: state.cursor.y + 1 }
          };
        default:
          throw new Error("not impl correct");
      }
    }
  }
  return state;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    nextRow: range(COLUMNS).map(randomBlock),
    grid: range(ROWS).map(j =>
      range(COLUMNS).map(() => (j > ROWS - 2 ? randomBlock() : emptyBlock()))
    ),
    cursor: { x: 0, y: ROWS - 1 }
  });
  useEffect(() => {
    const handleMove = e => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp"
      ) {
        dispatch({ type: "MOVEMENT", direction: e.key });
      }
    };
    document.addEventListener("keydown", handleMove);
  }, []);
  return (
    <div className="app">
      <Grid blocksGrid={state.grid} cursor={state.cursor} />
    </div>
  );
};

render(<App />, document.getElementById("main"));
