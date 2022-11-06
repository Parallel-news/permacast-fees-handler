import { FEE_COLLECTORS, PUBLIC_RPC } from "./constants.js";

export async function networkResolver(network_key, token) {
  const key = `${network_key}/${token}`.toUpperCase();

  switch (key) {
    case "ETHEREUM/ETH":
      return {
        RPC_URL: PUBLIC_RPC.ethereum,
        FEE_COLLECTOR: FEE_COLLECTORS.evm,
        DECIMALS: 18,
        REDSTONE_KEY: "ETH",
      };
  }
}
