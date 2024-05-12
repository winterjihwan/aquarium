import { ethers } from "ethers"

async function main() {
  // const af = await hre.ethers.getContractFactory("AccountFactory")
  // const AF = await af.deploy()
  // await AF.waitForDeployment()
  // console.log(`AF deployed to: ${AF.target}`)

  const pm = await hre.ethers.getContractFactory("Paymaster")
  const PM = await pm.deploy()
  await PM.waitForDeployment()
  console.log(`PM deployed to: ${PM.target}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
