import { ethers } from "ethers"
import hre from "hardhat"

const main = async () => {
  const opHash = "0xb761e2a73464ff524b5bdb0d98b33f9ea739546e5b2976c0fc86c02df8ba4dc8"
  const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash])
  console.log({ transactionHash })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
