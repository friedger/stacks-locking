import { useFormikContext } from 'formik';
import { useState } from 'react';

import { Action, Step } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { EditingFormValues, PoolWrapperAllowanceState } from '../types';
import { HandleAllowContractCallerArgs } from '../utils-allow-contract-caller';
import { DelegatedStackingTerms } from './delegated-stacking-terms';
import { ActionsForWrapperContract } from './pool-contract-allow';

interface Props {
  isLoading: boolean;
  requiresAllowContractCaller: boolean;
  allowContractCallerTxId: string | undefined;
  handleFirstSubmit: (val: HandleAllowContractCallerArgs) => Promise<void>;
  hasUserConfirmedPoolWrapperContract: PoolWrapperAllowanceState;
  setHasUserConfirmedPoolWrapperContract: React.Dispatch<
    React.SetStateAction<PoolWrapperAllowanceState>
  >;
}
export function ConfirmAndSubmit({
  isLoading,
  requiresAllowContractCaller,
  allowContractCallerTxId,
  handleFirstSubmit,
  hasUserConfirmedPoolWrapperContract,
  setHasUserConfirmedPoolWrapperContract,
}: Props) {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);
  const f = useFormikContext<EditingFormValues>();

  return (
    <Step title="Confirm and pool">
      <DelegatedStackingTerms mt="loose" />
      <StackingUserConfirm onChange={useConfirmed => setHasUserConfirmed(useConfirmed)} />

      {requiresAllowContractCaller && f.values.poolName ? (
        <ActionsForWrapperContract
          hasUserConfirmedPoolWrapperContract={hasUserConfirmedPoolWrapperContract}
          setHasUserConfirmedPoolWrapperContract={setHasUserConfirmedPoolWrapperContract}
          poolName={f.values.poolName}
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
