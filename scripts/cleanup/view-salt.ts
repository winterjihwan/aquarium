import { ethers } from "ethers"

const ARB_ACCOUNT_ADDRESS = "0xAb4046aE817BDD6F155F721F649E40BE7e3Cce32"

const main = async () => {
  const Account = await hre.ethers.getContractAt("Account", ARB_ACCOUNT_ADDRESS)
  const salt = await Account.salt()
  console.log({ salt })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
