import { ethers } from "ethers"

const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const nativeAccount = "0x00e81DDa5d56196cCb9a5FeE71cC5d6EAA0f91e4"

async function main() {
  const [signer] = await hre.ethers.getSigners()

  // const account = await hre.ethers.getContractFactory("Account")
  // const Account = await account.deploy(signer.address, ARBccipRouter__ADDRESS)
  // await Account.waitForDeployment()
  // console.log(`Account deployed to: ${Account.target}`)

  // const af = await hre.ethers.getContractFactory("AccountFactory")
  // const AF = await af.deploy()
  // await AF.waitForDeployment()
  // console.log(`AF deployed to: ${AF.target}`)

  const accountDestination = await hre.ethers.getContractFactory("AccountDestination")
  const AccountDestination = await accountDestination.deploy(signer.address, ARBccipRouter__ADDRESS, nativeAccount)
  await AccountDestination.waitForDeployment()
  console.log(`AccountDestination deployed to: ${AccountDestination.target}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
