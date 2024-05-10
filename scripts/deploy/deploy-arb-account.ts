import { ethers } from "ethers"

const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const Arb_ACCOUNT = "0x5B6Ea6d828c57749cD15B0F7c1558486b02C2e00"

async function main() {
  const [signer] = await hre.ethers.getSigners()

  const account = await hre.ethers.getContractFactory("Account")
  const Account = await account.deploy(signer.address, ARBccipRouter__ADDRESS)
  await Account.waitForDeployment()
  console.log(`Account deployed to: ${Account.target}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
