import { ethers } from "ethers";
import assert from "node:assert";
import { networkResolver } from "./resolvers.js";
import { FEE_COLLECTORS } from "./constants.js";

export async function getEvmTransaction(txid, network, token) {
  try {
    const { RPC_URL, FEE_COLLECTOR, DECIMALS } = await networkResolver(
      network,
      token
    );
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const receipt = await provider.getTransactionReceipt(txid);

    if (receipt?.status) {
      const tx = await provider.getTransaction(txid);
      assert.strictEqual(
        _checksumAddr(tx?.to),
        _checksumAddr(FEE_COLLECTORS.evm)
      );
      const sentAmount = ethers.utils.formatUnits(tx?.value, DECIMALS);
      return {
        validity: true,
        amount: sentAmount,
      };
    }

    return { validity: false };
  } catch (error) {
    console.log(error);
    return { validity: false };
  }
}

function _checksumAddr(address) {
  try {
    return ethers.utils.getAddress(address);
  } catch (error) {
    console.log(error);
    return false;
  }
}
