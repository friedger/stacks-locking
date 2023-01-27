import { Transaction, MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { c32addressDecode } from 'c32check';

export type StxTxDirection = 'sent' | 'received';

export function getStxTxDirection(
  address: string,
  tx: Transaction | MempoolTransaction
): StxTxDirection {
  if (tx.sender_address === address) return 'sent';
  return 'received';
}
