import axios from "axios"
import fs from "fs/promises"

const targetAddress = "0x4D1348f8e078AE70e058DfAD5C771541A901978a"

const fetchABI = async () => {
  const url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${targetAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`

  const dirPath = "../abi"
  const filePath = `${dirPath}/${targetAddress}.json`

  try {
    const response = await axios.get(url)
    if (response.data.status === "1" && response.data.message === "OK") {
      const abi = JSON.parse(response.data.result)
      console.log("Contract ABI:", abi)

      await fs.writeFile(filePath, JSON.stringify(abi, null, 2))
      console.log(`ABI saved to ${filePath}`)
    } else {
      throw new Error("Failed to retrieve ABI")
    }
  } catch (error) {
    console.error("Error fetching ABI:", error)
  }
}

fetchABI()
