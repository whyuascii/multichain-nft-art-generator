const dir = __dirname;
const fs = require("fs");
const width = 1000;
const height = 1000;

const rarity = [
  { key: "", val: "original" },
  { key: "_r", val: "rare" },
  { key: "_sr", val: "super rare" },
  { key: "_l", val: "legendary" },
];

const addRarity = (_str) => {
  let itemRarity;
  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });
  return itemRarity;
};

const clearName = (_str) => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\?)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: clearName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });
};

const layers = [
  {
    id: 1,
    name: "background",
    location: `${dir}/background/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width, height },
  },
  {
    id: 2,
    name: "ball",
    location: `${dir}/ball/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width, height },
  },
  {
    id: 3,
    name: "eye color",
    location: `${dir}/eye color/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width, height },
  },
  {
    id: 4,
    name: "iris",
    location: `${dir}/iris/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width, height },
  },
  {
    id: 5,
    name: "shine",
    location: `${dir}/shine/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width, height },
  },
  {
    id: 6,
    name: "bottom lid",
    location: `${dir}/bottom lid/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width, height },
  },
  {
    id: 7,
    name: "top lid",
    location: `${dir}/top lid/`,
    elements: getElements(`${dir}/background/`),
    position: { x: 0, y: 0 },
    size: { width, height },
  },
];

module.exports = { layers, width, height };
