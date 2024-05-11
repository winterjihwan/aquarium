import { ethers } from "ethers"

const Creator__ADDRESS = "0x7f4c63E02BDa3345c21f687F9e737374b9eA2127"

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  const Creator = await hre.ethers.getContractAt("Creator", Creator__ADDRESS)

  const nativeAccount = await Creator.d_nativeAccount()
  const AAUser = await Creator.d_AAUser()
  const router = await Creator.d_router()
  const AAFactory = await Creator.d_AAFactory()
  const multiplex = await Creator.d_multiplex()

  console.log({ nativeAccount, AAUser, router, AAFactory, multiplex })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
