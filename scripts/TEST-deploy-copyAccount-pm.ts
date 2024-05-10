import { ethers } from "ethers"

const CA__ADDRESS = "0xCDE811765c52B75C26Fd9b74757355382ac84092"
const PM__ADDRESS = "0xfA38f65D829aA396Fb84Cbb7f80b734D4837b1ed"

const AF_ADDRESS = "0x948d4b3FC91d27bD71C8525648B3Af1824897e79"
const AF_ARB_ADDRESS = "0x4E4FDC3370D42c41082b3CcA9f4E291f5503f631"

const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const ARBccipRouter__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const ethChain = "16015286601757825753"
const arbChain = "3478487238524512106"

const arbAccount__ADDRESS = "0x5B6Ea6d828c57749cD15B0F7c1558486b02C2e00"

async function main() {
  const [signer] = await hre.ethers.getSigners()

  //   const copyAccount = await hre.ethers.getContractFactory("CopyAccount")
  //   const CA = await copyAccount.deploy(signer.address, ETHccipRouter__ADDRESS)
  //   await CA.waitForDeployment()
  //   console.log(`CA deployed to: ${CA.target}`)

  //   const paymaster = await hre.ethers.getContractFactory("Paymaster")
  //   const PM = await paymaster.deploy()
  //   await PM.waitForDeployment()
  //   console.log(`PM deployed to: ${PM.target}`)

  const CA = await hre.ethers.getContractAt("CopyAccount", CA__ADDRESS)
  const PM = await hre.ethers.getContractAt("Paymaster", PM__ADDRESS)

  const initialize_tx = await CA.AAInitializeDestination(
    arbChain,
    arbAccount__ADDRESS,
    AF_ARB_ADDRESS,
    signer.address,
    ARBccipRouter__ADDRESS,
    PM__ADDRESS
  )
  const txr = await initialize_tx.wait()
  console.log(`AAInitializeDestination txr: ${txr.transactionHash}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
