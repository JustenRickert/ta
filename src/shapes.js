const todo = () => {
  const $ = document.createElement("span");
  $.innerHTML = "T";
  return $;
};

const svg = ({ height = 32, width = 32, viewBox = "0 0 32 32" } = {}) => {
  const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  $svg.setAttribute("height", height);
  $svg.setAttribute("width", width);
  $svg.setAttribute("viewBox", viewBox);
  return $svg;
};

const diamond = () => {
  const $svg = svg();
  const $path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  $path.setAttribute("d", "M 0 16 L 16 0 L 32 16 L 16 32");
  $svg.append($path);
  return $svg;
};

const star = () => {
  const $svg = svg({ height: 32, width: 32, viewBox: "0 0 48 45" });
  const $path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  $path.setAttribute(
    "d",
    "m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
  );
  $svg.append($path);
  return $svg;
};

const heart = () => {
  const $svg = svg();
  const $path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  $path.setAttribute(
    "d",
    "M4 0h4v2h4v2h2v4h4V4h2V2h4V0h4v2h2v2h2v16h-4v4h-4v4h-4v4H12v-4H8v-4H4v-4H0V4h2V2h2V0z"
  );

  $svg.append($path);
  return $svg;
};

const triangle = () => {
  const $svg = svg();
  const $polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  $polygon.setAttribute("points", ["0,32", "32,32", "16,0"].join(" "));
  $svg.append($polygon);
  return $svg;
};

const circle = () => {
  const $svg = svg();
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", "16");
  circle.setAttribute("cy", "16");
  circle.setAttribute("r", "16");
  $svg.append(circle);
  return $svg;
};

export const createBlockShapeEl = type => {
  switch (type) {
    case "diamond":
      return diamond();
    case "star":
      return star();
    case "heart":
      return heart();
    case "circle":
      return circle();
    case "triangle":
      return triangle();
    default:
      return type;
  }
};
