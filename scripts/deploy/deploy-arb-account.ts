import { ethers } from "ethers"

const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

async function main() {
  const wallet = ethers.Wallet.createRandom()
  const account = await hre.ethers.getContractFactory("Account")
  const Account = await account.deploy(wallet.address, ARBccipRouter__ADDRESS)
  await Account.waitForDeployment()
  console.log(`Account deployed to: ${Account.target}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
