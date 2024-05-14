const fs = require("fs");
const pinataSDK = require("@pinata/sdk");

const pinataJWTKey = process.env.PINATA_JWT_KEY;

// Initialize the Pinata SDK with the JWT key from the environment variable
const pinata = new pinataSDK({ pinataJWTKey });

async function pinFileAndMetadata(jsonFilePath) {
  try {
    const configFile = fs.readFileSync(jsonFilePath);
    const config = JSON.parse(configFile);

    const options = {
      pinataMetadata: {
        name: config.original_filename,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const filePath = `./${config.original_filename}`;
    const imageStream = fs.createReadStream(filePath);
    const imageResponse = await pinata.pinFileToIPFS(imageStream, options);

    config.image = `ipfs://${imageResponse.IpfsHash}`;

    const metadataBuffer = Buffer.from(JSON.stringify(config), "utf-8");
    const metadataResponse = await pinata.pinJSONToIPFS(
      JSON.parse(metadataBuffer.toString())
    );

    await saveMetadataURI(config.image, `ipfs://${metadataResponse.IpfsHash}`);

    return { imageResponse, metadataResponse }; // Return responses for testing
  } catch (error) {
    console.error("Error pinning file:", error);
    throw error; // Ensure errors are thrown for test capture
  }
}

async function saveMetadataURI(nftUri, metadataUri) {
  console.log("Writing out metadata file");
  const uriFile = "nft_uris.json";
  let data = [];
  const datetime = new Date().toISOString();

  if (fs.existsSync(uriFile)) {
    const fileContent = fs.readFileSync(uriFile, { encoding: "utf-8" });
    data = JSON.parse(fileContent);
  }

  data.push({
    nft_uri: nftUri,
    metadata_uri: metadataUri,
    uploaded_datetime: datetime,
  });

  fs.writeFileSync(uriFile, JSON.stringify(data, null, 2), {
    encoding: "utf-8",
  });
}

async function removeFileAndMetadata(imageIpfsHash, metadataIpfsHash, updateLocalMetaData) {
  try {
    // Unpin the file and metadata from Pinata
    await pinata.unpin(imageIpfsHash);
    await pinata.unpin(metadataIpfsHash);

    console.log(
      `Unpinned image ${imageIpfsHash} and metadata ${metadataIpfsHash} from Pinata`
    );

    // Remove the entries from the local metadata file
    if (updateLocalMetaData) {
      const uriFile = "nft_uris.json";
      if (fs.existsSync(uriFile)) {
        const fileContent = fs.readFileSync(uriFile, { encoding: "utf-8" });
        let data = JSON.parse(fileContent);

        data = data.filter(
          (entry) =>
            entry.nft_uri !== `ipfs://${imageIpfsHash}` &&
            entry.metadata_uri !== `ipfs://${metadataIpfsHash}`
        );

        fs.writeFileSync(uriFile, JSON.stringify(data, null, 2), {
          encoding: "utf-8",
        });

        console.log("Removed entries from local metadata file");
      }
    }
  } catch (error) {
    console.error("Error removing file and metadata:", error);
    throw error; // Ensure errors are thrown for test capture
  }
}


module.exports = { pinFileAndMetadata , removeFileAndMetadata }; // Export the functions for testing
