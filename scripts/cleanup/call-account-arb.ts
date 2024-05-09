import { ethers } from "ethers"

const ARBAccount__ADDRESS = "0x3d85D55a180e5dB4c415AA2E742a295BD3C62389"
const arbChain = "3478487238524512106"
const AF_ARB_ADDRESS = "0x7F178949a1b2f1Ef244B847702909620EEe877C5"
const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const main = async () => {
  const wallet = ethers.Wallet.createRandom()

  const Account = await hre.ethers.getContractAt("Account", ARBAccount__ADDRESS)
  const tx = await Account.AAInitializeDestination(
    arbChain,
    ARBAccount__ADDRESS,
    AF_ARB_ADDRESS,
    wallet.address,
    ARBccipRouter__ADDRESS,
    { gasLimit: 8000000 }
  )
  const txr = await tx.wait()
  console.log(`Success: ${txr}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
