import { ethers } from "ethers"
const ERC20__ABI = require("../abi/ERC20.json")

const ETHCCIP__ADDRESS = "0x057cc826383106a911AefD2f01a2A9c86472Cb41"
const ARBCCIP__ADDRESS = "0x181d5c5F3a414d5b8385BE90BC8970d73BD903B6"

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()

  // //   ETH-sepolia deployment----------------------
  // const ethCCIPRouter = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
  // const ethLINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789"

  // const ethCCIP = await hre.ethers.getContractFactory("ProgrammableTokenTransfers")
  // const EthCCIP = await ethCCIP.deploy(ethCCIPRouter, ethLINK)
  // await EthCCIP.waitForDeployment()
  // console.log("EthCCIP deployed to:", EthCCIP.target)

  const EthCCIP = await hre.ethers.getContractAt("ProgrammableTokenTransfers", ETHCCIP__ADDRESS)

  //   WhiteList-----------------------------------
  const arbChain = "3478487238524512106"

  const whitelistDestinationTx = await EthCCIP.allowlistDestinationChain(arbChain, true)
  await whitelistDestinationTx.wait()

  //   Fund CCIP-BnM--------------------------------
  const ccipBnM__ADDRESS = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05"
  const CCIPBnM = new ethers.Contract(ccipBnM__ADDRESS, ERC20__ABI, signer)
  await CCIPBnM.approve(EthCCIP.target, ethers.parseEther("1000"))

  const transaction = signer.sendTransaction({
    from: signer.address,
    to: EthCCIP.target,
    value: ethers.parseEther("0.1"),
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
