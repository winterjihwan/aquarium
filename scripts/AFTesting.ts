import { ethers } from "ethers"

const AFTesting__ADDRESS = "0x20269612573d5885E16808301A73e33DC95123CE"

async function main() {
  const afTesting = await hre.ethers.getContractFactory("AFTesting")
  const AFTesting = await afTesting.deploy()
  await AFTesting.waitForDeployment()
  console.log(`AFTesting deployed to: ${AFTesting.target}`)

  //   const AFTesting = await hre.ethers.getContractAt("AFTesting", AFTesting__ADDRESS)

  const data = await AFTesting.encodeData(
    1,
    "0x6aFa57e9271E8E7D018d0bA321D2e53f9Bba75D9",
    "0x10F8BBF39357b5b1Ee82F0C7Bf9d82371df2a1Ff",
    "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165"
  )
  console.log("Encoded data: ", data)

  const tx = await AFTesting.onReceive(data)
  const txr = await tx.wait()
  console.log(`Success: ${tx.hash}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
