import { useState } from 'react';

import { useFormikContext } from 'formik';

import { Action, Step } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { EditingFormValues, PoolWrapperAllowanceState } from '../types';
import { DelegatedStackingTerms } from './delegated-stacking-terms';
import { ActionsForWrapperContract } from './pool-contract-allow';

interface Props {
  isLoading: boolean;
  requiresAllowContractCaller: boolean;
  allowContractCallerTxId: string | undefined;
  hasUserConfirmedPoolWrapperContract: PoolWrapperAllowanceState;
}
export function ConfirmAndSubmit({
  isLoading,
  requiresAllowContractCaller,
  allowContractCallerTxId,
  hasUserConfirmedPoolWrapperContract,
}: Props) {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);
  const f = useFormikContext<EditingFormValues>();

  return (
    <Step title="Confirm and pool">
      <DelegatedStackingTerms showPoxWrapperTermItem={requiresAllowContractCaller} mt="loose" />
      <StackingUserConfirm onChange={useConfirmed => setHasUserConfirmed(useConfirmed)} />

      {requiresAllowContractCaller && f.values.poolName ? (
        <ActionsForWrapperContract
          hasUserConfirmedPoolWrapperContract={hasUserConfirmedPoolWrapperContract}
          poolName={f.values.poolName}
          isDisabled={!hasUserConfirmed}
        />
      ) : (
        <Action
          type="submit"
          isLoading={isLoading}
          isDisabled={
            !hasUserConfirmed || (requiresAllowContractCaller && !allowContractCallerTxId)
          }
        >
          Confirm and start pooling
        </Action>
      )}
    </Step>
  );
}
