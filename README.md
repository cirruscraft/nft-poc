# Test NFT project

This project demonstrates a basic nft project, using Hardhat. 

Make sure you have enough eth in your wallet on sepolia to actually deploy the contract...

- [Pinata Cloud - IPFS storage] (https://docs.pinata.cloud/pinning/pinning-files)
- [Get test ETH on Sepolia] (https://www.alchemy.com/faucets/ethereum-sepolia)
- [Etherscan] (https://sepolia.etherscan.io/)


```shell
# Show configuration that has been setup
npx hardhat run scripts/showVars.js --network sepolia   
# Deploy the image and metadata to ipfs ( you need create an account on Pinata.cloud )
cd scripts; node runPinFileAndMetadata.js ../images/3.json
# Test locally
 npx hardhat ignition deploy ./ignition/modules/YellowKiss.js --network localhost
 npx hardhat run scripts/mint.js --network localhost
# Deploy contract to sepolia
 npx hardhat ignition deploy ./ignition/modules/YellowKiss.js --network sepolia
# Run the mint function on the deployed contract
 npx hardhat run scripts/mint.js --network sepolia 
```
