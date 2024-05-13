import { ethers } from "ethers"

// AA constants
const AF_ETH_ADDRESS = "0xa374490b77b72A76cCcF8f57E8942E4F4C4ADb8f"
const EP_ETH_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ETH_ADDRESS = "0x822f0304d5152B329b08aA50eE3F9F4FF6742E43"

// CCIP Constants
const CCIPRouter_ETH__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const CCIPRouter_ARB__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const ETHCHAIN = "16015286601757825753"
const ARBCHAIN = "3478487238524512106"

// [ Account Native / Destination ]
const ACCOUNT_NATIVE__ADDRESS = "0x00e81DDa5d56196cCb9a5FeE71cC5d6EAA0f91e4"
const ACCOUNT_DESTINATION__ADDRESS = "0x0C901bfA817a5B107aA8E473C6764cf2dffC277A"

// [ Uniswap ]
const factoryArtifact = require("@uniswap/v2-core/build/UniswapV2Factory.json")
const routerArtifact = require("@uniswap/v2-periphery/build/UniswapV2Router02.json")
const pairArtifact = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json")

const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
const WETH__ABI = require("../abi/WETH.json")
const USDC__ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
const ERC20__ABI = require("../abi/ERC20.json")

// [ Uniswap - ETH]

const FACTORY__ADDRESS = "0x7AA1CB24f20166D118087AA3b9d67943D4B903E9"
const ROUTER__ADDRESS = "0x139D70E24b8C82539800EEB99510BfB8B09eaF68"
const WETH_USDC_PAIR_ADDRESS = "0xf605cdA0Bf33e42ccac267Db4B8c06496E77937f"

// [ Uniswap - ARB]

const FACTORY_ARB__ADDRESS = "0xb82c9446E520F2e1d99E856889fDC14b64ca83E5"
const ROUTER_ARB__ADDRESS = "0x641E13E0AEdf07E48205322AE19f565A81bD4ca5"
const USDC_LINK_PAIR_ARB__ADDRESS = "0x18845d38Cb11A378F50AB88E8DD2016272A8635F"

const USDC_ARB__ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
const LINK_ARB__ADDRESS = "0x95C1265d70411E8f0a70643199E9AC6F34926d43"
const WETH_ARB__ADDRESS = "0xA90B594dA138A5B7560F3595cc298a29aA699aA9"

// [ Multicall ]
const MULTICALL__ADDRESS = "0x05b72D2354162108F1b726F5e135e357A86f60bD"

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

  const AccountNative = await hre.ethers.getContractAt("AccountNative", ACCOUNT_NATIVE__ADDRESS)

  const initialValue = ethers.parseEther("0.1")
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5

  const incubateTx = await AccountNative.incubate(
    ARBCHAIN,
    ACCOUNT_DESTINATION__ADDRESS,
    USDC__ADDRESS,
    WETH__ADDRESS,
    USDC__ADDRESS,
    USDC_ARB__ADDRESS,
    LINK_ARB__ADDRESS,
    initialValue,
    deadline,
    PM_ETH_ADDRESS,
    { gasLimit: 3000000 }
  )
  console.log("Incubating Weth / USDC...", incubateTx.hash)
  await incubateTx.wait()
  console.log("Incubated!")

  // const controlTx = await AccountNative.incubateDestination(
  //   ARBCHAIN,
  //   ACCOUNT_DESTINATION__ADDRESS,
  //   USDC_ARB__ADDRESS,
  //   LINK_ARB__ADDRESS,
  //   PM_ETH_ADDRESS
  // )
  // console.log("Controlling Destination...", controlTx.hash)
  // await controlTx.wait()
  // console.log("Controlled!")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
