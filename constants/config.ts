import { NETWORK } from "./index";

export const network = NETWORK.sol;

// General metadata for Eth
export const namePrefix = "Collection";
export const description = "Description of Project";
export const baseUri = "ipfs://URI";

// General metadata for SOL
export const solMetadata = {
  symbol: "YC",
  seller_fee_basis_points: 1000, //how much % you want from secondary market 1000 = 10% ex: number/100
  external_url: "https://websiteurl.com",
  creators: [
    {
      address: "3fjflj4ji5j34tn30", //put devnet address
      share: 100,
    },
  ], //share in creators must equal 100%
};

// Layers Config
// export const layerConfig = [
//   {
//     growEditionSizeTo: 5,
//     layersOrder: [
//       { name: "background", number: 1 },
//       { name: "ball", number: 2 },
//       { name: "eye color", number: 12 },
//       { name: "iris", number: 3 },
//       { name: "shine", number: 1 },
//       { name: "bottom lid", number: 3 },
//       { name: "top lid", number: 3 },
//     ],
//   },
// ];

export const layerConfig = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "backgrounds", number: 1 },
      { name: "furs", number: 2 },
      { name: "ears", number: 12 },
      { name: "hats", number: 3 },
      { name: "clothes", number: 1 },
      { name: "mouths", number: 3 },
      { name: "eyes", number: 3 },
    ],
  },
];

export const shuffleLayerConfig = false;

export const debugLogs = true;

export const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

export const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

export const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

export const pixelFormat = {
  ratio: 2 / 128,
};

export const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

export const extraMetadata = {};

export const rarityDelimiter = "#";

export const uniqueDnaTorrance = 10000;

export const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

export const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};
