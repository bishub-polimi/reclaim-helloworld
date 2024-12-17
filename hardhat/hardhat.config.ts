import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    besu : {
      url: "http://besu:8545"
    }
  }
};

export default config;
