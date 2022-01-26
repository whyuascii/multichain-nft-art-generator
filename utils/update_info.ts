import * as fs from "fs";
import rawData from "../build/json/_metadata.json";
import * as projectConst from "../constants";

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

rawData.forEach((item) => {
  if (projectConst.network == projectConst.NETWORK.sol) {
    item.name = `${projectConst.namePrefix} #${item.edition}`;
    item.description = projectConst.description;
    item.creators = projectConst.solMetadata.creators;
  } else {
    item.name = `${projectConst.namePrefix} #${item.edition}`;
    item.description = projectConst.description;
    item.image = `${process.env.PWD}/${item.edition}.png`;
  }
  fs.writeFileSync(
    `${process.env.PWD}/build/json/${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${process.env.PWD}/build/json/_metadata.json`,
  JSON.stringify(rawData, null, 2)
);

if (projectConst.network == projectConst.NETWORK.sol) {
  console.log(
    `Updated description for images to ===> ${projectConst.description}`
  );
  console.log(
    `Updated name prefix for images to ===> ${projectConst.namePrefix}`
  );
  console.log(
    `Updated creators for images to ===> ${JSON.stringify(
      projectConst.solMetadata.creators
    )}`
  );
} else {
  console.log(`Updated baseUri for images to ===> ${projectConst.baseUri}`);
  console.log(
    `Updated description for images to ===> ${projectConst.description}`
  );
  console.log(
    `Updated name prefix for images to ===> ${projectConst.namePrefix}`
  );
}
