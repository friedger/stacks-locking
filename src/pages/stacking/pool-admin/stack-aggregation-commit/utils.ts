import { Dispatch, SetStateAction } from 'react';

import { ContractCallRegularOptions, FinishedTxData, openContractCall } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import * as yup from 'yup';

import { createBtcAddressSchema } from '@utils/validators/btc-address-validator';

import { StackAggregationCommitFormValues } from './types';

interface CreateValidationSchemaArgs {
  /**
   * The name of the network the app is live on, e.g., mainnet or testnet.
   */
  network: string;
}
export function createValidationSchema({ network }: CreateValidationSchemaArgs) {
  return yup.object().shape({
    rewardCycleId: yup.number().defined(),
    poxAddress: createBtcAddressSchema({
      network,
    }),
  });
}

interface CreateHandleSubmitArgs {
  client: StackingClient;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
  setTxResult: Dispatch<SetStateAction<FinishedTxData | undefined>>;
}
export function createHandleSubmit({
  client,
  setIsContractCallExtensionPageOpen,
  setTxResult,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(values: StackAggregationCommitFormValues) {
    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);
    const delegateStackStxOptions = client.getStackAggregationCommitOptionsIndexed({
      contract: stackingContract,
      poxAddress: values.poxAddress,
      rewardCycle: values.rewardCycleId,
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
