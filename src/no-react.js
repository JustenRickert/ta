import "./style.css";
import { createBlockShapeEl } from "./shapes.js";

const ROWS = 12;
const COLUMNS = 6;
const BLOCK_SIZE = 32;
const HEIGHT = BLOCK_SIZE * (ROWS + 1 / 2);
const WIDTH = BLOCK_SIZE * COLUMNS;

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const last = xs => xs[xs.length - 1];

const sample = xs => xs[Math.floor(Math.random() * xs.length)];

const range = n =>
  Array(n)
    .fill()
    .map((_, i) => i);

const toStyle = options =>
  Object.entries(options)
    .map(([k, v]) => `${k}:${v};`)
    .join("");

const toTranslate = ({ x, y }, rowsAdded = 0) => {
  const dx = x * BLOCK_SIZE;
  const dy = HEIGHT - (y - rowsAdded + 1) * BLOCK_SIZE;
  return `translate(${dx}px, ${dy}px)`;
};

const naturalblockTypes = ["triangle", "star", "circle", "heart", "diamond"];

const createBlockEl = ({ type, position: { x, y } }) => {
  const $block = document.createElement("div");
  $block.classname = "block";
  $block.style = toStyle({
    position: "absolute",
    transform: toTranslate({ x, y }),
    width: BLOCK_SIZE + "px",
    height: BLOCK_SIZE + "px"
  });
  const $shape = createBlockShapeEl(type);
  $block.append($shape);
  return $block;
};

const tap = x => (console.log(x), x);

const createBlock = ({ type, position }) => ({
  type,
  x: position.x,
  y: position.y,
  $el: type === "empty" ? null : createBlockEl({ type, position })
});

const randomNaturalBlocksRow = () =>
  range(COLUMNS).map(x =>
    createBlock({ type: sample(naturalblockTypes), position: { x, y: -1 } })
  );

const redrawBlock = (block, gametimer) => {
  const rowsAdded = Math.floor(gametimer / BLOCK_SIZE);
  block.$el.style.transform = toTranslate(block, rowsAdded);
};

const redrawGame = state => {
  state.$grid.style.transform = `translateY(${-state.gametimer}px)`;
  state.incomingRow.forEach(block => redrawBlock(block, state.gametimer));
  state.playerGrid.forEach(row =>
    row
      .filter(({ $el }) => $el)
      .forEach(block => redrawBlock(block, state.gametimer))
  );
};

const appendBlockElsAtBottom = (state, blockEls) => {
  assert(blockEls.length === COLUMNS, `blockEls length needs to be ${COLUMNS}`);
  assert(
    last(state.playerGrid).every(
      block => block.$el === null && block.type === "empty"
    ),
    "cannot be in lose condition when appending block els at bottom"
  );
  state.playerGrid.pop();
  state.playerGrid.unshift(blockEls);
  state.playerGrid.forEach(row => row.forEach(block => block.y++));
};

const setNewIncomingRow = state => {
  appendBlockElsAtBottom(state, state.incomingRow);
  const newIncomingRow = randomNaturalBlocksRow();
  state.$grid.append(...newIncomingRow.map(block => block.$el));
  state.incomingRow = newIncomingRow;
};

const runGame = state => {
  setInterval(() => {
    state.gametimer++;
    if (state.gametimer && state.gametimer % BLOCK_SIZE === 0)
      setNewIncomingRow(state);
    redrawGame(state);
  }, 500);
};

const $player = document.createElement("div");
$player.className = "player";
const $grid = document.createElement("div");
$grid.className = "grid";

const playerGrid = range(ROWS).map(y =>
  range(COLUMNS).map(x => createBlock({ type: "empty", position: { x, y } }))
);
const incomingRow = randomNaturalBlocksRow();
let gametimer = 0;

const state = {
  $grid,
  playerGrid,
  incomingRow,
  gametimer
};

range(2).forEach(() => setNewIncomingRow(state));

runGame(state);

const $root = document.getElementById("main");
$root.append($player);
$player.append($grid);
