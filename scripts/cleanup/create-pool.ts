import { ethers } from "ethers"
import { abi as UniswapV3Factory_ABI } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"

const UniswapV3Factory_ADDRESS = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c"

const LinkS_ADDRESS = "0x945f268b9Ffd2038961c265afcb589480bC9fFFe"
const UsdtS_ADDRESS = "0x392fE953882a49b4E705E63d345102086e90d94B"

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const UniswapV3Factory = new ethers.Contract(UniswapV3Factory_ADDRESS, UniswapV3Factory_ABI, provider)

  const tx = await UniswapV3Factory.createPool(LinkS_ADDRESS, UsdtS_ADDRESS, 0)
  console.log({ tx })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
