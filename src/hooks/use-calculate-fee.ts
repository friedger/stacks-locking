import { useCallback } from 'react';

import { useFeeRate } from './use-fee-rate';
import BigNumber from 'bignumber.js';

/**
 * Returns a function calculating how much of a fee should be set
 * based on the number of bytes of the transaction.
 */
export function useCalculateFee() {
  const { feeRate } = useFeeRate();
  return useCallback(
    (bytes: number) => BigInt(new BigNumber(feeRate).multipliedBy(bytes).toString()),
    [feeRate]
  );
}
