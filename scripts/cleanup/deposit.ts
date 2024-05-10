const hre = require("hardhat")

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ADDRESS = "0x2355406C9Ea0D4Ce73FE6C0F688B8fF2922398D7"

const main = async () => {
  const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS)

  await EntryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther("0.5"),
  })

  console.log("deposit was successful!")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
