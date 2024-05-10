import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
            details: {
              yul: true,
            },
          },
        },
      },
      {
        version: "0.6.12",
      },
    ],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    // apiKey: process.env.ARBISCAN_API_KEY,
    // customChains: [
    //   {
    //     network: "arbitrumSepolia",
    //     chainId: 421614,
    //     urls: {
    //       apiURL: "https://api-sepolia.arbiscan.io/api",
    //       browserURL: "https://sepolia.arbiscan.io/",
    //     },
    //   },
    // ],
  },
  sourcify: {
    enabled: true,
  },
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: ["155d12614437aa543645e06c54430e43e0265761520d2a294ffad4fea99a0a95", process.env.PRIVATE_KEY!],
      blockGasLimit: 100000000,
    },
    asepolia: {
      url: process.env.ARBITRUM_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
      blockGasLimit: 100000000,
    },
  },
}

export default config
