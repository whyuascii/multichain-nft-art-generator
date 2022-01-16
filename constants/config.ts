import { NETWORK } from "./index";

// Type of Network sol or eth
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

/**
 * LayerConfig
 *
 * Create your different layers as folders in the `img` dir, and add all the layers assets in these dirs. You can name
 * the assets anything as long as it has a rarity weight, weight by default is 1.
 * ex: background#70.png
 *
 * The `#` can be changed in the variable `rarityDelimiter`
 *
 * Optionally, you can add multiple different objects to your collection. Meaning for X number of images you can remove
 * specify a layer, you don't have add all.
 *
 * Lastly, if you want layers to have different settings or features you can add an `options` field to that layer to do
 * things like, `blend:MODE.colorBurn`, `opacity: 0.7`, or if you want to _ignored_ in the DNA uniqueness check, you
 * can set `bypassDNA: true`. This has the effect of making sure the rest of the traits are unique while not
 * considering the `Background` layer for example. Below is an intense example.
 *
 * ```const layerConfigurations = [
 *   {
 *    growEditionSizeTo: 5,
 *    layersOrder: [
 *      { name: "Background" , {
 *        options: {
 *          bypassDNA: false;
 *        }
 *      }},
 *      { name: "Eyeball" },
 *      {
 *        name: "Eye color",
 *        options: {
 *          blend: MODE.destinationIn,
 *          opacity: 0.2,
 *          displayName: "Awesome Eye Color",
 *        },
 *      },
 *      { name: "Iris" },
 *      { name: "Shine" },
 *      { name: "Bottom lid", options: { blend: MODE.overlay, opacity: 0.7 } },
 *      { name: "Top lid" },
 *    ],
 *  },
 * ];
 *
 * For the type of blend Modes there is a variable called MODE
 *
 *
 *
 */
export const layerConfig = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "backgrounds" },
      { name: "furs" },
      { name: "ears" },
      { name: "hats" },
      { name: "clothes" },
      { name: "mouths" },
      { name: "eyes" },
    ],
  },
];

// If we want to create images serialized or randomized
export const shuffleLayerConfig = true;

// Allow console.log to print
export const debugLogs = true;

// Size of the NFT
export const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

// This is a config to export gifs based on the layers created, you just need to set the export on the `gif` object.
// Setting the `repeat: -1` will produce a one time render and `repeat: 0` will loop forever.
export const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

// This is the pixel ration. The lower to the left the more pixelated the image
export const pixelFormat = {
  ratio: 2 / 128,
};

// If background isn't created this will allow to set a background
export const background = {
  generate: false,
  brightness: "80%",
  static: false,
  default: "#000000",
};

// You can add extra metadata to each metadata file by adding extra items, (key: value) pairs
export const extraMetadata = {};

// This is to help determine the layer img name and rarity value
export const rarityDelimiter = "#";

export const uniqueDnaTorrance = 10000;

// this creates an image of a collection of the images created
export const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

// this creates a gif of a collection of the images created
export const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};
