import { ethers } from "ethers"

const CA = "0xe46D4F8151c6ED3fC4d030779eD6Fe8502997128"

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

  const tx = {
    to: CA,
    value: ethers.parseEther("0.1"),
    gaslimit: 1000000,
  }

  const txr = await wallet.sendTransaction(tx)
  const r = await txr.wait()
  console.log(`Success: ${r}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
