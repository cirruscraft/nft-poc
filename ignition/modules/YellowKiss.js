const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NFT_URI = "ipfs://QmUh4nEF2PidWxZdkHKvdZjM7nqotd8c4KRrRwAjCGfHtF";


module.exports = buildModule("YellowKissModule", (m) => {
  const tokenUri = m.getParameter("tokenUri", NFT_URI);

  const yellowKissNFT = m.contract("YellowKissNFT", [tokenUri], {});

  return { yellowKissNFT };
});
