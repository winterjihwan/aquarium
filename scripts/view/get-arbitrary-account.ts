import { ethers } from "ethers"

const walletAddress = "0xf766Bf171E71411e5641E35628A083Ad36bdA635"
const privateKey = "edb769fce5204ef5273f56a309e03ffbc1d0739e15d5084d8bf400c7a4e87435"

const main = async () => {
  const wallet = ethers.Wallet.createRandom()
  console.log(wallet.address)
  console.log(wallet.privateKey)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
