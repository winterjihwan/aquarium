import { ethers } from "ethers"

const main = async () => {
  const opHash = "0x79da78189e5fd6cf771963342611adbd5d34a3c5a5e9497bfcbfe6868b9c52c2"
  const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash])
  console.log({ transactionHash })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
