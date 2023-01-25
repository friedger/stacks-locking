import { BigNumber } from 'bignumber.js';

import { stxToMicroStx } from '@utils/unit-convert';

const BigNumberFloorRound = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export function calculateRewardSlots(ustxAmount: BigNumber, minRequireToStack: BigNumber) {
  return new BigNumberFloorRound(ustxAmount).dividedBy(minRequireToStack).integerValue();
}

export function calculateStackingBuffer(ustxAmount: BigNumber, minRequireToStack: BigNumber) {
  if (minRequireToStack.isEqualTo(0)) return null;
  if (ustxAmount.isLessThan(minRequireToStack)) return null;

  return ustxAmount.modulo(minRequireToStack).decimalPlaces(0, BigNumber.ROUND_FLOOR);
}
