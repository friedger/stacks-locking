import { Dispatch, SetStateAction } from 'react';

import { ContractCallRegularOptions, FinishedTxData, openContractCall } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { stxToMicroStx } from '@utils/unit-convert';
import { createBtcAddressSchema } from '@utils/validators/btc-address-validator';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';
import { stxBalanceValidator } from '@utils/validators/stx-balance-validator';

import { DelegateStackStxFormValues } from './types';

interface CreateValidationSchemaArgs {
  /**
   * Available balance of the current account. Used to ensure users don't try to stack more than is available.
   */
  availableBalanceUStx: bigint;

  /**
   * The current burn height
   */
  currentBurnHt: number;

  /**
   * The name of the network the app is live on, e.g., mainnet or testnet.
   */
  network: string;
}
export function createValidationSchema({
  availableBalanceUStx,
  currentBurnHt,
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
        message: 'You must stack less than the stacker balance and delegation amount',
        test: value => {
          if (value === null || value === undefined) return false;
          const uStxInput = stxToMicroStx(value);
          return !uStxInput.isGreaterThan(new BigNumber(availableBalanceUStx.toString()));
        },
      }),
    lockPeriod: yup.number().defined(),
    startBurnHt: yup.number().test({
      name: 'test-future-start-burn-height',
      message: 'Start burn height must be in the future.',
      test: value => {
        if (value === null || value === undefined) return false;
        return value > currentBurnHt;
      },
    }),
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
  setTxResult: Dispatch<SetStateAction<FinishedTxData | undefined>>;
  network: StacksNetwork;
}
export function createHandleSubmit({
  client,
  setIsContractCallExtensionPageOpen,
  setTxResult,
  network,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(values: DelegateStackStxFormValues) {
    if (values.amount === null) throw new Error('Expected a non-null amount to be submitted.');

    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);
    const delegateStackStxOptions = client.getDelegateStackOptions({
      contract: stackingContract,
      stacker: values.stacker,
      amountMicroStx: stxToMicroStx(values.amount).toString(),
      cycles: values.lockPeriod,
      poxAddress: values.poxAddress,
      burnBlockHeight: values.startBurnHt,
    });

    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(delegateStackStxOptions as ContractCallRegularOptions),
      network,
      onFinish(data) {
        setTxResult(data);
        setIsContractCallExtensionPageOpen(false);
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
