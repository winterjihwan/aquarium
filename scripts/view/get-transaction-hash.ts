import { ethers } from "ethers"

const main = async () => {
  const opHash = "0x2b093d50797c3bd3d363b74afa0c4ce414bd4a4fbfc96a475c5462c4ecd07279"
  const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash])
  console.log({ transactionHash })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
