import { useState } from 'react';

import { Action, Step } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { DelegatedStackingTerms } from './delegated-stacking-terms';

interface Props {
  isLoading: boolean;
  requiresAllowContractCaller: boolean;
  allowContractCallerTxId: string | undefined;
}
export function ConfirmAndSubmit({
  isLoading,
  requiresAllowContractCaller,
  allowContractCallerTxId,
}: Props) {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);
  return (
    <Step title="Confirm and pool">
      <DelegatedStackingTerms mt="loose" />
      <StackingUserConfirm onChange={useConfirmed => setHasUserConfirmed(useConfirmed)} />
      {requiresAllowContractCaller && (
        <Action
          type="submit"
          mr="tight"
          isLoading={isLoading}
          isDisabled={!hasUserConfirmed || allowContractCallerTxId !== undefined}
        >
          Confirm to use use pool contract
        </Action>
      )}
      <Action
        type="submit"
        isLoading={isLoading}
        isDisabled={!hasUserConfirmed || (requiresAllowContractCaller && !allowContractCallerTxId)}
      >
        Confirm and start pooling
      </Action>
    </Step>
  );
}
