import { NavigateFunction } from 'react-router-dom';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StacksNetwork, StacksNetworkName } from '@stacks/network';
import { PoxInfo } from '@stacks/stacking';
import { principalCV } from '@stacks/transactions';
import { StackerInfoDetails } from 'src/types/stacking';
import * as yup from 'yup';

import routes from '@constants/routes';
import { stxPrincipalSchema } from '@utils/validators/stx-address-validator';

import { PoxContractName } from '../start-pooled-stacking/types-preset-pools';
import { getPox3Contracts } from '../start-pooled-stacking/utils-preset-pools';

export interface EditingFormValues {
  stacker: string;
}

export function createValidationSchema({ networkName }: { networkName: StacksNetworkName }) {
  return yup.object().shape({
    stacker: stxPrincipalSchema(yup.string(), networkName),
  });
}

interface CreateHandleSubmitArgs {
  navigate: NavigateFunction;
  setIsContractCallExtensionPageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  network: StacksNetwork;
}

export function createHandleSubmit({
  navigate,
  setIsContractCallExtensionPageOpen,
  network,
}: CreateHandleSubmitArgs) {
  return async ({ stacker }: EditingFormValues) => {
    const [contractAddress, contractName] =
      getPox3Contracts(network)[PoxContractName.WrapperFastPool].split('.');
    const delegateStackStxOptions: ContractCallRegularOptions = {
      contractAddress,
      contractName,
      functionName: 'delegate-stack-stx',
      functionArgs: [principalCV(stacker)],
      network,
    };
    setIsContractCallExtensionPageOpen(true);
    openContractCall({
      ...delegateStackStxOptions,
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        navigate(routes.POOLED_STACKING_INFO);
      },
    });
  };
}

/**
 * Calculates a time window for self-service pools that
 * allow any user to extend stacking after half of cycle passed.
 *
 * During that window users can call delegate-stack-stx.
 * @param burnBlockHeight current burn block height
 * @param poxInfo data about cycle length, etc.
 * @returns
 */
export function nextExtendWindow(burnBlockHeight: number, poxInfo: PoxInfo) {
  const halfTheCycle = poxInfo.reward_cycle_length / 2;
  const blocksUntilNextExtendWindow =
    poxInfo.reward_cycle_length -
    ((burnBlockHeight - poxInfo.first_burnchain_block_height + halfTheCycle - 1) %
      poxInfo.reward_cycle_length);
  const blocksUntilCurrentExtendWindowEnds =
    blocksUntilNextExtendWindow - halfTheCycle - poxInfo.prepare_phase_block_length - 1;
  const tooEarly = blocksUntilNextExtendWindow < halfTheCycle;
  const tooLate = blocksUntilCurrentExtendWindowEnds <= 0;
  return {
    extendWindow: {
      blocksUntilStart: blocksUntilNextExtendWindow,
      blocksUntilEnd: blocksUntilCurrentExtendWindowEnds,
    },
    tooEarly,
    tooLate,
  };
}

export function isAtEndOfStackingPeriod(stackerInfoDetails: StackerInfoDetails, poxInfo: PoxInfo) {
  const lastCycle = stackerInfoDetails.first_reward_cycle + stackerInfoDetails.lock_period - 1;
  return poxInfo.current_cycle.id >= lastCycle;
}

export function isAfterEndOfCycle(unlock_height: number, cycleId: number, poxInfo: PoxInfo) {
  const endOfCycle = // equals beginning of the next cycle
    (cycleId + 1) * poxInfo.reward_cycle_length + poxInfo.first_burnchain_block_height;
  return unlock_height >= endOfCycle;
}
