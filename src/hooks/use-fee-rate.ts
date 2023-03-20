import { useMemo } from 'react';

import { FEE_RATE } from '@constants/app';

export function useFeeRate() {
  return useMemo(() => ({ feeRate: FEE_RATE }), []);
}
