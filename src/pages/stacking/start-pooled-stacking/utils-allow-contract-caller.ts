import { Dispatch, SetStateAction } from 'react';

import { poolByName } from './components/preset-pools';
import { PoolName } from './types-preset-pools';
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { noneCV, principalCV } from '@stacks/transactions';

function getPoolAdmin(poolName: PoolName) {
  if (poolName === PoolName.CustomPool) {
    throw new Error(`Invalid pool name "${poolName}`);
  } else {
    const pool = poolByName(poolName);
    return pool.poxContract;
  }
}

function getOptions(poolName: PoolName, stackingContract: string): ContractCallRegularOptions {
  const poolAdmin = getPoolAdmin(poolName);
  console.log({ poolAdmin });
  const [contractAddress, contractName] = stackingContract.split('.');
  const functionArgs = [principalCV(poolAdmin), noneCV()];
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
  return async function handleSubmit(poolName: PoolName) {
    // TODO: handle thrown errors
    const [stackingContract] = await Promise.all([client.getStackingContract()]);

    const allowContractCallerOptions = getOptions(poolName, stackingContract);

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
