import { StackingClient } from '@stacks/stacking';
import { QueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { pools } from './components/preset-pools';
import { EditingFormValues, PoolWrapperAllowanceState } from './types';
import { PoolName, Pox2Contracts } from './types-preset-pools';
import { HandleAllowContractCallerArgs } from './utils-allow-contract-caller';

interface CreateHandleSubmitArgs {
  hasUserConfirmedPoolWrapperContract: PoolWrapperAllowanceState;
  setHasUserConfirmedPoolWrapperContract: React.Dispatch<
    React.SetStateAction<PoolWrapperAllowanceState>
  >;
  handleDelegateStxSubmit: (val: EditingFormValues) => Promise<void>;
  handleAllowContractCallerSubmit: ({
    poxWrapperContract,
    onFinish,
  }: HandleAllowContractCallerArgs) => Promise<void>;
}

function requiresAllowContractCaller(values: EditingFormValues) {
  if (!values.poolName || values.poolName === PoolName.CustomPool) return false;
  let pool = pools[values.poolName];
  console.log(pool.poxContract);
  return pool.poxContract !== Pox2Contracts.PoX2;
}

function getPoxWrapperContract(values: EditingFormValues) {
  return values.poolName ? pools[values.poolName].poxContract : Pox2Contracts.PoX2;
}

export function createHandleSubmit({
  handleDelegateStxSubmit,
  handleAllowContractCallerSubmit,
  hasUserConfirmedPoolWrapperContract,
  setHasUserConfirmedPoolWrapperContract,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(values: EditingFormValues) {
    console.log('SUBMIT', values.poolName);
    if (requiresAllowContractCaller(values)) {
      const poxWrapperContract = getPoxWrapperContract(values);
      if (hasUserConfirmedPoolWrapperContract[poxWrapperContract]) {
        handleDelegateStxSubmit(values);
        return;
      } else {
        handleAllowContractCallerSubmit({
          poxWrapperContract,
          onFinish: () =>
            setHasUserConfirmedPoolWrapperContract({
              ...hasUserConfirmedPoolWrapperContract,
              [poxWrapperContract]: true,
            }),
        });
        return;
      }
    } else {
      handleDelegateStxSubmit(values);
      return;
    }
  };
}
