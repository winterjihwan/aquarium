import { ethers } from "ethers"

const walletAddress = "0xEE5C5748fF98C648aB8e3B13dF5ea02B94b3e07C"
const privateKey = "ea3eebe8525131c42bfd370d5c2f3319894003366139e27adb03bd528aab29a5"

const main = async () => {
  const wallet = ethers.Wallet.createRandom()
  console.log(wallet.address)
  console.log(wallet.privateKey)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
