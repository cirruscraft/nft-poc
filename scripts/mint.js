async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Minting NFT with the account:", deployer.address);

  const contractAddress = "0xa453649c68fb7A5Bcf146B4ffC6dE29B95cB9e88"; // Replace with your deployed contract address
  const YellowKissNFT = await ethers.getContractFactory("YellowKissNFT");
  const yellowKissNFT = YellowKissNFT.attach(contractAddress);

  const tx = await yellowKissNFT.mintNFT();
  await tx.wait();

  const tokenCounter = await yellowKissNFT.getTokenCounter();
  console.log("NFT minted with token ID:", tokenCounter - BigInt(1));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
