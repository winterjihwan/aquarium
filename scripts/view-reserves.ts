import { ethers } from "ethers"
import hre from "hardhat"

const WETH_USDC_PAIR_ADDRESS = "0xf605cdA0Bf33e42ccac267Db4B8c06496E77937f"

const pairArtifact = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')

const main = async () => {
    const [signer] = await hre.ethers.getSigners();

    const WU_PAIR = new hre.ethers.Contract(WETH_USDC_PAIR_ADDRESS, pairArtifact.abi, signer);
    let reservesWU
    reservesWU = await WU_PAIR.getReserves()
    console.log(`Reserves Usdc - Weth: ${ethers.formatUnits(reservesWU[0], 6)}, ${ethers.formatUnits(reservesWU[1], 18)}`)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})