
import { AccountExtendedBalances } from '@stacks/stacking';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { stxToMicroStx } from '@utils/unit-convert';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';
import { stxBalanceValidator } from '@utils/validators/stx-balance-validator';

import { StackIncreaseInfo } from '../direct-stacking-info/get-has-pending-stack-increase';

export interface EditingFormValues {
  increaseBy: BigNumber;
}

interface CreateValidationSchemaArgs {
  /**
   * Available unlocked balance of the current account. Used to ensure users don't try to stack more than is available.
   */
  availableBalanceUStx: BigNumber;

  /**
   * The stacking transaction's estimated fee. Used to ensure the account has enough STX available to both stack the desired amount and pay for the stacking transaction fee.
   */
  transactionFeeUStx: bigint;
}

export function createValidationSchema({
  availableBalanceUStx,
  transactionFeeUStx,
}: CreateValidationSchemaArgs) {
  return yup.object().shape({
    increaseBy: stxAmountSchema()
      .test(stxBalanceValidator(BigInt(availableBalanceUStx.toString())))
      .test('test-precision', 'You cannot stack with a precision of less than 1 STX', value => {
        // If `undefined`, throws `required` error
        if (value === undefined) return true;
        return validateDecimalPrecision(0)(value);
      })
      .test({
        name: 'test-fee-margin',
        message: 'You must stack less than your entire balance to allow for the transaction fee',
        test: value => {
          if (value === null || value === undefined) return false;
          const uStxInput = stxToMicroStx(value);
          return !uStxInput.isGreaterThan(
            new BigNumber(availableBalanceUStx.toString()).minus(transactionFeeUStx.toString())
          );
        },
      }),
  });
}

export function getAvailableAmountUstx(
  extendedStxBalances: AccountExtendedBalances['stx'],
  stackIncreaseInfo: StackIncreaseInfo | undefined | null
) {
  return new BigNumber(extendedStxBalances.balance.toString())
    .minus(new BigNumber(extendedStxBalances.locked.toString()))
    .minus(new BigNumber(stackIncreaseInfo ? stackIncreaseInfo.increaseBy.toString() : 0));
}
