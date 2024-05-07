import { ethers } from "ethers"

const ERC20_ABI = require("../abi/ERC20.json")

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  const name0 = "USDT"
  const symbol0 = "USDT"
  const decimals0 = 6
  const address0 = "0x3637925ee8b837f85c7309e4b291ca56a40457a4"

  const name1 = "WETH"
  const symbol1 = "WETH"
  const decimals1 = 18
  const address1 = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"

  //   ETH gas balance of signer
  const balance = await provider.getBalance(signerAddress)
  console.log({ balance })

  //  USDT balance of signer
  const usdtContract = new ethers.Contract(address0, ERC20_ABI, provider)
  const usdtBalance = await usdtContract.balanceOf(signerAddress)
  console.log({ usdtBalance })

  //  WETH balance of signer
  const wethContract = new ethers.Contract(address1, ERC20_ABI, provider)
  const wethBalance = await wethContract.balanceOf(signerAddress)
  console.log({ wethBalance })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
