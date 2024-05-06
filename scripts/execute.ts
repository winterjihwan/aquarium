import { ethers } from "ethers"
import fs from "fs/promises"
import path from "path"

const AF_ADDRESS = "0x22bB20dBA3335A266d7e2b14136743A1e7250556"
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const PM_ADDRESS = "0x2355406C9Ea0D4Ce73FE6C0F688B8fF2922398D7"

const Number_ADDRESS = "0x4D1348f8e078AE70e058DfAD5C771541A901978a"

interface UserOperation {
  sender: string | undefined
  nonce: string
  initCode: string
  callData: any
  paymasterAndData: string
  signature: string
  preVerificationGas?: number
  verificationGasLimit?: number
  callGasLimit?: number
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

const readABI = async (address: string) => {
  const dirPath = path.join(__dirname, "../abi")
  const filePath = path.join(dirPath, `${address}.json`)

  try {
    await fs.access(filePath)
    const abiJson = await fs.readFile(filePath, "utf8")
    const abi = JSON.parse(abiJson)
    return abi
  } catch (error) {
    console.error("Error reading ABI from file:", error)
    return null
  }
}

const main = async () => {
  const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS)
  const Paymaster = await hre.ethers.getContractAt("Paymaster", PM_ADDRESS)
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory")
  const Account = await hre.ethers.getContractFactory("Account")

  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address

  //   커스텀 유저 키 생성
  //   const { Wallet } = require('ethers');

  // class CustomSigner {
  //     constructor(privateKey) {
  //         this.wallet = new Wallet(privateKey);
  //     }

  //     async sign(transaction) {
  //         return this.wallet.sign(transaction);
  //     }

  //     async connect(provider) {
  //         return provider;
  //     }
  // }

  // // Usage
  // const customSigner = new CustomSigner('0x0123456789abcdef0123456789abcdef012345678abcdef0123456789abcdef');

  let initCode = AF_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [signerAddress]).slice(2)

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

  console.log({ sender })

  const code = await hre.ethers.provider.getCode(sender)
  if (code != "0x") {
    initCode = "0x"
  }

  // Number contract 임의 컨트랙트 호출 예시 ------------
  const provider = ethers.getDefaultProvider("sepolia")
  const Number_ABI = await readABI(Number_ADDRESS)

  const Number = new ethers.Contract(Number_ADDRESS, Number_ABI, provider)

  // const number = await Number.getNumber();
  // console.log("Prev number", number.toString());

  const numberIncrementCallData = Number.interface.encodeFunctionData("increment")

  // ----------------------------------------------

  const userOp: UserOperation = {
    sender, // smart account address
    nonce: "0x" + (await EntryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute", [Number.target, numberIncrementCallData]),
    // callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PM_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  }

  const { preVerificationGas, verificationGasLimit, callGasLimit } = await hre.ethers.provider.send(
    "eth_estimateUserOperationGas",
    [userOp, EP_ADDRESS]
  )

  userOp.preVerificationGas = preVerificationGas
  userOp.verificationGasLimit = verificationGasLimit
  userOp.callGasLimit = callGasLimit

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData()
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16)

  const maxPriorityFeePerGas = await hre.ethers.provider.send("rundler_maxPriorityFeePerGas")
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas

  const userOpHash = await EntryPoint.getUserOpHash(userOp)
  userOp.signature = await signer.signMessage(hre.ethers.getBytes(userOpHash))

  console.log({ userOp })

  const opHash = await hre.ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS])

  console.log({ opHash })

  setTimeout(async () => {
    const { transactionHash } = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash])

    console.log({ transactionHash })
  }, 30000)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
