import { ethers, randomBytes } from "ethers"

const AFTesting__ADDRESS = "0x20269612573d5885E16808301A73e33DC95123CE"

async function main() {
  const afTesting = await hre.ethers.getContractFactory("AFTesting")
  const AFTesting = await afTesting.deploy()
  await AFTesting.waitForDeployment()
  console.log(`AFTesting deployed to: ${AFTesting.target}`)

  const wallet = ethers.Wallet.createRandom()

  //   const AFTesting = await hre.ethers.getContractAt("AFTesting", AFTesting__ADDRESS)

  // uint8 multiplex,
  // address AAFactory,
  // address AAUser,
  // address router
  const data = await AFTesting.encodeData(
    0,
    "0xDF4769DD71BF3685a9e952C29225C83BF2BC31f9",
    wallet.address,
    "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"
  )
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
