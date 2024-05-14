const { pinFileAndMetadata } = require('./pinFileToIpfs'); // Adjust the path as needed

// Get the JSON file path from the command line arguments
const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error("Please provide the path to the JSON file.");
  process.exit(1);
}

(async () => {
  try {
    const result = await pinFileAndMetadata(jsonFilePath);
    console.log("Pinning successful:", result);
  } catch (error) {
    console.error("Error pinning file and metadata:", error);
  }
})();

