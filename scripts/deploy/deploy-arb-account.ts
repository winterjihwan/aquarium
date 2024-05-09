import { ethers } from "ethers"

const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const ARBccipRouter__ADDRESS = "0xe4Dd3B16E09c016402585a8aDFdB4A18f772a07e"

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
