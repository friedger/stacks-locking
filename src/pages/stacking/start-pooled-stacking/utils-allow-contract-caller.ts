import { Dispatch, SetStateAction } from 'react';

import { pools } from './components/preset-pools';
import { PoolName, Pox2Contract } from './types-preset-pools';
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { noneCV, principalCV } from '@stacks/transactions';

function getOptions(
  poxWrapperContract: Pox2Contract,
  stackingContract: string
): ContractCallRegularOptions {
  const [contractAddress, contractName] = stackingContract.split('.');
  const functionArgs = [principalCV(poxWrapperContract), noneCV()];
  return {
    contractAddress,
    contractName,
    functionName: 'allow-contract-caller',
    functionArgs,
  };
}

interface CreateHandleSubmitArgs {
  client: StackingClient;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
}
export function createHandleSubmit({
  client,
  setIsContractCallExtensionPageOpen,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit({
    poxWrapperContract,
    onFinish,
  }: {
    poxWrapperContract: Pox2Contract;
    onFinish: () => Promise<void>;
  }) {
    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);

    const allowContractCallerOptions = getOptions(poxWrapperContract, stackingContract);

    console.log(allowContractCallerOptions);

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
