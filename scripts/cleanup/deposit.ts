const hre = require("hardhat")

const EP_ETH_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ETH_ADDRESS = "0x822f0304d5152B329b08aA50eE3F9F4FF6742E43"

const main = async () => {
  const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ETH_ADDRESS)

  await EntryPoint.depositTo(PM_ETH_ADDRESS, {
    value: hre.ethers.parseEther("0.8"),
  })

  console.log("deposit was successful!")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
