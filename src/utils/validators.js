import { getTokenPrice } from "./redstone.js";
import { getEvmTransaction } from "./ethers.js";
import { networkResolver } from "./resolvers.js";
import { POD_CREATION_FEE, SUPPORTED_TOKENS } from "./constants.js";
import assert from "node:assert";

async function validateEvmNativePayment(txid, network, token) {
  try {
    const tokenTicker = (await networkResolver(network, token))?.REDSTONE_KEY;
    const payment = await getEvmTransaction(txid, network, token);
    assert.strictEqual(payment?.validity, true);

    const tokenPrice = await getTokenPrice(tokenTicker);
    assert.strictEqual(!!tokenPrice, true);

    const paidAmount = payment?.amount * tokenPrice;
    const notUnderPaid = Boolean(paidAmount >= 0.95 * POD_CREATION_FEE); // can be 5% underpaid
    assert.strictEqual(notUnderPaid, true);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function validatePayments(masterNetwork, network, token, txid) {
  try {
    assert.strictEqual(SUPPORTED_TOKENS.includes(token.toUpperCase()), true);
    assert.strictEqual(
      ["EVM", "EXOTIC"].includes(masterNetwork.toUpperCase()),
      true
    );

    const key = `${masterNetwork}/${network}/${token}`.toUpperCase();

    switch (key) {
      case "EVM/ETHEREUM/ETH":
        return await validateEvmNativePayment(txid, network, token);
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
