import { ethers } from "ethers"
const ERC20__ABI = require("../abi/ERC20.json")

const ETHCCIP__ADDRESS = "0x057cc826383106a911AefD2f01a2A9c86472Cb41"
const ARBCCIP__ADDRESS = "0x181d5c5F3a414d5b8385BE90BC8970d73BD903B6"

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()

  // //   ETH-sepolia deployment----------------------
  const ethCCIPRouter = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
  // const ethLINK = "0x779877A7B0D9E8603169DdbD7836e478b4624789"

  // const ethCCIP = await hre.ethers.getContractFactory("Account")
  // const EthCCIP = await ethCCIP.deploy(ethCCIPRouter, ethLINK)
  // await EthCCIP.waitForDeployment()
  // console.log("EthCCIP deployed to:", EthCCIP.target)

  const EthCCIP = await hre.ethers.getContractAt("Account", "0xe46D4F8151c6ED3fC4d030779eD6Fe8502997128")
  const arbAccount__ADDRESS = "0x3d85D55a180e5dB4c415AA2E742a295BD3C62389"
  const arbChain = "3478487238524512106"
  const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

  const tx = await EthCCIP.AAInitializeDestination(
    arbChain,
    arbAccount__ADDRESS,
    EthCCIP.target,
    signer.address,
    ARBccipRouter__ADDRESS,
    { gasLimit: 1000000 }
  )
  console.log(`Transaction hash: ${tx}`)
  const txr = await tx.wait()
  console.log("Transaction confirmed", txr)

  //   WhiteList-----------------------------------
  // const arbChain = "3478487238524512106"

  // const whitelistDestinationTx = await EthCCIP.allowlistDestinationChain(arbChain, true)
  // await whitelistDestinationTx.wait()

  //   Fund CCIP-BnM--------------------------------
  // const ccipBnM__ADDRESS = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05"
  // const CCIPBnM = new ethers.Contract(ccipBnM__ADDRESS, ERC20__ABI, signer)
  // await CCIPBnM.approve(EthCCIP.target, ethers.parseEther("1000"))

  // const transaction = signer.sendTransaction({
  //   from: signer.address,
  //   to: EthCCIP.target,
  //   value: ethers.parseEther("0.1"),
  // })

  // Send Token and Data---------------------------
  // const _destinationChainSelector = "3478487238524512106"
  // const _receiver = ARBCCIP__ADDRESS
  // const _text = "deploy:" + signer.address
  // const _token = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05"
  // const _amount = ethers.parseEther("0.01")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
