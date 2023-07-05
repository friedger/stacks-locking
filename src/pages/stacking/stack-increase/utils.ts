import { NavigateFunction } from 'react-router-dom';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { AccountExtendedBalances, StackingClient } from '@stacks/stacking';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import routes from '@constants/routes';
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

interface CreateHandleSubmitArgs {
  client: StackingClient;
  navigate: NavigateFunction;
  setIsContractCallExtensionPageOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function createHandleSubmit({
  client,
  navigate,
  setIsContractCallExtensionPageOpen,
}: CreateHandleSubmitArgs) {
  return async ({ increaseBy }: EditingFormValues) => {
    if (!client) return;
    const stackingContract = await client.getStackingContract();
    const stackIncreaseOptions = client.getStackIncreaseOptions({
      contract: stackingContract,
      increaseBy: stxToMicroStx(increaseBy).toString(),
    });
    setIsContractCallExtensionPageOpen(true);
    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(stackIncreaseOptions as ContractCallRegularOptions),
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        navigate(routes.DIRECT_STACKING_INFO);
      },
    });
  };
}

export function getAvailableAmountUstx(
  extendedStxBalances: AccountExtendedBalances['stx'],
  stackIncreaseInfo: StackIncreaseInfo | undefined | null
) {
  return new BigNumber(extendedStxBalances.balance.toString())
    .minus(new BigNumber(extendedStxBalances.locked.toString()))
    .minus(new BigNumber(stackIncreaseInfo ? stackIncreaseInfo.increaseBy.toString() : 0));
}
