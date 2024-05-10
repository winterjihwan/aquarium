import { ethers } from "ethers"

// public key = 0x10F8BBF39357b5b1Ee82F0C7Bf9d82371df2a1Ff

// NEW - eth
const AccountNative__ADDRESS = "0xF71908103D42FfBD1D2b423a794ca8284Ff124A0"

// NEW - arb
const Creator__ADDRESS = "0x4b377f7fe6206c305765b10Ae504B6f091396710"
const AccountDestination__ADDRESS = "0x5345DF39458d2F1bD846Dd39A3b5Ea2ed8Fb9068"

// AA constants
const AF_ETH_ADDRESS = "0xdB357c18aC38Dd0135d6Fc5Aee46a04D5Bd8Ea81"
const EP_ETH_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ETH_ADDRESS = "0x22df42a8A913324e44C662D5b2Dcc42972fE589D"

const AF_ARB_ADDRESS = "0x74Ad8Af1Ff7e444Af9256D35Fa415A44E823461c"
const EP_ARB_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ARB_ADDRESS = ""

// CCIP Constants
const CCIPRouter_ETH__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const CCIPRouter_ARB__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const ETHCHAIN = "16015286601757825753"
const ARBCHAIN = "3478487238524512106"

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  //   Initializing AA accounts for destination chain
  const accountNative = await hre.ethers.getContractAt("AccountNative", AccountNative__ADDRESS)
  const initializeDestinationTx = await accountNative.AAInitializeDestination(
    ARBCHAIN,
    Creator__ADDRESS,
    AF_ARB_ADDRESS,
    signer.address,
    CCIPRouter_ARB__ADDRESS,
    PM_ETH_ADDRESS
  )
  console.log(`initializeDestinationTx: ${initializeDestinationTx.hash}`)
  const initializeDestinationReceipt = await initializeDestinationTx.wait()
  console.log("Finished!")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
