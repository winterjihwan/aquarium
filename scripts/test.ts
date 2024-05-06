import hre from "hardhat";
import { ethers } from "ethers";

const NumberAddress = "0x4D1348f8e078AE70e058DfAD5C771541A901978a";
const CallPlayAddress = "0xF287288a89F0D08540Cc5f323e4555bd808aadF7";

async function main() {
  const Number = await hre.ethers.getContractAt("Number", NumberAddress);

  const prevNumber = await Number.getNumber();
  console.log({ prevNumber });

  //   //   view number
  //   const number = await Number.getNumber();
  //   console.log({ number });

  //   //   increment number
  //   await Number.increment();
  //   const incrementedNumber = await Number.getNumber();
  //   console.log({ incrementedNumber });

  const CallPlay = await hre.ethers.getContractAt("CallPlay", CallPlayAddress);

  const data = Number.interface.encodeFunctionData("increment");

  try {
    const tx = await CallPlay.callFunction(NumberAddress, data);
    console.log({ tx });
  } catch (ex) {
    console.log({ ex });
  }

  const newNumber = await Number.getNumber();
  console.log({ newNumber });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
