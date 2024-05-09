import { ethers } from "ethers"

const LinkS_ADDRESS = "0x945f268b9Ffd2038961c265afcb589480bC9fFFe"
const UsdtS_ADDRESS = "0x392fE953882a49b4E705E63d345102086e90d94B"

const main = async () => {
  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  // const usdtS = await hre.ethers.getContractFactory("FreeERC20")
  // const UsdtS = await usdtS.deploy("UsdtSepolia", "USDTS")
  // await UsdtS.waitForDeployment()
  // console.log("UsdtSepolia deployed to:", UsdtS.target)

  const UsdtS = await hre.ethers.getContractAt("FreeERC20", UsdtS_ADDRESS)
  const txUsdtS = await UsdtS.mint(signerAddress, ethers.parseEther("1000"))
  const receiptUsdtS = await txUsdtS.wait()

  const signerUsdtSBalance = await UsdtS.balanceOf(signerAddress)
  console.log({ signerUsdtSBalance })

  //   const linkS = await hre.ethers.getContractFactory("FreeERC20")
  //   const LinkS = await linkS.deploy("LinkSepolia", "LINKS")
  //   await LinkS.waitForDeployment()
  //   console.log("LinkSepolia deployed to:", LinkS.target)

  const LinkS = await hre.ethers.getContractAt("FreeERC20", LinkS_ADDRESS)
  const txLinkS = await LinkS.mint(signerAddress, ethers.parseEther("1000"))
  const receiptLinkS = await txLinkS.wait()

  const signerLinkSBalance = await LinkS.balanceOf(signerAddress)
  console.log({ signerLinkSBalance })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
