import { ethers } from "ethers"

const ERC20_ABI = require("../abi/ERC20.json")

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  const name0 = "METH"
  const symbol0 = "METH"
  const decimals0 = 6
  const address0 = "0x4f7a67464b5976d7547c860109e4432d50afb38e"

  const name1 = "WETH"
  const symbol1 = "WETH"
  const decimals1 = 18
  const address1 = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"

  //   ETH gas balance of signer
  const balance = await provider.getBalance(signerAddress)
  console.log({ balance })

  //  USDT balance of signer
  const methContract = new ethers.Contract(address0, ERC20_ABI, provider)
  const methBalance = await methContract.balanceOf(signerAddress)
  console.log({ methBalance })

  //  WETH balance of signer
  const wethContract = new ethers.Contract(address1, ERC20_ABI, provider)
  const wethBalance = await wethContract.balanceOf(signerAddress)
  console.log({ wethBalance })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
