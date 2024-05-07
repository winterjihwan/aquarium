const { ethers } = require("ethers")
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json")
const {
  abi: SwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json")
const { getPoolImmutables, getPoolState } = require("./helpers")
const ERC20ABI = require("../abi/ERC20.json")

require("dotenv").config()
const ALCHEMY_URL_TESTNET = process.env.RPC_URL
const WALLET_SECRET = process.env.PRIVATE_KEY

const provider = ethers.getDefaultProvider("sepolia")
const poolAddress = "0x84f491dd1e1bb2b251bea2cab9ac6849e94bfbc5"
const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"

const name0 = "WETH"
const symbol0 = "WETH"
const decimals0 = 18
const address0 = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"

const name1 = "UNI"
const symbol1 = "UNI"
const decimals1 = 18
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"

async function main() {
  const [signer] = await hre.ethers.getSigners()

  const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)
  // const immutables = await getPoolImmutables(poolContract)
  // const state = await getPoolState(poolContract)
  // console.log({ immutables })
  // console.log({ state })

  const wallet = new ethers.Wallet(WALLET_SECRET)
  const connectedWallet = wallet.connect(provider)

  const swapRouterContract = new ethers.Contract(swapRouterAddress, SwapRouterABI, signer)

  const tokenContract0 = new ethers.Contract(address0, ERC20ABI, signer)
  const approvalResponse = await tokenContract0
    .connect(connectedWallet)
    .approve(swapRouterAddress, ethers.parseEther("0.1"))

  await approvalResponse.wait()

  console.log({ approvalResponse })

  const params = {
    tokenIn: address1,
    tokenOut: address0,
    fee: 500,
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    amountIn: ethers.parseEther("0.0001"),
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  }

  const transaction = swapRouterContract
    .connect(connectedWallet)
    .exactInputSingle(params, {
      gasLimit: 3000000,
    })
    .then((transaction: any) => {
      console.log(transaction)
    })
}

main()
