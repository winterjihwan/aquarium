import { ethers } from "ethers"

const main = async () => {
  const opHash = "0x4fcda56c1c453fc903823621263dfa407198bdad1ff615ea1dfdd85eb1b0197a"
  const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash])
  console.log({ transactionHash })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
