import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as projectConst from "../constants";
import { Giffer } from "../modules/giffer";

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

// File Locations
const buildDir = `${process.env.PWD}/build`;
const imgDir = `${buildDir}/images`;

const canvas = createCanvas(
  projectConst.format.width,
  projectConst.format.height
);

const ctx = canvas.getContext("2d");
let giffer = null;

const loadImg = async (_img) => {
  return new Promise(async (resolve) => {
    const loadedImage = await loadImage(`${_img}`);
    resolve({ loadedImage: loadedImage });
  });
};

// read image paths
const imageList = [];
const rawdata = fs.readdirSync(imgDir).forEach((file) => {
  imageList.push(loadImg(`${imgDir}/${file}`));
});

const saveProjectPreviewGIF = async (_data) => {
  // Extract from preview config
  const { numberOfImages, order, repeat, quality, delay, imageName } =
    projectConst.preview_gif;
  // Extract from format config
  const { width, height } = projectConst.format;
  // Prepare canvas
  const previewCanvasWidth = width;
  const previewCanvasHeight = height;

  if (_data.length < numberOfImages) {
    console.log(
      `You do not have enough images to create a gif with ${numberOfImages} images.`
    );
  } else {
    // Shout from the mountain tops
    console.log(
      `Preparing a ${previewCanvasWidth}x${previewCanvasHeight} project preview with ${_data.length} images.`
    );
    const previewPath = `${buildDir}/${imageName}`;

    ctx.clearRect(0, 0, width, height);

    giffer = new Giffer(canvas, ctx, `${previewPath}`, repeat, quality, delay);
    giffer.start();

    await Promise.all(_data).then((renderObjectArray) => {
      // Determin the order of the Images before creating the gif
      if (order == "ASC") {
        // Do nothing
      } else if (order == "DESC") {
        renderObjectArray.reverse();
      } else if (order == "MIXED") {
        renderObjectArray = renderObjectArray.sort(() => Math.random() - 0.5);
      }

      // Reduce the size of the array of Images to the desired amount
      if (numberOfImages > 0) {
        (renderObjectArray as any) = renderObjectArray.slice(0, numberOfImages);
      }

      renderObjectArray.forEach((renderObject, index) => {
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(
          renderObject.loadedImage,
          0,
          0,
          previewCanvasWidth,
          previewCanvasHeight
        );
        giffer.add();
      });
    });
    giffer.stop();
  }
};

saveProjectPreviewGIF(imageList);
