async function main() {
  console.log("Environment Variables:");
  console.log(process.env);

  console.log("\nHardhat Config:");
  const config = await hre.config;
  console.log(config);

  console.log("\nNetwork Config:");
  const network = await hre.network;
  console.log(network);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

