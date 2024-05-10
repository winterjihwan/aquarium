import { ethers } from "ethers"

// public key = 0x10F8BBF39357b5b1Ee82F0C7Bf9d82371df2a1Ff

// NEW - eth
// const AccountNative__ADDRESS = "0xF71908103D42FfBD1D2b423a794ca8284Ff124A0"
// v는 임의의 프라이빗키로 실행중 ^는 0x10으로 시작하는 실제 프라이빗키의 센더 계정
const AccountNative__ADDRESS = "0x5ca3faed0838251793c35620225913ff6042df73"

// NEW - arb
const Creator__ADDRESS = "0x4b377f7fe6206c305765b10Ae504B6f091396710"
const AccountDestination__ADDRESS = "0x5345DF39458d2F1bD846Dd39A3b5Ea2ed8Fb9068"

// AA constants
const AF_ETH_ADDRESS = "0xBfCa7e5d3aFF1f96331d9B6495935422eeE525Ee"
const EP_ETH_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ETH_ADDRESS = "0x22df42a8A913324e44C662D5b2Dcc42972fE589D"

const AF_ARB_ADDRESS = "0x6477997B07775362c07994618588c3E3eDdF367f"
const EP_ARB_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ARB_ADDRESS = ""

// CCIP Constants
const CCIPRouter_ETH__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const CCIPRouter_ARB__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const ETHCHAIN = "16015286601757825753"
const ARBCHAIN = "3478487238524512106"

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
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory")
  const AccountNative = await hre.ethers.getContractFactory("AccountNative")

  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  let initRouter = CCIPRouter_ETH__ADDRESS
  let initCode =
    AF_ETH_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [signerAddress, initRouter]).slice(2)

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

  //   Initializing AA accounts for destination chain
  // const accountNative = await hre.ethers.getContractAt("AccountNative", AccountNative__ADDRESS)
  // const initializeDestinationTx = await accountNative.AAInitializeDestination(
  //   ARBCHAIN,
  //   Creator__ADDRESS,
  //   AF_ARB_ADDRESS,
  //   signer.address,
  //   CCIPRouter_ARB__ADDRESS,
  //   PM_ETH_ADDRESS
  // )
  // console.log(`initializeDestinationTx: ${initializeDestinationTx.hash}`)
  // const initializeDestinationReceipt = await initializeDestinationTx.wait()
  // console.log("Finished!")

  const AAInitializeDestinationCallData = AccountNative.interface.encodeFunctionData("AAInitializeDestination", [
    ARBCHAIN,
    Creator__ADDRESS,
    AF_ARB_ADDRESS,
    signerAddress,
    CCIPRouter_ARB__ADDRESS,
    PM_ETH_ADDRESS,
  ])

  // -------------------------------------------

  const userOp: UserOperation = {
    sender, // smart account address
    nonce: "0x" + (await EntryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    // callData: AccountNative.interface.encodeFunctionData("initAA"),
    callData: AAInitializeDestinationCallData,
    // callData: addLiquidityCallData,
    // callData: liquidateLiquidityCallData,
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

  // userOp manual input---------------------------
  // const preVerficationGas = 100000
  // const verificationGasLimit = 300000
  // const callGasLimit = 300000
  // userOp.preVerificationGas = "0x" + preVerficationGas.toString(16)
  // userOp.verificationGasLimit = "0x" + verificationGasLimit.toString(16)
  // userOp.callGasLimit = "0x" + callGasLimit.toString(16)

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData()
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16)

  const maxPriorityFeePerGas = await hre.ethers.provider.send("rundler_maxPriorityFeePerGas")
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas

  const userOpHash = await EntryPoint.getUserOpHash(userOp)
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
