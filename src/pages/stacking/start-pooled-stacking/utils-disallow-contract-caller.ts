import { Dispatch, SetStateAction } from 'react';

import { WrapperPrincipal, Pox2Contracts } from './types-preset-pools';
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { principalCV } from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

function getOptions(
  poxWrapperContract: WrapperPrincipal,
  stackingContract: string,
  network: StacksNetwork
): ContractCallRegularOptions {
  const [contractAddress, contractName] = stackingContract.split('.');
  const functionArgs = [principalCV(poxWrapperContract)];
  return {
    contractAddress,
    contractName,
    functionName: 'disallow-contract-caller',
    functionArgs,
    network,
  };
}

interface CreateHandleSubmitArgs {
  client: StackingClient;
  network: StacksNetwork;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
}
export function createHandleSubmit({
  client,
  network,
  setIsContractCallExtensionPageOpen,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(poxWrapperContract: WrapperPrincipal) {
    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);

    const allowContractCallerOptions = getOptions(poxWrapperContract, stackingContract, network);

    console.log(allowContractCallerOptions);

    openContractCall({
      ...allowContractCallerOptions,
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
