import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    besu : {
      url: "http://besu:8545",
      accounts: ["0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
        "0x23af79c994b9d3c94761bfc34d6b5f9a1db78f8c541e25b9a2334f6ed8a1c3e8",
      "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"],
    },

    baseSepolia: {
      url: "https://base-sepolia-rpc.publicnode.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      timeout: 60000,
    },

    base: {
      url: "https://mainnet.base.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      timeout: 60000,
    }

  }
};

export default config;
