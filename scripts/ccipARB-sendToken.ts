import { ethers } from "ethers"
const ERC20__ABI = require("../abi/ERC20.json")

const ETHCCIP__ADDRESS = "0x057cc826383106a911AefD2f01a2A9c86472Cb41"
const ARBCCIP__ADDRESS = "0x181d5c5F3a414d5b8385BE90BC8970d73BD903B6"

const main = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL)
  const [signer] = await hre.ethers.getSigners()

  //   Arb-sepolia deployment----------------------
  const arbCCIPRouter = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"
  const arbLINK = "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E"

  const arbCCIP = await hre.ethers.getContractFactory("ProgrammableTokenTransfers")
  const ArbCCIP = await arbCCIP.deploy(arbCCIPRouter, arbLINK)
  await ArbCCIP.waitForDeployment()

  console.log("ArbCCIP deployed to:", ArbCCIP.target)

  //   WhiteList-----------------------------------
  const ethChain = "16015286601757825753"

  const whitelistSourceTx = await ArbCCIP.allowlistSourceChain(ethChain, true)
  await whitelistSourceTx.wait()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
