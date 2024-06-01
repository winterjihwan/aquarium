import { ethers } from "ethers"
import hre from "hardhat"

// public key = 0x10F8BBF39357b5b1Ee82F0C7Bf9d82371df2a1Ff

// [ P256 ID and Public Key ]
const keyId = "0xb11b11a6ec47dc55a7e3e3cd2ee334dcebe844209568be79c7e6e3deab572bf2"
const publicKey = {
  x: "0xe77fa4d6e9c39aedb00d4ea8113fd9a7183a683034cad7f80489cf64d8a10c02",
  y: "0x1f31056eb9d7bbda0f6b888fc90563a2474f3cbf7ab339f23d2eb64cb5c88220",
}

// [ Account Native / Destination ]
const ACCOUNT_NATIVE__ADDRESS = "0x805fcc76e329f13188df4298588e32abd325fd90"
const ACCOUNT_DESTINATION__ADDRESS = "0xF2BDEBB36eE1D1B5184423765D9Ca2452DC96b05"

// NEW - arb
const Creator__ADDRESS = "0x3c160a8b39419DeE194526F4896902ff37A66de4"

// AA constants
const AF_ETH_ADDRESS = "0x2C9d708D8EA12C4A74Fe063e7998312F4136299d"
const EP_ETH_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ETH_ADDRESS = "0x822f0304d5152B329b08aA50eE3F9F4FF6742E43"

const AF_ARB_ADDRESS = "0x9bD6b41D55DbE59aaFB94c66960FbBDf17719f52"
const EP_ARB_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ARB_ADDRESS = "0x8Ff43DC9d22960f49171A38E07B5AcE0a320D32d"

// CCIP Constants
const CCIPRouter_ETH__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const CCIPRouter_ARB__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const ETHCHAIN = "16015286601757825753"
const ARBCHAIN = "3478487238524512106"

// [ ERC20 ]
const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
const WETH__ABI = require("../abi/WETH.json")
const USDC__ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
const ERC20__ABI = require("../abi/ERC20.json")

// [ Uniswap ]
const factoryArtifact = require("@uniswap/v2-core/build/UniswapV2Factory.json")
const routerArtifact = require("@uniswap/v2-periphery/build/UniswapV2Router02.json")
const pairArtifact = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json")

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

interface UserOperation {
  sender: string | undefined
  nonce: string
  initCode: string
  callData: any
  paymasterAndData: string
  signature: string
  preVerificationGas?: number | string
  verificationGasLimit?: number | string
  callGasLimit?: number | string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")

  const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ETH_ADDRESS)
  const Paymaster = await hre.ethers.getContractAt("Paymaster", PM_ETH_ADDRESS)
  const AccountFactory = await hre.ethers.getContractAt("AccountFactory", AF_ETH_ADDRESS)
  const AccountNative = await hre.ethers.getContractFactory("AccountNative")

  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  let initRouter = CCIPRouter_ETH__ADDRESS
  let initCode =
    AF_ETH_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [[publicKey.x, publicKey.y]]).slice(2)

  let sender
  try {
    await EntryPoint.getSenderAddress(initCode)
  } catch (error) {
    if (typeof error === "object" && error !== null && "data" in error) {
      const data = (error as { data: string }).data
      sender = "0x" + data.slice(-40)
    } else {
      console.error(error)
    }
  }
  console.log({ sender, signerAddress })

  const code = await hre.ethers.provider.getCode(sender!)
  if (code != "0x") {
    initCode = "0x"
  }

  // AA Liquidate ---------------------------------
  //   const PAIR__ADDRESS = "0xf4939FA2cB43Ded5BA0fA37D7A37f804b06642D3"
  //   const PAIR = new ethers.Contract(PAIR__ADDRESS, ERC20__ABI, provider)
  //   const pairBalance = await PAIR.balanceOf(sender)
  //   console.log({ pairBalance })

  //   const tokenA_L = WETH__ADDRESS
  //   const tokenB_L = UNI__ADDRESS

  //   const liquidateLiquidityCallData = Account.interface.encodeFunctionData("liquidateLiquidity", [
  //     tokenA_L,
  //     tokenB_L,
  //     PAIR__ADDRESS,
  //     pairBalance,
  //   ])

  // CCIP Call ---------------------------------

  const AAInitializeDestinationCallData = AccountNative.interface.encodeFunctionData("AAInitializeDestination", [
    ARBCHAIN,
    Creator__ADDRESS,
    AF_ARB_ADDRESS,
    signerAddress,
    CCIPRouter_ARB__ADDRESS,
    PM_ETH_ADDRESS,
  ])

  // Transfer incubation seed ----------------------

  const initialValue = ethers.parseEther("0.1")
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5

  const transferSeedCallData = AccountNative.interface.encodeFunctionData("incubate", [
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
  ])

  // Call incubate---------------------------------
  const callIncubateCallData = AccountNative.interface.encodeFunctionData("incubateDestination", [
    ARBCHAIN,
    ACCOUNT_DESTINATION__ADDRESS,
    USDC_ARB__ADDRESS,
    LINK_ARB__ADDRESS,
    PM_ETH_ADDRESS,
  ])
  // ----------------------------------------------

  // Reserves Usdc - Link: 5.938652, 18.856052495146312039

  const userOp: UserOperation = {
    sender, // smart account address
    nonce: "0x" + (await EntryPoint.getNonce(sender!, 0)).toString(16),
    initCode,
    callData: AccountNative.interface.encodeFunctionData("initAA"),
    // callData: AAInitializeDestinationCallData,
    // callData: transferSeedCallData,
    // callData: callIncubateCallData,
    paymasterAndData: PM_ETH_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  }

  const { preVerificationGas, verificationGasLimit, callGasLimit } = await hre.ethers.provider.send(
    "eth_estimateUserOperationGas",
    [userOp, EP_ETH_ADDRESS]
  )
  userOp.preVerificationGas = preVerificationGas
  userOp.verificationGasLimit = verificationGasLimit
  userOp.callGasLimit = callGasLimit

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData()
  userOp.maxFeePerGas = "0x" + maxFeePerGas!.toString(16)

  const maxPriorityFeePerGas = await hre.ethers.provider.send("rundler_maxPriorityFeePerGas")
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas

  const userOpHash = await EntryPoint.getUserOpHash(userOp as any)
  userOp.signature = await signer.signMessage(hre.ethers.getBytes(userOpHash))

  console.log({ userOp })

  const opHash = await hre.ethers.provider.send("eth_sendUserOperation", [userOp, EP_ETH_ADDRESS])

  console.log({ opHash })

  setTimeout(async () => {
    const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash])

    console.log({ transactionHash })
  }, 30000)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
