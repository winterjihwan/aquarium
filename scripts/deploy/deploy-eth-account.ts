import { ethers } from "ethers"

const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const accountNative = await hre.ethers.getContractFactory("AccountNative")
  const AccountNative = await accountNative.deploy(signer.address, ETHccipRouter__ADDRESS)
  await AccountNative.waitForDeployment()
  console.log(`AccountNative deployed to: ${AccountNative.target}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
