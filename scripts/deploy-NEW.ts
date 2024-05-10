import { ethers } from "ethers"

// NEW - eth
const AccountNative__ADDRESS = "0xF71908103D42FfBD1D2b423a794ca8284Ff124A0"

// NEW - arb
const Creator__ADDRESS = "0x4b377f7fe6206c305765b10Ae504B6f091396710"
const AccountDestination__ADDRESS = "0x5345DF39458d2F1bD846Dd39A3b5Ea2ed8Fb9068"

// AA constants
const AF_ETH_ADDRESS = "0xBfCa7e5d3aFF1f96331d9B6495935422eeE525Ee"
const EP_ETH_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ETH_ADDRESS = "0x22df42a8A913324e44C662D5b2Dcc42972fE589D"

const AF_ARB_ADDRESS = "0x6477997B07775362c07994618588c3E3eDdF367f"
const EP_ARB_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ARB_ADDRESS = ""

// CCIP Constants
const CCIPRouter_ETH__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
const CCIPRouter_ARB__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

const ETHCHAIN = "16015286601757825753"
const ARBCHAIN = "3478487238524512106"

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  //   NEW - eth --------------------------------------------------------------
  //   const accountNative = await hre.ethers.getContractFactory("AccountNative")
  //   const AccountNative = await accountNative.deploy(signer.address, ETHccipRouter__ADDRESS)
  //   await AccountNative.waitForDeployment()
  //   console.log(`AccountNative deployed to: ${AccountNative.target}`)

  // const accountFactory = await hre.ethers.getContractFactory("AccountFactory")
  // const AccountFactory = await accountFactory.deploy()
  // await AccountFactory.waitForDeployment()
  // console.log(`AccountFactory deployed to: ${AccountFactory.target}`)

  //   const paymaster = await hre.ethers.getContractFactory("Paymaster")
  //   const Paymaster = await paymaster.deploy()
  //   await Paymaster.waitForDeployment()
  //   console.log(`Paymaster deployed to: ${Paymaster.target}`)

  //   NEW - arb --------------------------------------------------------------
  const accountFactoryDestination = await hre.ethers.getContractFactory("AccountFactoryDestination")
  const AccountFactoryDestination = await accountFactoryDestination.deploy()
  await AccountFactoryDestination.waitForDeployment()
  console.log(`AccountFactoryDestination deployed to: ${AccountFactoryDestination.target}`)

  // const creator = await hre.ethers.getContractFactory("Creator")
  // const Creator = await creator.deploy(signer.address, ARBccipRouter__ADDRESS)
  // await Creator.waitForDeployment()
  // console.log(`Creator deployed to: ${Creator.target}`)

  //   const accountDestination = await hre.ethers.getContractFactory("AccountDestination")
  //   const AccountDestination = await accountDestination.deploy(
  //     signer.address,
  //     ARBccipRouter__ADDRESS,
  //     AccountNative__ADDRESS
  //   )
  //   await AccountDestination.waitForDeployment()
  //   console.log(`AccountDestination deployed to: ${AccountDestination.target}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
