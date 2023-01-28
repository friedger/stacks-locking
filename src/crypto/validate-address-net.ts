import { StacksNetworkName } from "@stacks/network";

export function validateAddressChain(
  address: string,
  networkName: StacksNetworkName
) {
  const prefix = address.substring(0, 2);
  if (networkName === "testnet") {
    return prefix === "SN" || prefix === "ST";
  }
  if (networkName === "mainnet") {
    return prefix === "SM" || prefix === "SP";
  }
  return false;
}
