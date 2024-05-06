import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      // accounts: [
      //   "0x4c5b6bc26124440c691cea40d27597ddc258d438df4c649c3359dde219bf4cb6",
      // ],
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
}

export default config
