import { Dispatch, SetStateAction } from 'react';

import { ContractCallRegularOptions, FinishedTxData, openContractCall } from '@stacks/connect';
import { StacksNetwork, StacksNetworkName } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import * as yup from 'yup';

import { createBtcAddressSchema } from '@utils/validators/btc-address-validator';
import { stxPrincipalSchema } from '@utils/validators/stx-address-validator';

import { DelegateStackExtendFormValues } from './types';

interface CreateValidationSchemaArgs {
  /**
   * The current burn height
   */
  currentBurnHt: number;

  /**
   * The name of the network the app is live on, e.g., mainnet or testnet.
   */
  network: StacksNetworkName;
}
export function createValidationSchema({ network }: CreateValidationSchemaArgs) {
  return yup.object().shape({
    stacker: stxPrincipalSchema(yup.string(), network),
    extendCount: yup
      .number()
      .defined()
      .positive()
      .integer()
      .min(1) // TODO test for total locking period of max 12 cycles.
      .max(12),
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
  return async function handleSubmit(values: DelegateStackExtendFormValues) {
    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);
    const delegateStackExtendOptions = client.getDelegateStackExtendOptions({
      contract: stackingContract,
      stacker: values.stacker,
      poxAddress: values.poxAddress,
      extendCount: values.extendCount,
    });

    console.log(delegateStackExtendOptions);

    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(delegateStackExtendOptions as ContractCallRegularOptions),
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
