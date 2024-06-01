import { ethers } from "ethers"
import hre from "hardhat"

const AN__ADDRESS = "0x7d8A1BBC50B1AAc5Ad24153B334730254d50b6D8"

const main = async () => {
  const AN = await hre.ethers.getContractAt("AccountNative", AN__ADDRESS)

  const aquariums = await AN.initializeAquarium()
  await aquariums.wait()

  const aq = await AN.getAquariums()
  console.log(aq)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
