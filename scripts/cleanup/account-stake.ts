import { ethers } from "ethers"
import { abi as ROUTER02__ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"

const ERC20__ABI = require("../abi/ERC20.json")
const ACCOUNT__ADDRESS = "0x5d9a3010e8844dd397c184a831fc9646463ece99"
const ROUTER02__ADDRESS = "0xc532a74256d3db42d0bf7a0400fefdbad7694008"

const WETH__ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
const WETH__DECIMALS = 18

const UNI__ADDRESS = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
const UNI__DECIMALS = 18

const USDC__ADDRESS = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
const USDC__DECIMALS = 6

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  //   ---------------------- deploy ----------------------
  //   const account = await hre.ethers.getContractFactory("Account")
  //   const Account = await account.deploy(signer.address)
  //   await Account.waitForDeployment()
  //   console.log("Account deployed to:", Account.target)

  //   ---------------------- approval ----------------------
  // const WETH = new ethers.Contract(WETH__ADDRESS, ERC20__ABI, signer)
  // const UNI = new ethers.Contract(UNI__ADDRESS, ERC20__ABI, signer)
  // const wethApprove = await WETH.approve(ACCOUNT__ADDRESS, ethers.MaxUint256)
  // await wethApprove.wait()
  // const uniApprove = await UNI.approve(ACCOUNT__ADDRESS, ethers.MaxUint256)
  // await uniApprove.wait()

  // ---------------------- addLiquidity ----------------------
  // const Account = await hre.ethers.getContractAt("Account", ACCOUNT__ADDRESS)
  // const UniV2Balance = await Account.getTokenBalance("0xf4939fa2cb43ded5ba0fa37d7a37f804b06642d3")
  // console.log({ UniV2Balance })

  // const tokenA = WETH__ADDRESS
  // const decimalsA = WETH__DECIMALS
  // const tokenB = UNI__ADDRESS
  // const decimalsB = UNI__DECIMALS

  // const amountsIn = ethers.parseUnits("0.05", decimalsA)
  // const path = [tokenA, tokenB]

  // const ROUTER02 = new ethers.Contract(ROUTER02__ADDRESS, ROUTER02__ABI, signer)
  // let amountsOut = await ROUTER02.getAmountsOut(amountsIn, path)
  // amountsOut = amountsOut[1]
  // console.log("Amounts out: ", ethers.formatUnits(amountsOut, decimalsB))

  // const tx = await Account.addLiquidity(tokenA, tokenB, amountsIn, amountsOut)
  // console.log(tx.hash)
  // await tx.wait()
  // console.log("Deposit done!")

  //   ---------------------- liquidate ----------------------
  // const Account = await hre.ethers.getContractAt("Account", ACCOUNT__ADDRESS)
  // const PAIR__ADDRESS = "0xf4939FA2cB43Ded5BA0fA37D7A37f804b06642D3"
  // const pairBalance = await Account.getTokenBalance(PAIR__ADDRESS)
  // console.log({ pairBalance })

  // const tokenA = WETH__ADDRESS
  // const tokenB = UNI__ADDRESS

  // const tx = await Account.liquidateLiquidity(tokenA, tokenB, PAIR__ADDRESS, pairBalance)
  // console.log(tx.hash)
  // await tx.wait()
  // console.log("Liquidate done!")

  //   ---------------------- deposit ----------------------

  // const approveTx = await WETH.approve(ACCOUNT__ADDRESS, ethers.MaxUint256)
  // await approveTx.wait()
  // const approveTx2 = await UNI.approve(ACCOUNT__ADDRESS, ethers.MaxUint256)
  // await approveTx2.wait()
  // const depositTx = await Account.depositToken(WETH__ADDRESS, ethers.parseUnits("0.2", WETH__DECIMALS))
  // await depositTx.wait()
  // const depositTx2 = await Account.depositToken(UNI__ADDRESS, ethers.parseUnits("0.003", UNI__DECIMALS))
  // await depositTx2.wait()

  // const WETH = new ethers.Contract(WETH__ADDRESS, ERC20__ABI, signer)
  // const UNI = new ethers.Contract(UNI__ADDRESS, ERC20__ABI, signer)

  // const Account = await hre.ethers.getContractAt("Account", ACCOUNT__ADDRESS)

  // const wethBalance = await Account.getTokenBalance(WETH__ADDRESS)
  // console.log({ wethBalance })

  // const uniBalance = await Account.getTokenBalance(UNI__ADDRESS)
  // console.log({ uniBalance })

  // const PAIR__ADDRESS = "0xf4939FA2cB43Ded5BA0fA37D7A37f804b06642D3"
  // const pairBalance = await Account.getTokenBalance(PAIR__ADDRESS)
  // console.log({ pairBalance })
  //   -----------------------------------------------------
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
