import { StackingClient } from '@stacks/stacking';
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { pools } from './components/preset-pools';
import { EditingFormValues } from './types';
import { PoolName, Pox2Contract } from './types-preset-pools';

interface CreateHandleSubmitArgs {
  handleDelegateStxSubmit: (val: EditingFormValues) => Promise<void>;
  handleAllowContractCallerSubmit: ({
    poxWrapperContract,
    onFinish,
  }: {
    poxWrapperContract: Pox2Contract;
    onFinish: () => Promise<void>;
  }) => Promise<void>;
}

function requiresAllowContractCaller(values: EditingFormValues) {
  if (!values.poolName || values.poolName === PoolName.CustomPool) return false;
  let pool = pools[values.poolName];
  console.log(pool.poxContract);
  return pool.poxContract !== Pox2Contract.PoX2;
}

function getPoxWrapperContract(values: EditingFormValues) {
  return values.poolName ? pools[values.poolName].poxContract : Pox2Contract.PoX2;
}

export function createHandleSubmit({
  handleDelegateStxSubmit,
  handleAllowContractCallerSubmit,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(values: EditingFormValues) {
    console.log('SUBMIT', values.poolName);
    if (requiresAllowContractCaller(values)) {
      const poxWrapperContract = getPoxWrapperContract(values);
      handleAllowContractCallerSubmit({
        poxWrapperContract,
        onFinish: () => handleDelegateStxSubmit(values),
      });
    } else {
      handleDelegateStxSubmit(values);
    }
  };
}
