import { ethers } from "ethers"
const ERC20__ABI = require("../abi/ERC20.json")

const ETHCCIP__ADDRESS = ""
const ARBCCIP__ADDRESS = ""

const main = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL)
  const [signer] = await hre.ethers.getSigners()

  //   Arb-sepolia deployment----------------------
  //   const arbCCIPRouter = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

  // const arbCCIP = await hre.ethers.getContractFactory("ProgrammableTokenTransfers")
  //   const ArbCCIP = await arbCCIP.deploy(arbCCIPRouter, arbLINK)
  //   await ArbCCIP.waitForDeployment()

  //   console.log("ArbCCIP deployed to:", ArbCCIP.target)

  const ArbCCIP = await hre.ethers.getContractAt("ProgrammableTokenTransfers", ARBCCIP__ADDRESS)

  //   WhiteList-----------------------------------
  //   const ethChain = "16015286601757825753"

  //   const whitelistSourceTx = await ArbCCIP.allowlistSourceChain(ethChain, true)
  //   await whitelistSourceTx.wait()

  //   const whitelistSenderTx = await ArbCCIP.allowlistSender(ETHCCIP__ADDRESS, true)
  //   await whitelistSenderTx.wait()

  //   Read message and token----------------------
  const message = await ArbCCIP.getLastReceivedMessageDetails()
  console.log({ message })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
