import { Dispatch, SetStateAction } from 'react';

import { intToBigInt } from '@stacks/common';
import { ContractCallRegularOptions, FinishedTxData, openContractCall } from '@stacks/connect';
import { StacksNetwork, StacksNetworkName } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { stxToMicroStx } from '@utils/unit-convert';
import { createBtcAddressSchema } from '@utils/validators/btc-address-validator';
import { validateDelegatedStxAmount } from '@utils/validators/delegated-stx-amount-validator';
import { stxPrincipalSchema } from '@utils/validators/stx-address-validator';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';

import { DelegateStackIncreaseFormValues } from './types';

interface CreateValidationSchemaArgs {
  /**
   * The name of the network the app is live on, e.g., mainnet or testnet.
   */
  network: StacksNetworkName;
}
export function createValidationSchema({ network }: CreateValidationSchemaArgs) {
  return yup.object<DelegateStackIncreaseFormValues>().shape({
    amount: stxAmountSchema()
      .test('test-precision', 'You cannot stack with a precision of less than 1 STX', value => {
        // If `undefined`, throws `required` error
        if (value === undefined) return true;
        return validateDecimalPrecision(0)(value);
      })
      .test({
        name: 'test-increase',
        message: 'You must stack more than the currently locked amount',
        test: (value, context) => {
          if (value === null || value === undefined) return false;
          if (context.parent.lockedAmount === undefined) {
            return true;
          }
          const uStxInput = stxToMicroStx(value);
          return uStxInput.isGreaterThan(new BigNumber(context.parent.lockedAmount.toString()));
        },
      })
      .test(validateDelegatedStxAmount()),
    stacker: stxPrincipalSchema(yup.string(), network),
    poxAddress: createBtcAddressSchema({
      network,
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
  return async function handleSubmit(values: DelegateStackIncreaseFormValues) {
    if (values.amount === null) throw new Error('Expected a non-null amount to be submitted.');
    const stackerClient = new StackingClient(values.stacker, network);
    const balances = await stackerClient.getAccountExtendedBalances();
    const increaseBy =
      intToBigInt(stxToMicroStx(values.amount).toString(), false) -
      intToBigInt(balances.stx.locked, false);

    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);
    const delegateStackStxOptions = client.getDelegateStackIncreaseOptions({
      contract: stackingContract,
      stacker: values.stacker,
      increaseBy: increaseBy.toString(),
      poxAddress: values.poxAddress,
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
