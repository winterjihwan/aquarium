import { ethers } from "ethers"

const AF_ADDRESS = "0x50781572AabB7df01A06672eb83c5F8FefdE56E8"
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const ETHccipRouter__ADDRESS = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"

const main = async () => {
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory")
  const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS)

  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  let initRouter = ETHccipRouter__ADDRESS
  let initCode =
    AF_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [signerAddress, initRouter]).slice(2)

  let sender
  try {
    await EntryPoint.getSenderAddress(initCode)
  } catch (error) {
    if (typeof error === "object" && error !== null && "data" in error) {
      const data = (error as { data: string }).data
      sender = "0x" + data.slice(-40)
    } else {
      console.error(error)
    }
  }

  console.log(`Sender: ${sender}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
