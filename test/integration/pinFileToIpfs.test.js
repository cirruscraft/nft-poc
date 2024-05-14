const fs = require("fs");
const { expect } = require("chai");
const { pinFileAndMetadata,removeFileAndMetadata } = require("../../scripts/pinFileToIpfs");

describe("Pin File to IPFS Integration Test", function () {
  this.timeout(120000); // Increase timeout for network calls

  const testConfigPath = "./test_config.json"; // Path to the test config file
  let expectedNftUri;
  let expectedMetadataUri;
  const datetimeTolerance = 10 * 100; // 10 seconds

  before(() => {
    // Setup the test environment
    const testImagePath = "./test_image.png";
  });

  it("should pin an image and metadata to IPFS and verify the dynamic IPFS hashes", async () => {
    const { imageResponse, metadataResponse } = await pinFileAndMetadata(
      testConfigPath
    );

    console.log("imageResponse", imageResponse);
    console.log("metadataResponse", metadataResponse);
    // Assertions to check if the responses contain IPFS hashes
    [imageResponse, metadataResponse].forEach((response) => {
      expect(response).to.have.property("IpfsHash");
      expect(response).to.have.property("PinSize");
      expect(response).to.have.property("IpfsHash");
      expect(response.IpfsHash).to.match(/^Qm[a-zA-Z0-9]{44}$/);
    });

    expectedNftUri = `ipfs://${imageResponse.IpfsHash}`;
    expectedMetadataUri = `ipfs://${metadataResponse.IpfsHash}`;
  });

  it("Should write the hashes out to the nft_uri.json file", async () => {  
    // Load the nft_uris.json to check saved values
    const uriJson = JSON.parse(fs.readFileSync("./nft_uris.json"));
    const lastEntry = uriJson[uriJson.length - 1]; // get the last entry
    console.log(uriJson);
    expect(lastEntry.nft_uri).to.equal(expectedNftUri);
    expect(lastEntry.metadata_uri).to.equal(expectedMetadataUri);

    // Check datetime within tolerance
    const actualDatetime = new Date(lastEntry.uploaded_datetime);
    const currentDatetime = new Date();
    expect(currentDatetime - actualDatetime).to.be.lessThan(datetimeTolerance);
  });

  it("Should be able to download the files after upload", async () => {
    


  });  
  after(async () => {
    try {
      fs.unlinkSync("./nft_uris.json");

      // const ipfsUri = "ipfs://QmP25969Qs8UwGkL8hn5W7ZD9EMDyGJchZz9tgDE8ZRirP";
      // slice(7) will drop the ipfs:// and give the "IPFS CID"
      await removeFileAndMetadata(
        expectedNftUri.slice(7),
        expectedMetadataUri.slice(7),
        false
      );
    } catch (err) {
      console.log("No URI file to clean up.");
    }
  });
});
