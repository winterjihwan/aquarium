import { ethers } from "ethers"
import hre from "hardhat"

const USDC_LINK_PAIR__ADDRESS = "0x18845d38Cb11A378F50AB88E8DD2016272A8635F"

const pairArtifact = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json")

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  //   const WU_PAIR = new hre.ethers.Contract(WETH_USDC_PAIR_ADDRESS, pairArtifact.abi, signer)
  //   let reservesWU
  //   reservesWU = await WU_PAIR.getReserves()
  //   console.log(`Reserves Usdc - Weth: ${ethers.formatUnits(reservesWU[0], 6)}, ${ethers.formatUnits(reservesWU[1], 18)}`)

  const UL_PAIR = new hre.ethers.Contract(USDC_LINK_PAIR__ADDRESS, pairArtifact.abi, signer)
  let reservesUL
  reservesUL = await UL_PAIR.getReserves()
  console.log(`Reserves Usdc - Link: ${ethers.formatUnits(reservesUL[0], 6)}, ${ethers.formatUnits(reservesUL[1], 18)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
