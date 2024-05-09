import { ethers } from "ethers"
import fs from "fs/promises"
import path from "path"
import { abi as ROUTER02__ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"
const ERC20__ABI = require("../abi/ERC20.json")

// AA constants
const AF_ADDRESS = "0x8D337F442dE4CD40C3439aB4C8f52F2A540188Bb"
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ADDRESS = "0x2355406C9Ea0D4Ce73FE6C0F688B8fF2922398D7"

const AF_ARB_ADDRESS = "0xa51604f35765724ACC4206E859e50e5A0f5C1008"
const EP_ARB_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ARB_ADDRESS = "0x83211C4E47E28c1B4895028052b4dc5F59abefc4"

// CCIP Constants
const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const ethChain = "16015286601757825753"
const arbChain = "3478487238524512106"

// Uniswap Constants
const ROUTER02__ADDRESS = "0xc532a74256d3db42d0bf7a0400fefdbad7694008"

const WETH__ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
const WETH__DECIMALS = 18
const UNI__ADDRESS = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
const UNI__DECIMALS = 18
const USDC__ADDRESS = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
const USDC__DECIMALS = 6

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

  const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS)
  const Paymaster = await hre.ethers.getContractAt("Paymaster", PM_ADDRESS)
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory")
  const Account = await hre.ethers.getContractFactory("Account")

  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  let initRouter = ETHccipRouter__ADDRESS
  let initCode =
    AF_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [signerAddress, initRouter]).slice(2)

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

  const code = await hre.ethers.provider.getCode(sender)
  if (code != "0x") {
    initCode = "0x"
  }

  // AA Stake -------------------------------------
  // const ROUTER02 = new ethers.Contract(ROUTER02__ADDRESS, ROUTER02__ABI, provider)

  // const tokenA = WETH__ADDRESS
  // const decimalsA = WETH__DECIMALS
  // const tokenB = UNI__ADDRESS
  // const decimalsB = UNI__DECIMALS

  // const path = [tokenA, tokenB]
  // const amountsA = ethers.parseUnits("0.05", decimalsA)

  // let amountsB = await ROUTER02.getAmountsOut(amountsA, path)
  // amountsB = amountsB[1]
  // console.log("Amounts B: ", ethers.formatUnits(amountsB, decimalsB))

  // const deadline = Math.floor(Date.now() / 1000) + 60 * 10

  // const addLiquidityCallData = Account.interface.encodeFunctionData("addLiquidity", [
  //   tokenA,
  //   tokenB,
  //   amountsA,
  //   amountsB,
  // ])

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
  const arbAccount__ADDRESS = "0x02Fc483cc658d0a9D5d6B4e6EB97F592c9A10204"
  const AAInitializeDestinationCallData = Account.interface.encodeFunctionData("AAInitializeDestination", [
    arbChain,
    arbAccount__ADDRESS,
    AF_ADDRESS,
    signerAddress,
    ARBccipRouter__ADDRESS,
  ])

  // -------------------------------------------

  const userOp: UserOperation = {
    sender, // smart account address
    nonce: "0x" + (await EntryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    // callData: Account.interface.encodeFunctionData("initAA"),
    callData: AAInitializeDestinationCallData,
    // callData: addLiquidityCallData,
    // callData: liquidateLiquidityCallData,
    paymasterAndData: PM_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  }

  const { preVerificationGas, verificationGasLimit, callGasLimit } = await hre.ethers.provider.send(
    "eth_estimateUserOperationGas",
    [userOp, EP_ADDRESS]
  )
  userOp.preVerificationGas = preVerificationGas
  userOp.verificationGasLimit = verificationGasLimit
  userOp.callGasLimit = callGasLimit

  //   userOp manual input---------------------------
  //   const preVerficationGas = 100000
  //   const verificationGasLimit = 300000
  //   const callGasLimit = 300000
  //   userOp.preVerificationGas = "0x" + preVerficationGas.toString(16)
  //   userOp.verificationGasLimit = "0x" + verificationGasLimit.toString(16)
  //   userOp.callGasLimit = "0x" + callGasLimit.toString(16)

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData()
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16)

  const maxPriorityFeePerGas = await hre.ethers.provider.send("rundler_maxPriorityFeePerGas")
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas

  const userOpHash = await EntryPoint.getUserOpHash(userOp)
  userOp.signature = await signer.signMessage(hre.ethers.getBytes(userOpHash))

  console.log({ userOp })

  const opHash = await hre.ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS])

  console.log({ opHash })

  setTimeout(async () => {
    const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash])

    console.log({ transactionHash })
  }, 30000)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
