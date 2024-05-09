import { ethers } from "ethers"

const AF_ARB__ADDRESS = "0x7F178949a1b2f1Ef244B847702909620EEe877C5"
const ARBROUTER__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const main = async () => {
  const wallet = ethers.Wallet.createRandom()
  const AF = await hre.ethers.getContractAt("AccountFactory", AF_ARB__ADDRESS)
  const tx = await AF.createAccount(wallet.address, ARBROUTER__ADDRESS)
  const txr = await tx.wait()
  console.log(`Success: ${txr}`)
}

main().catch((error) => {
  console.error(error)

  process.exit(1)
})
