import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import sha1 from "sha1";
import * as projectConst from "../constants";
import { Giffer } from "../modules/giffer";

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

// File Locations
const buildDir = `${process.env.PWD}/build`;

// eye example v
// const layersDir = `${process.env.PWD}/layers`;
// doggo example v
const layersDir = `${process.env.PWD}/img`;

const canvas = createCanvas(
  projectConst.format.width,
  projectConst.format.height
);

// function that has all the drawing properties to draw on the canvas EX: 2d, webgl, webg12, bitmaprenderer
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = projectConst.format.smoothing;

//Global Vars
let metadataList = [];
let attributesList = [];
let dnaList = new Set();
let giffer = null;
const DNA_DELIMITER = "-";

/**
 * This simply looks at the buildDir and removes it if it exist
 * after cleaning and if not found it creates the buildDir
 */
export const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);
  if (projectConst.gif.export) {
    fs.mkdirSync(`${buildDir}/gifs`);
  }
};

/**
 *
 * @param _str
 * @returns
 */
const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(projectConst.rarityDelimiter).pop()
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

/**
 *
 * @param _str
 * @returns
 */
const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str);
  return Number(withoutOptions.split(":").shift());
};

/**
 * Cleans the name of a file passed in it
 *
 * @param fileName string ex:image attr_sr.png
 * @returns string ex:image attr.png
 */
const cleanName = (fileName) => {
  let nameWithoutExtension = fileName.slice(0, -4);
  return nameWithoutExtension.split(projectConst.rarityDelimiter).shift();
};

/**
 * Get elements/attr for a NFT
 *
 * @param path string
 * @returns object of an nft
 */
export const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        weight: getRarityWeight(i),
      };
    });
};

/**
 *
 * @param layersOrder
 * @returns
 */
const layersSetup = (layersOrder) => {
  return layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    name:
      layerObj.options?.["displayName"] != undefined
        ? layerObj.options?.["displayName"]
        : layerObj.name,
    blend:
      layerObj.options?.["blend"] != undefined
        ? layerObj.options?.["blend"]
        : "source-over",
    opacity:
      layerObj.options?.["opacity"] != undefined
        ? layerObj.options?.["opacity"]
        : 1,
    bypassDNA:
      layerObj.options?.["bypassDNA"] !== undefined
        ? layerObj.options?.["bypassDNA"]
        : false,
  }));
};

/**
 *
 * @param _editionCount
 */
const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

/**
 *
 * @returns
 */
const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, ${projectConst.background.brightness})`;
};

/**
 *
 */
const drawBackground = () => {
  ctx.fillStyle = projectConst.background.static
    ? projectConst.background.default
    : genColor();
  ctx.fillRect(0, 0, projectConst.format.width, projectConst.format.height);
};

/**
 *
 * @param _dna
 * @param _edition
 */
const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata: any = {};

  tempMetadata = {
    name: `${projectConst.namePrefix} #${_edition}`,
    description: projectConst.description,
    image: `${projectConst.baseUri}/${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...projectConst.extraMetadata,
    attributes: attributesList,
    compiler: "WhyUAscii Art Engine",
  };

  if (projectConst.network == projectConst.NETWORK.sol) {
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: projectConst.solMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: projectConst.solMetadata.seller_fee_basis_points,
      image: `image.png`,
      //Added metadata for solana
      external_url: projectConst.solMetadata.external_url,
      edition: _edition,
      ...projectConst.extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: "image.png",
            type: "image/png",
          },
        ],
        category: "image",
        creators: projectConst.solMetadata.creators,
      },
    };
  }

  metadataList.push(tempMetadata);
  attributesList = [];
};

/**
 *
 * @param _element
 */
const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

/**
 *
 * @param _layer
 * @returns
 */
const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });
};

/**
 *
 * @param _renderObject
 * @param _index
 * @param _layersLen
 */
const drawElement = (_renderObject, _index, _layersLen) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  ctx.drawImage(
    _renderObject.loadedImage,
    0,
    0,
    projectConst.format.width,
    projectConst.format.height
  );

  addAttributes(_renderObject);
};

/**
 *
 * @param _dna
 * @param _layers
 * @returns
 */
const constructLayerToDna = (_dna = "", _layers = []) => {
  return _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
    );
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param _dna
 * @returns
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);

  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);

    if (!querystring) {
      return true;
    }

    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);
    console.log("-------- byPassDNA Start ----------");
    console.log(options);
    console.log("-------- byPassDNA End ----------");
    // return options.bypassDNA;
    return options;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param _dna
 * @returns
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
};

/**
 *
 * @param _DnaList
 * @param _dna
 * @returns
 */
const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

/**
 *
 * @param _layers
 * @returns
 */
const createDna = (_layers) => {
  let randNum = [];

  _layers.forEach((layer) => {
    var totalWeight = 0;

    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });

    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);

    for (const layerElement of layer.elements) {
      random -= layerElement.weight;
      if (random < 0) {
        return randNum.push(
          `${layerElement.id}:${layerElement.filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }

    // To make sure above for doesn't break.
    // for (var i = 0; i < layer.elements.length; i++) {
    //   // subtract the current weight from the random weight until we reach a sub zero value.
    //   random -= layer.elements[i].weight;
    //   if (random < 0) {
    //     return randNum.push(
    //       `${layer.elements[i].id}:${layer.elements[i].filename}${
    //         layer.bypassDNA ? "?bypassDNA=true" : ""
    //       }`
    //     );
    //   }
    // }
  });
  return randNum.join(DNA_DELIMITER);
};

/**
 *
 * @param _data
 */
const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

/**
 *
 * @param _editionCount
 */
const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);
  if (projectConst.debugLogs) {
    console.log(
      `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
    );
  }

  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

/**
 *
 * @param array
 * @returns
 */
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const startCreating = async () => {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractedIndexes = [];

  for (
    let i = projectConst.network == projectConst.NETWORK.sol ? 0 : 1;
    i <=
    projectConst.layerConfig[projectConst.layerConfig.length - 1]
      .growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i);
  }

  if (projectConst.shuffleLayerConfig) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }

  if (projectConst.debugLogs) {
    console.log("Editions left to create: ", abstractedIndexes);
  }

  while (layerConfigIndex < projectConst.layerConfig.length) {
    const layers = layersSetup(
      projectConst.layerConfig[layerConfigIndex].layersOrder
    );

    while (
      editionCount <=
      projectConst.layerConfig[layerConfigIndex].growEditionSizeTo
    ) {
      let newDna = createDna(layers);

      if (isDnaUnique(dnaList, newDna)) {
        let results = constructLayerToDna(newDna, layers);
        let loadedElements = [];

        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          if (projectConst.debugLogs) {
            console.log("Clearing canvas");
          }

          ctx.clearRect(
            0,
            0,
            projectConst.format.width,
            projectConst.format.height
          );

          if (projectConst.gif.export) {
            giffer = new Giffer(
              canvas,
              ctx,
              `${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
              projectConst.gif.repeat,
              projectConst.gif.quality,
              projectConst.gif.delay
            );
            giffer.start();
          }

          if (projectConst.background.generate) {
            drawBackground();
          }

          renderObjectArray.forEach((renderObject, index) => {
            drawElement(
              renderObject,
              index,
              projectConst.layerConfig[layerConfigIndex].layersOrder.length
            );

            if (projectConst.gif.export) {
              giffer.add();
            }
          });

          if (projectConst.gif.export) {
            giffer.stop();
          }

          if (projectConst.debugLogs) {
            console.log("Editions left to create: ", abstractedIndexes);
          }

          saveImage(abstractedIndexes[0]);
          addMetadata(newDna, abstractedIndexes[0]);
          saveMetaDataSingleFile(abstractedIndexes[0]);

          console.log(
            `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
              newDna
            )}`
          );
        });

        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractedIndexes.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= projectConst.uniqueDnaTorrance) {
          console.log(
            `You need more layers or elements to grow your edition to ${projectConst.layerConfig[layerConfigIndex].growEditionSizeTo} artworks!`
          );

          process.exit();
        }
      }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};
