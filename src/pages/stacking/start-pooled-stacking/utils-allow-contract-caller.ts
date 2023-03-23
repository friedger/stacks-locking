import { Dispatch, SetStateAction } from 'react';

import { pools } from './components/preset-pools';
import { PoolName, Pox2Contract } from './types-preset-pools';
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { noneCV, principalCV } from '@stacks/transactions';
import { useNetwork } from '@components/network-provider';
import { StacksNetwork } from '@stacks/network';

function getOptions(
  poxWrapperContract: Pox2Contract,
  stackingContract: string,
  network: StacksNetwork
): ContractCallRegularOptions {
  const [contractAddress, contractName] = stackingContract.split('.');
  const functionArgs = [principalCV(poxWrapperContract), noneCV()];
  return {
    contractAddress,
    contractName,
    functionName: 'allow-contract-caller',
    functionArgs,
    network,
  };
}

export interface HandleAllowContractCallerArgs {
  poxWrapperContract: Pox2Contract;
  onFinish: () => Promise<void>;
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
  return async function handleSubmit({
    poxWrapperContract,
    onFinish,
  }: HandleAllowContractCallerArgs) {
    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);

    const allowContractCallerOptions = getOptions(poxWrapperContract, stackingContract, network);

    openContractCall({
      ...allowContractCallerOptions,
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        onFinish();
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
