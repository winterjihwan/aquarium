import { ethers } from "ethers"

const main = async () => {
  const decimalNumber = 46944
  console.log(decimalNumber.toString(16))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
