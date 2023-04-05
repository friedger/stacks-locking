import { StacksNetwork } from '@stacks/network';

import { EditingFormValues, PoolWrapperAllowanceState } from './types';
import { HandleAllowContractCallerArgs } from './utils-allow-contract-caller';
import {
  getNetworkInstance,
  getPoxWrapperContract,
  requiresAllowContractCaller,
} from './utils-preset-pools';

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
  network: StacksNetwork;
}

export function createHandleSubmit({
  handleDelegateStxSubmit,
  handleAllowContractCallerSubmit,
  hasUserConfirmedPoolWrapperContract,
  setHasUserConfirmedPoolWrapperContract,
  network,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit(values: EditingFormValues) {
    if (values.poolName && requiresAllowContractCaller(values.poolName)) {
      const poxWrapperContract = getPoxWrapperContract(values.poolName, network);
      const networkInstance = getNetworkInstance(network);
      if (hasUserConfirmedPoolWrapperContract[networkInstance]?.[poxWrapperContract]) {
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
