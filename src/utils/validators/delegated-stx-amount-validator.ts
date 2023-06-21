import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { stxToMicroStx } from '@utils/unit-convert';

export function validateDelegatedStxAmount() {
  return {
    name: 'test-delegated-stx-amount',
    message: 'You must stack less than the stacker balance and delegation amount',
    test: (value: number | undefined, context: yup.TestContext) => {
      if (value === null || value === undefined) return false;
      if (
        context.parent.totalAmount === undefined ||
        context.parent.delegatedAmount === undefined
      ) {
        return true;
      }
      const uStxInput = stxToMicroStx(value);
      return (
        uStxInput.isLessThanOrEqualTo(new BigNumber(context.parent.totalAmount.toString())) &&
        uStxInput.isLessThanOrEqualTo(new BigNumber(context.parent.delegatedAmount.toString()))
      );
    },
  };
}
