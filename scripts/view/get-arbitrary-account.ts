import { ethers } from "ethers"

const walletAddress = "0x1f4B739eacfea943De2656141A1bCD628dF46706"
const privateKey = "155d12614437aa543645e06c54430e43e0265761520d2a294ffad4fea99a0a95"

const main = async () => {
  const wallet = ethers.Wallet.createRandom()
  console.log(wallet.address)
  console.log(wallet.privateKey)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
