import * as yup from 'yup';
import { toHumanReadableStx, stxToMicroStx } from '@utils/unit-convert';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';
import { openContractCall, ContractCallRegularOptions } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { createBtcAddressSchema } from '@utils/validators/btc-address-validator';
import BigNumber from 'bignumber.js';
import { stxBalanceValidator } from '@utils/validators/stx-balance-validator';
import { DirectStackingFormValues } from './types';

interface CreateValidationSchemaArgs {
  /**
   * Available balance of the current account. Used to ensure users don't try to stack more than is available.
   */
  availableBalanceUStx: bigint;

  /**
   * The stacking transaction's estimated fee. Used to ensure the account has enough STX available to both stack the desired amount and pay for the stacking transaction fee.
   */
  transactionFeeUStx: bigint;

  /**
   * The minimum stacking amount, in ustx, required by the PoX contract.
   */
  minimumAmountUStx: bigint;

  /**
   * The name of the network the app is live on, e.g., mainnet or testnet.
   */
  network: string;
}
export function createValidationSchema({
  availableBalanceUStx,
  transactionFeeUStx,
  minimumAmountUStx,
  network,
}: CreateValidationSchemaArgs) {
  return yup.object().shape({
    amount: stxAmountSchema()
      .test(stxBalanceValidator(availableBalanceUStx))
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
      })
      .test({
        name: 'test-min-utx',
        message: `You must stack with at least ${toHumanReadableStx(minimumAmountUStx)}`,
        test: value => {
          if (value === null || value === undefined) return false;
          const uStxInput = stxToMicroStx(value);
          return new BigNumber(minimumAmountUStx.toString()).isLessThanOrEqualTo(uStxInput);
        },
      }),
    lockPeriod: yup.number().defined(),
    poxAddress: createBtcAddressSchema({
      network,
      // TODO
      isPostPeriod1: true,
    }),
  });
}

interface CreateHandleSubmitArgs {
  client: StackingClient;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
  navigate: NavigateFunction;
}
export function createHandleSubmit({
  client,
  setIsContractCallExtensionPageOpen,
  navigate,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(values: DirectStackingFormValues) {
    // TODO: handle thrown errors
    const [stackingContract, coreInfo] = await Promise.all([
      client.getStackingContract(),
      client.getCoreInfo(),
    ]);
    const stackOptions = client.getStackOptions({
      contract: stackingContract,
      amountMicroStx: stxToMicroStx(values.amount).toString(),
      cycles: values.lockPeriod,
      poxAddress: values.poxAddress,
      // TODO
      burnBlockHeight: coreInfo.burn_block_height,
    });

    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(stackOptions as ContractCallRegularOptions),
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        navigate('../direct-stacking-info');
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
