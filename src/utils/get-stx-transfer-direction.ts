import {
  MempoolTransaction,
  Transaction,
} from "@stacks/stacks-blockchain-api-types";

export type StxTxDirection = "sent" | "received";

export function getStxTxDirection(
  address: string,
  tx: Transaction | MempoolTransaction
): StxTxDirection {
  if (tx.sender_address === address) return "sent";
  return "received";
}
