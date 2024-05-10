import { ethers, randomBytes } from "ethers"

const AF_ARB_ADDRESS = "0x74Ad8Af1Ff7e444Af9256D35Fa415A44E823461c"
const CCIPRouterArb__ADDRESS = "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"

async function main() {
  const afTesting = await hre.ethers.getContractFactory("AFTesting")
  const AFTesting = await afTesting.deploy()
  await AFTesting.waitForDeployment()
  console.log(`AFTesting deployed to: ${AFTesting.target}`)

  const [signer] = await hre.ethers.getSigners()

  //   const AFTesting = await hre.ethers.getContractAt("AFTesting", AFTesting__ADDRESS)

  const data = await AFTesting.encodeData(0, AF_ARB_ADDRESS, signer.address, CCIPRouterArb__ADDRESS)
  console.log("Encoded data: ", data)

  const tx = await AFTesting.onReceive(data)
  const txr = await tx.wait()
  console.log(`Success: ${tx.hash}`)

  const creationAddress = await AFTesting.creationAddress()
  console.log({ creationAddress })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
